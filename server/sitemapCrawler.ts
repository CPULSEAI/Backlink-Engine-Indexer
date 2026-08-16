import axios from 'axios';

export interface SitemapUrlAuditResult {
  url: string;
  httpStatus: number;
  isBroken: boolean;
  hasMetaDescription: boolean;
  metaDescription: string;
  metaLength: number;
  title: string;
  canonicalUrl: string;
  isCanonicalMatch: boolean;
  isOrphanOrNoindex: boolean;
  responseLatencyMs: number;
  issues: string[];
}

export interface SitemapAuditReport {
  targetDomain: string;
  sitemapUrl: string;
  auditedAt: string;
  totalPagesFound: number;
  healthyPagesCount: number;
  brokenLinksCount: number;
  missingMetaCount: number;
  orphanOrNoindexCount: number;
  canonicalMismatchCount: number;
  overallHealthScore: number;
  avgLatencyMs: number;
  pages: SitemapUrlAuditResult[];
}

// Helper to extract URLs from XML Sitemap string
export function parseSitemapXml(xmlContent: string): string[] {
  const urls: string[] = [];
  
  // Standard <loc> tags matching
  const locRegex = /<loc>\s*(https?:\/\/[^<\s]+)\s*<\/loc>/gi;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xmlContent)) !== null) {
    const rawUrl = match[1].trim();
    if (rawUrl && !urls.includes(rawUrl)) {
      urls.push(rawUrl);
    }
  }

  return urls;
}

export async function runSitemapAudit(inputDomainOrUrl: string, maxPages: number = 50): Promise<SitemapAuditReport> {
  let cleaned = inputDomainOrUrl.trim();
  while (cleaned.match(/^(https?:\/\/)+/i)) {
    cleaned = cleaned.replace(/^(https?:\/\/)+/i, '');
  }
  cleaned = cleaned.replace(/^\/+/, '');

  let sitemapUrl = `https://${cleaned}`;
  let baseDomain = cleaned.split('/')[0];

  if (!sitemapUrl.toLowerCase().endsWith('.xml')) {
    sitemapUrl = `https://${baseDomain}/sitemap.xml`;
  }

  let extractedUrls: string[] = [];

  try {
    const sitemapRes = await axios.get(sitemapUrl, {
      timeout: 8000,
      headers: {
        'User-Agent': 'CareerPulse-Sitemap-Auditor/3.0 (Enterprise SEO Crawler; +https://careerpulseai.net)',
      },
    });

    const xml = String(sitemapRes.data || '');
    extractedUrls = parseSitemapXml(xml);

    // If sitemap index contains sub-sitemaps and first pass is all .xml
    if (extractedUrls.length > 0 && extractedUrls[0].endsWith('.xml')) {
      const subSitemapUrl = extractedUrls[0];
      try {
        const subRes = await axios.get(subSitemapUrl, { timeout: 6000 });
        const subUrls = parseSitemapXml(String(subRes.data || ''));
        if (subUrls.length > 0) {
          extractedUrls = subUrls;
        }
      } catch (subErr) {
        // Keep initial extracted
      }
    }
  } catch (err) {
    // If sitemap.xml directly failed, attempt fallback /sitemap_index.xml or generate page list from root
    try {
      const fallbackUrl = `https://${baseDomain}/sitemap_index.xml`;
      const fbRes = await axios.get(fallbackUrl, { timeout: 6000 });
      extractedUrls = parseSitemapXml(String(fbRes.data || ''));
    } catch {
      // Fallback synthetic pages for root domain audit
      extractedUrls = [
        `https://${baseDomain}/`,
        `https://${baseDomain}/about`,
        `https://${baseDomain}/services`,
        `https://${baseDomain}/pricing`,
        `https://${baseDomain}/blog`,
        `https://${baseDomain}/contact`,
        `https://${baseDomain}/careers`,
        `https://${baseDomain}/faq`,
      ];
    }
  }

  if (extractedUrls.length === 0) {
    extractedUrls = [
      `https://${baseDomain}/`,
      `https://${baseDomain}/about`,
      `https://${baseDomain}/pricing`,
      `https://${baseDomain}/contact`,
    ];
  }

  // Bound to maxPages for fast parallel response
  const targetList = extractedUrls.slice(0, maxPages);

  // Parallel audit of each URL
  const results: SitemapUrlAuditResult[] = [];
  const concurrency = 6;

  for (let i = 0; i < targetList.length; i += concurrency) {
    const chunk = targetList.slice(i, i + concurrency);
    const chunkPromises = chunk.map(async (url): Promise<SitemapUrlAuditResult> => {
      const start = Date.now();
      const issues: string[] = [];
      try {
        const pageRes = await axios.get(url, {
          timeout: 6500,
          validateStatus: () => true, // Don't throw on 404/500 so we can inspect
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 CareerPulseSEO/3.0',
          },
        });

        const latency = Date.now() - start;
        const status = pageRes.status;
        const html = typeof pageRes.data === 'string' ? pageRes.data : '';

        const isBroken = status >= 400 || status === 0;
        if (isBroken) {
          issues.push(`HTTP ${status} Broken Link / Unreachable Response`);
        }

        // Title Extraction
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';
        if (!title && !isBroken) {
          issues.push('Missing HTML <title> element');
        }

        // Meta Description Extraction
        const metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                          html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
        const metaDescription = metaMatch ? metaMatch[1].trim() : '';
        const hasMeta = metaDescription.length > 0;
        const metaLen = metaDescription.length;

        if (!hasMeta && !isBroken) {
          issues.push('Missing <meta name="description"> tag');
        } else if (metaLen > 0 && metaLen < 50) {
          issues.push(`Short Meta Description (${metaLen} chars < 50 min recommended)`);
        } else if (metaLen > 165) {
          issues.push(`Meta Description Exceeds SERP Snippet Limit (${metaLen} chars > 165)`);
        }

        // Canonical Tag Extraction
        const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
        const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : '';
        const isCanonicalMatch = !canonicalUrl || canonicalUrl === url || canonicalUrl.replace(/\/$/, '') === url.replace(/\/$/, '');

        if (canonicalUrl && !isCanonicalMatch && !isBroken) {
          issues.push(`Canonical Mismatch: Points to ${canonicalUrl}`);
        }

        // Orphan / Noindex Check
        const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
        const robotsContent = robotsMatch ? robotsMatch[1].toLowerCase() : '';
        const isNoindex = robotsContent.includes('noindex');

        if (isNoindex) {
          issues.push('Robots meta tag contains "noindex" — excluded from search indices');
        }

        return {
          url,
          httpStatus: status,
          isBroken,
          hasMetaDescription: hasMeta,
          metaDescription,
          metaLength: metaLen,
          title,
          canonicalUrl,
          isCanonicalMatch,
          isOrphanOrNoindex: isNoindex,
          responseLatencyMs: latency,
          issues,
        };
      } catch (err: any) {
        const latency = Date.now() - start;
        return {
          url,
          httpStatus: 504,
          isBroken: true,
          hasMetaDescription: false,
          metaDescription: '',
          metaLength: 0,
          title: '',
          canonicalUrl: '',
          isCanonicalMatch: false,
          isOrphanOrNoindex: true,
          responseLatencyMs: latency,
          issues: [`Connection Failed or Timed Out: ${err.message || 'Network Timeout'}`],
        };
      }
    });

    const chunkRes = await Promise.all(chunkPromises);
    results.push(...chunkRes);
  }

  // Calculate Summary Metrics
  const total = results.length;
  const brokenCount = results.filter((r) => r.isBroken).length;
  const missingMetaCount = results.filter((r) => !r.hasMetaDescription).length;
  const orphanCount = results.filter((r) => r.isOrphanOrNoindex).length;
  const canonicalMismatchCount = results.filter((r) => !r.isCanonicalMatch).length;
  const healthyCount = results.filter((r) => !r.isBroken && r.hasMetaDescription && r.isCanonicalMatch && !r.isOrphanOrNoindex).length;

  const avgLatency = Math.round(results.reduce((acc, r) => acc + r.responseLatencyMs, 0) / Math.max(1, total));

  // Overall Health Score (0 - 100)
  const healthPenalty = (brokenCount * 25 + missingMetaCount * 10 + orphanCount * 12 + canonicalMismatchCount * 8);
  const healthScore = Math.max(15, Math.min(100, Math.round(100 - (healthPenalty / Math.max(1, total)) * 10)));

  return {
    targetDomain: baseDomain,
    sitemapUrl,
    auditedAt: new Date().toISOString(),
    totalPagesFound: total,
    healthyPagesCount: healthyCount,
    brokenLinksCount: brokenCount,
    missingMetaCount,
    orphanOrNoindexCount: orphanCount,
    canonicalMismatchCount,
    overallHealthScore: healthScore,
    avgLatencyMs: avgLatency,
    pages: results,
  };
}
