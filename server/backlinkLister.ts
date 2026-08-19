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

export class BulkBacklinkListerService {
  private apiLogin: string;
  private apiPassword: string;
  private useSandbox: boolean;
  private apiUrl = 'https://api.dataforseo.com/v3/backlinks/backlinks/live';

  constructor(apiLogin?: string, apiPassword?: string, useSandbox: boolean = false) {
    this.apiLogin = apiLogin || process.env.DATAFORSEO_LOGIN || '';
    this.apiPassword = apiPassword || process.env.DATAFORSEO_PASSWORD || '';
    this.useSandbox = useSandbox || (!this.apiLogin || !this.apiPassword);
  }

  public cleanTargetDomain(rawUrl: string): string {
    let cleaned = (rawUrl || '').trim();
    cleaned = cleaned.replace(/^(https?:\/\/)+/i, '');
    cleaned = cleaned.split('/')[0].split('?')[0].split('#')[0].trim();
    return cleaned.toLowerCase();
  }

  private generateSyntheticBacklinks(targetDomain: string, limit: number = 100): DomainBacklinksManifest {
    const clean = this.cleanTargetDomain(targetDomain);
    const anchors = [
      `Official ${clean.charAt(0).toUpperCase() + clean.slice(1)}`,
      'API Documentation',
      'Open Source Project Repository',
      'Learn More & Get Started',
      `Why ${clean} is fast and reliable`,
      'Enterprise Reference Architecture',
      'Source Code on GitHub',
      'Developer Community Discussion',
      'Download Latest Package',
      'Full v3 Release Notes & Benchmarks',
      'Integration Quickstart Guide',
      'Case Studies & Whitepapers'
    ];

    const referringDomains = [
      'github.com', 'stackoverflow.com', 'medium.com', 'dev.to',
      'reddit.com', 'news.ycombinator.com', 'techcrunch.com',
      'slashdot.org', 'wikipedia.org', 'producthunt.com', 'hashnode.dev',
      'dzone.com', 'infoq.com', 'freecodecamp.org'
    ];

    const count = Math.min(limit, 25);
    const backlinks: RawBacklinkItem[] = [];

    for (let i = 0; i < count; i++) {
      const refDom = referringDomains[i % referringDomains.length];
      const isDofollow = (i % 4 !== 0);
      const isLost = (i % 8 === 0);
      const rank = Math.max(25, 96 - (i * 3));

      backlinks.push({
        source_url: `https://${refDom}/articles/${clean}-performance-analysis-${100 + i}`,
        target_url: `https://${clean}/docs/v2/getting-started-${i + 1}`,
        anchor_text: anchors[i % anchors.length],
        domain_rank: rank,
        is_dofollow: isDofollow,
        first_seen: '2023-03-12T14:22:11Z',
        last_seen: '2026-08-15T09:11:45Z',
        loss_status: isLost ? 'LOST' : 'ACTIVE'
      });
    }

    return {
      target: targetDomain,
      domain: clean,
      status: 'SUCCESS',
      is_sandbox: true,
      total_rows_returned: backlinks.length,
      backlinks
    };
  }

  public async fetchDetailedBacklinks(targetDomain: string, limit: number = 100): Promise<DomainBacklinksManifest> {
    const cleanTarget = this.cleanTargetDomain(targetDomain);
    if (!cleanTarget) {
      return {
        target: targetDomain,
        domain: '',
        status: 'ERROR',
        error: 'Invalid or empty target domain',
        total_rows_returned: 0,
        backlinks: []
      };
    }

    if (this.useSandbox || !this.apiLogin || !this.apiPassword) {
      await new Promise((res) => setTimeout(res, 50));
      return this.generateSyntheticBacklinks(targetDomain, limit);
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
          error: `DataForSEO returned HTTP status ${response.status}`,
          total_rows_returned: 0,
          backlinks: []
        };
      }

      const tasks = response.data?.tasks || [];
      if (!tasks.length || tasks[0]?.status_code !== 20000) {
        return {
          target: targetDomain,
          domain: cleanTarget,
          status: 'ERROR',
          error: tasks[0]?.status_message || 'API task verification failed',
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
      return {
        target: targetDomain,
        domain: cleanTarget,
        status: 'ERROR',
        error: err?.message || 'DataForSEO detailed backlinks query failed',
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
