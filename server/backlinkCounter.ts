import axios from 'axios';

export interface BacklinkTargetMetric {
  target: string;
  domain: string;
  status: 'SUCCESS' | 'ERROR';
  is_sandbox?: boolean;
  total_backlinks: number;
  referring_domains: number;
  referring_main_domains: number;
  referring_ips: number;
  dofollow_backlinks: number;
  nofollow_backlinks: number;
  dofollow_ratio: number;
  authority_score: number;
  error?: string;
  crawled_at: string;
}

export interface BulkBacklinkSummary {
  total_targets: number;
  successful_targets: number;
  failed_targets: number;
  summary: {
    total_backlinks_sum: number;
    total_referring_domains_sum: number;
    total_referring_ips_sum: number;
    avg_authority_score: number;
    avg_dofollow_ratio: number;
  };
  results: BacklinkTargetMetric[];
}

// Global cooldown tracking for DataForSEO API balance / quota limits
let dataForSeoCooldownUntil = 0;
let dataForSeoCooldownReason = '';

export class BulkBacklinkCounterService {
  private apiLogin: string;
  private apiPassword: string;
  private apiUrl = 'https://api.dataforseo.com/v3/backlinks/summary/live';

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

  public async fetchTargetMetrics(targetDomain: string): Promise<BacklinkTargetMetric> {
    const cleanTarget = this.cleanTargetDomain(targetDomain);
    if (!cleanTarget) {
      return {
        target: targetDomain,
        domain: '',
        status: 'ERROR',
        error: 'Invalid or empty target domain provided.',
        total_backlinks: 0,
        referring_domains: 0,
        referring_main_domains: 0,
        referring_ips: 0,
        dofollow_backlinks: 0,
        nofollow_backlinks: 0,
        dofollow_ratio: 0,
        authority_score: 0,
        crawled_at: new Date().toISOString(),
      };
    }

    if (!this.apiLogin || !this.apiPassword) {
      return {
        target: targetDomain,
        domain: cleanTarget,
        status: 'ERROR',
        error: 'DataForSEO API credentials (DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD) are not configured. Real API authentication is required.',
        total_backlinks: 0,
        referring_domains: 0,
        referring_main_domains: 0,
        referring_ips: 0,
        dofollow_backlinks: 0,
        nofollow_backlinks: 0,
        dofollow_ratio: 0,
        authority_score: 0,
        crawled_at: new Date().toISOString(),
      };
    }

    try {
      const credentials = Buffer.from(`${this.apiLogin}:${this.apiPassword}`).toString('base64');
      const response = await axios.post(
        this.apiUrl,
        [
          {
            target: cleanTarget,
            internal_list_limit: 1,
          },
        ],
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
          timeout: 12000,
        }
      );

      if (response.status !== 200) {
        return {
          target: targetDomain,
          domain: cleanTarget,
          status: 'ERROR',
          error: `DataForSEO API returned HTTP status ${response.status}`,
          total_backlinks: 0,
          referring_domains: 0,
          referring_main_domains: 0,
          referring_ips: 0,
          dofollow_backlinks: 0,
          nofollow_backlinks: 0,
          dofollow_ratio: 0,
          authority_score: 0,
          crawled_at: new Date().toISOString(),
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
          total_backlinks: 0,
          referring_domains: 0,
          referring_main_domains: 0,
          referring_ips: 0,
          dofollow_backlinks: 0,
          nofollow_backlinks: 0,
          dofollow_ratio: 0,
          authority_score: 0,
          crawled_at: new Date().toISOString(),
        };
      }

      const result = tasks[0]?.result?.[0]?.info || tasks[0]?.result?.[0] || {};
      const totalBl = result.backlinks ?? result.total_backlinks ?? 0;
      const refDom = result.referring_domains ?? result.referring_pages ?? 0;
      const refMain = result.referring_main_domains ?? refDom;
      const refIps = result.referring_ips ?? result.referring_subnets ?? 0;
      const dofollow = result.dofollow ?? result.dofollow_backlinks ?? 0;
      const auth = result.rank ?? result.domain_rank ?? 0;

      const dofollowRatio = totalBl > 0 ? Number(((dofollow / totalBl) * 100).toFixed(2)) : 0;

      return {
        target: targetDomain,
        domain: cleanTarget,
        status: 'SUCCESS',
        is_sandbox: false,
        total_backlinks: totalBl,
        referring_domains: refDom,
        referring_main_domains: refMain,
        referring_ips: refIps,
        dofollow_backlinks: dofollow,
        nofollow_backlinks: Math.max(0, totalBl - dofollow),
        dofollow_ratio: dofollowRatio,
        authority_score: auth,
        crawled_at: new Date().toISOString(),
      };
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const apiMessage = err?.response?.data?.tasks?.[0]?.status_message || err?.message || 'DataForSEO live API connection failed';
      return {
        target: targetDomain,
        domain: cleanTarget,
        status: 'ERROR',
        error: statusCode ? `HTTP ${statusCode}: ${apiMessage}` : apiMessage,
        total_backlinks: 0,
        referring_domains: 0,
        referring_main_domains: 0,
        referring_ips: 0,
        dofollow_backlinks: 0,
        nofollow_backlinks: 0,
        dofollow_ratio: 0,
        authority_score: 0,
        crawled_at: new Date().toISOString(),
      };
    }
  }

  public async processBulkTargets(targets: string[], maxConcurrency: number = 20): Promise<BulkBacklinkSummary> {
    const validTargets = targets.map((t) => t.trim()).filter(Boolean);
    if (!validTargets.length) {
      return {
        total_targets: 0,
        successful_targets: 0,
        failed_targets: 0,
        summary: {
          total_backlinks_sum: 0,
          total_referring_domains_sum: 0,
          total_referring_ips_sum: 0,
          avg_authority_score: 0,
          avg_dofollow_ratio: 0,
        },
        results: [],
      };
    }

    const concurrency = Math.max(1, Math.min(maxConcurrency, 50));
    const results: BacklinkTargetMetric[] = [];
    const queue = [...validTargets];

    const worker = async () => {
      while (queue.length > 0) {
        const target = queue.shift();
        if (!target) break;
        const res = await this.fetchTargetMetrics(target);
        results.push(res);
      }
    };

    const workerPool = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workerPool);

    const valid = results.filter((r) => r.status === 'SUCCESS');
    const totalBacklinksSum = valid.reduce((sum, r) => sum + r.total_backlinks, 0);
    const totalReferringDomainsSum = valid.reduce((sum, r) => sum + r.referring_domains, 0);
    const totalReferringIpsSum = valid.reduce((sum, r) => sum + r.referring_ips, 0);
    const avgAuth = valid.length > 0 ? Number((valid.reduce((sum, r) => sum + r.authority_score, 0) / valid.length).toFixed(1)) : 0;
    const avgDofollow = valid.length > 0 ? Number((valid.reduce((sum, r) => sum + r.dofollow_ratio, 0) / valid.length).toFixed(1)) : 0;

    return {
      total_targets: validTargets.length,
      successful_targets: valid.length,
      failed_targets: results.length - valid.length,
      summary: {
        total_backlinks_sum: totalBacklinksSum,
        total_referring_domains_sum: totalReferringDomainsSum,
        total_referring_ips_sum: totalReferringIpsSum,
        avg_authority_score: avgAuth,
        avg_dofollow_ratio: avgDofollow,
      },
      results,
    };
  }
}
