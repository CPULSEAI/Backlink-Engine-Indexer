import axios from 'axios';

export interface RawBacklinkItem {
  source_url: string;
  target_url: string;
  anchor_text: string;
  domain_rank: number;
  is_dofollow: boolean;
  first_seen: string;
  last_seen: string;
  loss_status: 'ACTIVE' | 'LOST';
}

export interface DomainBacklinksManifest {
  target: string;
  domain: string;
  status: 'SUCCESS' | 'ERROR';
  is_sandbox?: boolean;
  total_rows_returned: number;
  backlinks: RawBacklinkItem[];
  error?: string;
}

export interface BulkBacklinkListerReport {
  status: string;
  total_domains: number;
  total_backlinks_extracted: number;
  reports: Record<string, DomainBacklinksManifest>;
}

// Global cooldown tracking for DataForSEO Lister API balance / quota limits
let dataForSeoListerCooldownUntil = 0;
let dataForSeoListerCooldownReason = '';

export class BulkBacklinkListerService {
  private apiLogin: string;
  private apiPassword: string;
  private apiUrl = 'https://api.dataforseo.com/v3/backlinks/backlinks/live';

  constructor(apiLogin?: string, apiPassword?: string) {
    this.apiLogin = apiLogin || process.env.DATAFORSEO_LOGIN || '';
    this.apiPassword = apiPassword || process.env.DATAFORSEO_PASSWORD || '';
  }

  public cleanTargetDomain(rawUrl: string): string {
    let cleaned = (rawUrl || '').trim();
    cleaned = cleaned.replace(/^(https?:\/\/)+/i, '');
    cleaned = cleaned.split('/')[0].split('?')[0].split('#')[0].trim();
    return cleaned.toLowerCase();
  }

  public async fetchDetailedBacklinks(targetDomain: string, limit: number = 100): Promise<DomainBacklinksManifest> {
    const cleanTarget = this.cleanTargetDomain(targetDomain);
    if (!cleanTarget) {
      return {
        target: targetDomain,
        domain: '',
        status: 'ERROR',
        error: 'Invalid or empty target domain provided.',
        total_rows_returned: 0,
        backlinks: []
      };
    }

    if (!this.apiLogin || !this.apiPassword) {
      return {
        target: targetDomain,
        domain: cleanTarget,
        status: 'ERROR',
        error: 'DataForSEO API credentials (DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD) are not configured. Real API authentication is required.',
        total_rows_returned: 0,
        backlinks: []
      };
    }

    try {
      const credentials = Buffer.from(`${this.apiLogin}:${this.apiPassword}`).toString('base64');
      const response = await axios.post(
        this.apiUrl,
        [
          {
            target: cleanTarget,
            limit: limit,
            include_subdomains: true,
            order_by: ['rank,desc']
          }
        ],
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
          timeout: 45000
        }
      );

      if (response.status !== 200) {
        return {
          target: targetDomain,
          domain: cleanTarget,
          status: 'ERROR',
          error: `DataForSEO API returned HTTP status ${response.status}`,
          total_rows_returned: 0,
          backlinks: []
        };
      }

      const tasks = response.data?.tasks || [];
      if (!tasks.length || tasks[0]?.status_code !== 20000) {
        const errorMsg = tasks[0]?.status_message || `DataForSEO Task status: ${tasks[0]?.status_code || 'Unknown'}`;
        return {
          target: targetDomain,
          domain: cleanTarget,
          status: 'ERROR',
          error: errorMsg,
          total_rows_returned: 0,
          backlinks: []
        };
      }

      const result = tasks[0]?.result?.[0] || {};
      const items = result.items || [];
      const backlinks: RawBacklinkItem[] = items.map((item: any) => ({
        source_url: item.url_from || '',
        target_url: item.url_to || '',
        anchor_text: item.anchor || '',
        domain_rank: item.rank || 0,
        is_dofollow: !item.is_nofollow,
        first_seen: item.first_seen || '',
        last_seen: item.last_seen || '',
        loss_status: item.is_lost ? 'LOST' : 'ACTIVE'
      }));

      return {
        target: targetDomain,
        domain: cleanTarget,
        status: 'SUCCESS',
        is_sandbox: false,
        total_rows_returned: backlinks.length,
        backlinks
      };
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const apiMessage = err?.response?.data?.tasks?.[0]?.status_message || err?.message || 'DataForSEO live API connection failed';
      return {
        target: targetDomain,
        domain: cleanTarget,
        status: 'ERROR',
        error: statusCode ? `HTTP ${statusCode}: ${apiMessage}` : apiMessage,
        total_rows_returned: 0,
        backlinks: []
      };
    }
  }

  public async generateBulkReports(
    targets: string[],
    linksPerTarget: number = 100,
    maxConcurrency: number = 5
  ): Promise<BulkBacklinkListerReport> {
    const validTargets = targets.map((t) => t.trim()).filter(Boolean);
    if (!validTargets.length) {
      return {
        status: 'SUCCESS',
        total_domains: 0,
        total_backlinks_extracted: 0,
        reports: {}
      };
    }

    const concurrency = Math.max(1, Math.min(maxConcurrency, 20));
    const reports: Record<string, DomainBacklinksManifest> = {};
    const queue = [...validTargets];

    const worker = async () => {
      while (queue.length > 0) {
        const target = queue.shift();
        if (!target) break;
        const res = await this.fetchDetailedBacklinks(target, linksPerTarget);
        const key = res.domain || res.target;
        reports[key] = res;
      }
    };

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);

    const totalExtracted = Object.values(reports).reduce(
      (sum, r) => sum + (r.backlinks ? r.backlinks.length : 0),
      0
    );

    return {
      status: 'SUCCESS',
      total_domains: Object.keys(reports).length,
      total_backlinks_extracted: totalExtracted,
      reports
    };
  }
}
