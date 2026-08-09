import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export interface AuditIssue {
  id: string;
  type: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  url: string;
  details?: string;
}

export interface CrawledPageResult {
  url: string;
  statusCode: number;
  responseTimeMs: number;
  title: string;
  metaDescription: string;
  h1s: string[];
  metaRobots: string;
  isNoIndex: boolean;
  internalLinks: string[];
  externalLinks: string[];
  imagesTotal: number;
  imagesMissingAlt: Array<{ src: string; location: string }>;
  issues: AuditIssue[];
}

export interface AuditReport {
  baseURL: string;
  targetDomain: string;
  crawledAt: string;
  totalPagesCrawled: number;
  healthScore: number; // 0-100
  summary: {
    totalIssues: number;
    highImpactCount: number;
    mediumImpactCount: number;
    lowImpactCount: number;
    brokenLinksCount: number;
    missingAltCount: number;
    missingTitleCount: number;
    noIndexCount: number;
    avgResponseTimeMs: number;
  };
  pages: CrawledPageResult[];
  issuesByImpact: {
    high: AuditIssue[];
    medium: AuditIssue[];
    low: AuditIssue[];
  };
  brokenLinks: Array<{ sourceUrl: string; targetUrl: string; statusCode: number }>;
}

export async function crawlWebsiteAudit(
  startUrl: string,
  maxPages: number = 20,
  onProgress?: (progress: { current: number; total: number; currentUrl: string }) => void
): Promise<AuditReport> {
  // Ensure clean protocol without duplicates
  let normalizedStart = startUrl.trim();
  while (normalizedStart.match(/^(https?:\/\/)+/i)) {
    normalizedStart = normalizedStart.replace(/^(https?:\/\/)+/i, '');
  }
  normalizedStart = 'https://' + normalizedStart.replace(/^\/+/, '');

  const parsedStart = new URL(normalizedStart);
  const targetDomain = parsedStart.hostname;
  const origin = parsedStart.origin;

  const visited = new Set<string>();
  const queue: string[] = [parsedStart.href];
  const pages: CrawledPageResult[] = [];
  const brokenLinks: Array<{ sourceUrl: string; targetUrl: string; statusCode: number }> = [];

  let totalResponseTimeMs = 0;

  while (queue.length > 0 && visited.size < maxPages) {
    const currentUrl = queue.shift()!;

    // Normalize URL format
    let cleanUrl: string;
    try {
      const u = new URL(currentUrl);
      u.hash = ''; // remove anchor fragment
      cleanUrl = u.href;
    } catch {
      continue;
    }

    if (visited.has(cleanUrl)) continue;
    visited.add(cleanUrl);

    if (onProgress) {
      onProgress({
        current: visited.size,
        total: Math.min(queue.length + visited.size, maxPages),
        currentUrl: cleanUrl
      });
    }

    const startTime = Date.now();
    let statusCode = 0;
    let html = '';
    let responseTimeMs = 0;

    try {
      const response = await axios.get(cleanUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Technical-SEO-Audit-Crawler/2.0 (compatible; Googlebot/2.1)'
        },
        timeout: 8000,
        maxRedirects: 5,
        validateStatus: () => true // capture 404s and 500s without throwing
      });

      responseTimeMs = Date.now() - startTime;
      totalResponseTimeMs += responseTimeMs;
      statusCode = response.status;

      if (statusCode >= 200 && statusCode < 300) {
        html = typeof response.data === 'string' ? response.data : '';
      }
    } catch (err: any) {
      responseTimeMs = Date.now() - startTime;
      statusCode = err.response?.status || 0;
    }

    const issues: AuditIssue[] = [];

    // Flag 404s / Broken status
    if (statusCode === 404 || statusCode >= 500 || statusCode === 0) {
      issues.push({
        id: `issue_${visited.size}_broken`,
        type: 'BROKEN_PAGE',
        impact: 'HIGH',
        title: `Page returned HTTP ${statusCode || 'Timeout/Error'}`,
        description: `The page at ${cleanUrl} could not be loaded cleanly.`,
        url: cleanUrl
      });

      pages.push({
        url: cleanUrl,
        statusCode,
        responseTimeMs,
        title: '',
        metaDescription: '',
        h1s: [],
        metaRobots: '',
        isNoIndex: false,
        internalLinks: [],
        externalLinks: [],
        imagesTotal: 0,
        imagesMissingAlt: [],
        issues
      });
      continue;
    }

    // Parse HTML with Cheerio
    const $ = cheerio.load(html);

    // Extract Title
    const rawTitle = $('title').first().text().trim();
    if (!rawTitle) {
      issues.push({
        id: `issue_${visited.size}_missing_title`,
        type: 'MISSING_TITLE',
        impact: 'HIGH',
        title: 'Missing <title> Tag',
        description: 'Page has no title tag, which severely hurts SEO click-through and search ranking.',
        url: cleanUrl
      });
    } else if (rawTitle.length > 65) {
      issues.push({
        id: `issue_${visited.size}_long_title`,
        type: 'LONG_TITLE',
        impact: 'LOW',
        title: 'Title Tag Exceeds Recommended Length',
        description: `Title tag is ${rawTitle.length} characters long (recommended max 60-65 chars).`,
        url: cleanUrl,
        details: `Title: "${rawTitle}"`
      });
    }

    // Extract Meta Description
    const metaDescription =
      $('meta[name="description" i]').attr('content')?.trim() ||
      $('meta[property="og:description" i]').attr('content')?.trim() ||
      '';

    if (!metaDescription) {
      issues.push({
        id: `issue_${visited.size}_missing_meta_desc`,
        type: 'MISSING_META_DESC',
        impact: 'MEDIUM',
        title: 'Missing Meta Description',
        description: 'Page lacks a meta description tag.',
        url: cleanUrl
      });
    } else if (metaDescription.length < 50) {
      issues.push({
        id: `issue_${visited.size}_short_meta_desc`,
        type: 'SHORT_META_DESC',
        impact: 'LOW',
        title: 'Meta Description Is Too Short',
        description: `Meta description is only ${metaDescription.length} characters (recommended 120-160 chars).`,
        url: cleanUrl
      });
    }

    // Extract H1s
    const h1s: string[] = [];
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1s.push(text);
    });

    if (h1s.length === 0) {
      issues.push({
        id: `issue_${visited.size}_missing_h1`,
        type: 'MISSING_H1',
        impact: 'HIGH',
        title: 'Missing H1 Heading',
        description: 'No <h1> tag was found on this page.',
        url: cleanUrl
      });
    } else if (h1s.length > 1) {
      issues.push({
        id: `issue_${visited.size}_duplicate_h1`,
        type: 'DUPLICATE_H1',
        impact: 'HIGH',
        title: 'Multiple H1 Headings Found',
        description: `Page contains ${h1s.length} <h1> tags. Pages should generally have exactly one main H1.`,
        url: cleanUrl,
        details: h1s.join(' | ')
      });
    }

    // Extract Meta Robots & Check Noindex
    const metaRobots = $('meta[name="robots" i]').attr('content')?.toLowerCase() || '';
    const isNoIndex = metaRobots.includes('noindex');
    if (isNoIndex) {
      issues.push({
        id: `issue_${visited.size}_noindex`,
        type: 'NOINDEX_TAG',
        impact: 'HIGH',
        title: 'Page Marked as NoIndex',
        description: 'The page contains a meta noindex tag, preventing search engines from indexing it.',
        url: cleanUrl
      });
    }

    // Check Slow Response Time
    if (responseTimeMs > 1500) {
      issues.push({
        id: `issue_${visited.size}_slow_response`,
        type: 'SLOW_PAGE',
        impact: 'MEDIUM',
        title: 'Slow Server Response Time',
        description: `Server took ${responseTimeMs}ms to respond (recommended < 1000ms).`,
        url: cleanUrl
      });
    }

    // Extract Images & Check Missing Alt
    const imagesMissingAlt: Array<{ src: string; location: string }> = [];
    let imagesTotal = 0;

    $('img').each((_, el) => {
      imagesTotal++;
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      const alt = $(el).attr('alt');
      if (alt === undefined || alt.trim() === '') {
        imagesMissingAlt.push({
          src: src || 'unknown_image_source',
          location: cleanUrl
        });
      }
    });

    if (imagesMissingAlt.length > 0) {
      issues.push({
        id: `issue_${visited.size}_missing_alt`,
        type: 'MISSING_ALT_TEXT',
        impact: 'MEDIUM',
        title: `${imagesMissingAlt.length} Images Missing Alt Text`,
        description: 'Images without alt attributes hurt accessibility and image search indexing.',
        url: cleanUrl,
        details: `${imagesMissingAlt.length} out of ${imagesTotal} images missing alt tags`
      });
    }

    // Extract Links (Internal & External)
    const internalLinksSet = new Set<string>();
    const externalLinksSet = new Set<string>();

    $('a[href]').each((_, el) => {
      const rawHref = $(el).attr('href')?.trim();
      if (!rawHref || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
        return;
      }

      try {
        const resolved = new URL(rawHref, cleanUrl);
        resolved.hash = ''; // strip anchor

        if (resolved.hostname === targetDomain) {
          internalLinksSet.add(resolved.href);
          // Add to crawl queue if strictly within target domain and not yet visited
          if (!visited.has(resolved.href) && !queue.includes(resolved.href) && queue.length + visited.size < maxPages * 2) {
            queue.push(resolved.href);
          }
        } else {
          externalLinksSet.add(resolved.href);
        }
      } catch {
        // Invalid link syntax
      }
    });

    const internalLinks = Array.from(internalLinksSet);
    const externalLinks = Array.from(externalLinksSet);

    if (internalLinks.length > 120) {
      issues.push({
        id: `issue_${visited.size}_excessive_links`,
        type: 'EXCESSIVE_LINKS',
        impact: 'LOW',
        title: 'Excessive Internal Links',
        description: `Page contains ${internalLinks.length} internal links, which may dilute link equity.`,
        url: cleanUrl
      });
    }

    pages.push({
      url: cleanUrl,
      statusCode,
      responseTimeMs,
      title: rawTitle,
      metaDescription,
      h1s,
      metaRobots,
      isNoIndex,
      internalLinks,
      externalLinks,
      imagesTotal,
      imagesMissingAlt,
      issues
    });
  }

  // Aggregate issues by impact
  const allIssues = pages.flatMap((p) => p.issues);
  const highImpact = allIssues.filter((i) => i.impact === 'HIGH');
  const mediumImpact = allIssues.filter((i) => i.impact === 'MEDIUM');
  const lowImpact = allIssues.filter((i) => i.impact === 'LOW');

  // Calculate Health Score (100 base minus deductions: High -15, Medium -5, Low -1 per page)
  let penalty = 0;
  pages.forEach((p) => {
    p.issues.forEach((iss) => {
      if (iss.impact === 'HIGH') penalty += 15;
      else if (iss.impact === 'MEDIUM') penalty += 5;
      else if (iss.impact === 'LOW') penalty += 1;
    });
  });

  const healthScore = Math.max(0, Math.min(100, Math.round(100 - penalty / Math.max(1, pages.length))));

  const totalPages = pages.length || 1;
  const avgResponseTimeMs = Math.round(totalResponseTimeMs / totalPages);

  const missingTitleCount = pages.filter((p) => !p.title).length;
  const noIndexCount = pages.filter((p) => p.isNoIndex).length;
  const missingAltCount = pages.reduce((acc, p) => acc + p.imagesMissingAlt.length, 0);
  const brokenLinksCount = pages.filter((p) => p.statusCode === 404 || p.statusCode >= 500).length;

  return {
    baseURL: normalizedStart,
    targetDomain,
    crawledAt: new Date().toISOString(),
    totalPagesCrawled: pages.length,
    healthScore,
    summary: {
      totalIssues: allIssues.length,
      highImpactCount: highImpact.length,
      mediumImpactCount: mediumImpact.length,
      lowImpactCount: lowImpact.length,
      brokenLinksCount,
      missingAltCount,
      missingTitleCount,
      noIndexCount,
      avgResponseTimeMs
    },
    pages,
    issuesByImpact: {
      high: highImpact,
      medium: mediumImpact,
      low: lowImpact
    },
    brokenLinks
  };
}
