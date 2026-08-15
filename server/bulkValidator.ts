import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

export interface BulkHeadingItem {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
}

export interface BulkValidationIssue {
  severity: 'error' | 'warning' | 'notice';
  type: 'canonical' | 'meta_description' | 'headings' | 'status' | 'speed';
  message: string;
}

export interface BulkUrlValidationResult {
  url: string;
  normalizedUrl: string;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  pageSizeKb: number;
  title: string;
  titleLength: number;
  canonicalUrl: string | null;
  canonicalStatus: 'valid_match' | 'self_referencing' | 'mismatch' | 'missing' | 'relative' | 'duplicate';
  canonicalDetails: string;
  metaDescription: string | null;
  metaDescriptionLength: number;
  metaDescriptionStatus: 'optimal' | 'missing' | 'too_short' | 'too_long' | 'duplicate';
  metaDescriptionDetails: string;
  h1Count: number;
  h1List: string[];
  h2Count: number;
  h2List: string[];
  headingHierarchy: BulkHeadingItem[];
  hierarchyStatus: 'valid' | 'missing_h1' | 'multiple_h1' | 'empty_h1' | 'missing_h2' | 'skipped_levels';
  hierarchyDetails: string;
  overallScore: number; // 0 - 100
  issues: BulkValidationIssue[];
}

export interface BulkValidationSummary {
  totalUrls: number;
  completedUrls: number;
  avgResponseTimeMs: number;
  healthScore: number;
  canonicalIssuesCount: number;
  missingMetaCount: number;
  headingHierarchyIssuesCount: number;
  httpErrorsCount: number;
  passedCount: number;
}

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) AppleWebKit/537.36';

/**
 * Validates a single URL for Canonical, Meta Description, Headings, and Performance
 */
export async function validateSingleUrl(rawUrl: string, timeoutMs: number = 8000): Promise<BulkUrlValidationResult> {
  let targetUrl = rawUrl.trim();
  while (targetUrl.match(/^(https?:\/\/)+/i)) {
    targetUrl = targetUrl.replace(/^(https?:\/\/)+/i, '');
  }
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl.replace(/^\/+/, '');
  }

  const startTime = Date.now();
  let statusCode = 0;
  let statusText = 'Network Failure';
  let htmlContent = '';
  let pageSizeKb = 0;

  const issues: BulkValidationIssue[] = [];

  try {
    const response = await axios.get(targetUrl, {
      timeout: timeoutMs,
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      validateStatus: () => true, // capture all status codes
      maxRedirects: 5,
    });

    statusCode = response.status;
    statusText = response.statusText || (statusCode === 200 ? 'OK' : `Status ${statusCode}`);
    htmlContent = typeof response.data === 'string' ? response.data : '';
    pageSizeKb = Math.round((Buffer.byteLength(htmlContent, 'utf8') / 1024) * 10) / 10;
  } catch (err: any) {
    statusCode = err.response?.status || 0;
    statusText = err.message || 'Connection / DNS timeout';
  }

  const responseTimeMs = Date.now() - startTime;

  if (statusCode === 0 || statusCode >= 400) {
    issues.push({
      severity: 'error',
      type: 'status',
      message: `HTTP ${statusCode || 'Error'}: ${statusText}`,
    });

    return {
      url: rawUrl,
      normalizedUrl: targetUrl,
      statusCode,
      statusText,
      responseTimeMs,
      pageSizeKb,
      title: '',
      titleLength: 0,
      canonicalUrl: null,
      canonicalStatus: 'missing',
      canonicalDetails: `Failed to fetch page (${statusText})`,
      metaDescription: null,
      metaDescriptionLength: 0,
      metaDescriptionStatus: 'missing',
      metaDescriptionDetails: 'Unreachable page',
      h1Count: 0,
      h1List: [],
      h2Count: 0,
      h2List: [],
      headingHierarchy: [],
      hierarchyStatus: 'missing_h1',
      hierarchyDetails: 'No HTML content parsed',
      overallScore: 0,
      issues,
    };
  }

  if (responseTimeMs > 2000) {
    issues.push({
      severity: 'warning',
      type: 'speed',
      message: `Slow response time: ${responseTimeMs}ms (Threshold: <1500ms)`,
    });
  }

  const $ = cheerio.load(htmlContent);

  // 1. Title Analysis
  const rawTitle = $('title').first().text().trim();
  const titleLength = rawTitle.length;
  if (!rawTitle) {
    issues.push({
      severity: 'error',
      type: 'meta_description',
      message: 'Missing <title> tag in document head',
    });
  }

  // 2. Canonical Tag Analysis
  const canonicalElements = $('link[rel="canonical"]');
  let canonicalUrl: string | null = null;
  let canonicalStatus: BulkUrlValidationResult['canonicalStatus'] = 'valid_match';
  let canonicalDetails = 'Self-referencing canonical tag verified';

  if (canonicalElements.length === 0) {
    canonicalStatus = 'missing';
    canonicalDetails = 'No <link rel="canonical"> tag found on page';
    issues.push({
      severity: 'error',
      type: 'canonical',
      message: 'Missing canonical URL tag. Google may index alternate duplicate URLs.',
    });
  } else if (canonicalElements.length > 1) {
    canonicalStatus = 'duplicate';
    canonicalUrl = canonicalElements.first().attr('href') || null;
    canonicalDetails = `Found ${canonicalElements.length} conflicting canonical tags`;
    issues.push({
      severity: 'error',
      type: 'canonical',
      message: `Multiple (${canonicalElements.length}) conflicting canonical tags present in DOM.`,
    });
  } else {
    canonicalUrl = canonicalElements.attr('href')?.trim() || null;
    if (!canonicalUrl) {
      canonicalStatus = 'missing';
      canonicalDetails = 'Empty href attribute in canonical tag';
      issues.push({
        severity: 'error',
        type: 'canonical',
        message: 'Canonical tag href is empty',
      });
    } else if (!canonicalUrl.startsWith('http://') && !canonicalUrl.startsWith('https://')) {
      canonicalStatus = 'relative';
      canonicalDetails = `Relative canonical detected: "${canonicalUrl}". Should be absolute URL.`;
      issues.push({
        severity: 'warning',
        type: 'canonical',
        message: 'Canonical tag uses a relative path instead of an absolute URL.',
      });
    } else {
      try {
        const parsedTarget = new URL(targetUrl);
        const parsedCanonical = new URL(canonicalUrl);

        const cleanTarget = (parsedTarget.origin + parsedTarget.pathname).replace(/\/$/, '').toLowerCase();
        const cleanCanonical = (parsedCanonical.origin + parsedCanonical.pathname).replace(/\/$/, '').toLowerCase();

        if (cleanTarget === cleanCanonical) {
          canonicalStatus = 'self_referencing';
          canonicalDetails = 'Self-referencing canonical perfectly matches requested URL';
        } else {
          canonicalStatus = 'mismatch';
          canonicalDetails = `Canonical points to: ${canonicalUrl}`;
          issues.push({
            severity: 'warning',
            type: 'canonical',
            message: `Canonical URL (${canonicalUrl}) does not match current URL (${targetUrl}).`,
          });
        }
      } catch {
        canonicalStatus = 'mismatch';
        canonicalDetails = `Invalid canonical URL format: ${canonicalUrl}`;
      }
    }
  }

  // 3. Meta Description Analysis
  const metaDesc = $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    null;
  const cleanMeta = metaDesc ? metaDesc.trim() : null;
  const metaLength = cleanMeta ? cleanMeta.length : 0;
  let metaStatus: BulkUrlValidationResult['metaDescriptionStatus'] = 'optimal';
  let metaDetails = 'Meta description length is optimal';

  if (!cleanMeta || metaLength === 0) {
    metaStatus = 'missing';
    metaDetails = 'Missing meta description tag';
    issues.push({
      severity: 'error',
      type: 'meta_description',
      message: 'No meta description found. Search snippets will be auto-generated by search engines.',
    });
  } else if (metaLength < 50) {
    metaStatus = 'too_short';
    metaDetails = `Too short (${metaLength} chars). Recommended: 120-160 characters.`;
    issues.push({
      severity: 'warning',
      type: 'meta_description',
      message: `Meta description is too short (${metaLength} chars). Expand to at least 120 chars.`,
    });
  } else if (metaLength > 165) {
    metaStatus = 'too_long';
    metaDetails = `Too long (${metaLength} chars). Will truncate in SERP snippets (>160 chars).`;
    issues.push({
      severity: 'warning',
      type: 'meta_description',
      message: `Meta description (${metaLength} chars) exceeds 160 char limit and will be truncated.`,
    });
  } else {
    metaStatus = 'optimal';
    metaDetails = `Optimal length (${metaLength} characters).`;
  }

  // 4. Heading Hierarchy (H1 / H2 / H3 Outline)
  const h1List: string[] = [];
  const h2List: string[] = [];
  const headingHierarchy: BulkHeadingItem[] = [];

  $('h1, h2, h3, h4, h5, h6').each((_, el) => {
    const tagName = (el.tagName || '').toLowerCase() as BulkHeadingItem['tag'];
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text) {
      headingHierarchy.push({ tag: tagName, text });
      if (tagName === 'h1') h1List.push(text);
      if (tagName === 'h2') h2List.push(text);
    }
  });

  let hierarchyStatus: BulkUrlValidationResult['hierarchyStatus'] = 'valid';
  let hierarchyDetails = 'Clean H1 and H2 heading structure';

  if (h1List.length === 0) {
    hierarchyStatus = 'missing_h1';
    hierarchyDetails = 'Missing primary <h1> heading tag on page';
    issues.push({
      severity: 'error',
      type: 'headings',
      message: 'Page is missing an <h1> tag. Required for main topical entity declaration.',
    });
  } else if (h1List.length > 1) {
    hierarchyStatus = 'multiple_h1';
    hierarchyDetails = `Multiple (${h1List.length}) <h1> tags detected`;
    issues.push({
      severity: 'warning',
      type: 'headings',
      message: `Found ${h1List.length} <h1> tags. Best practice is 1 primary <h1> per document.`,
    });
  } else if (h2List.length === 0 && pageSizeKb > 5) {
    hierarchyStatus = 'missing_h2';
    hierarchyDetails = 'No <h2> section headings found for content structuring';
    issues.push({
      severity: 'warning',
      type: 'headings',
      message: 'Page has no <h2> subheadings to divide and structure topical sections.',
    });
  } else {
    // Check for skipped hierarchy (e.g. H1 followed immediately by H3)
    let hasSkipped = false;
    let highestLevelSeen = 1;
    for (const h of headingHierarchy) {
      const level = parseInt(h.tag.replace('h', ''), 10);
      if (level > highestLevelSeen + 1 && level > 2) {
        hasSkipped = true;
        break;
      }
      highestLevelSeen = Math.max(highestLevelSeen, level);
    }
    if (hasSkipped) {
      hierarchyStatus = 'skipped_levels';
      hierarchyDetails = 'Skipped heading hierarchy (e.g., H1 jumping to H3 without H2)';
      issues.push({
        severity: 'notice',
        type: 'headings',
        message: 'Heading levels are skipped out of logical hierarchy (e.g., jumping from H1 to H3).',
      });
    }
  }

  // 5. Calculate Weighted Health Score (0 - 100)
  let score = 100;
  if (statusCode !== 200) score -= 40;
  if (canonicalStatus === 'missing') score -= 20;
  if (canonicalStatus === 'duplicate' || canonicalStatus === 'relative') score -= 15;
  if (metaStatus === 'missing') score -= 20;
  if (metaStatus === 'too_short' || metaStatus === 'too_long') score -= 8;
  if (hierarchyStatus === 'missing_h1') score -= 20;
  if (hierarchyStatus === 'multiple_h1') score -= 10;
  if (hierarchyStatus === 'missing_h2') score -= 5;
  if (responseTimeMs > 2000) score -= 10;
  if (responseTimeMs > 3500) score -= 10;
  if (!rawTitle) score -= 15;

  score = Math.max(0, Math.min(100, score));

  return {
    url: rawUrl,
    normalizedUrl: targetUrl,
    statusCode,
    statusText,
    responseTimeMs,
    pageSizeKb,
    title: rawTitle,
    titleLength,
    canonicalUrl,
    canonicalStatus,
    canonicalDetails,
    metaDescription: cleanMeta,
    metaDescriptionLength: metaLength,
    metaDescriptionStatus: metaStatus,
    metaDescriptionDetails: metaDetails,
    h1Count: h1List.length,
    h1List,
    h2Count: h2List.length,
    h2List,
    headingHierarchy: headingHierarchy.slice(0, 30), // first 30 headings
    hierarchyStatus,
    hierarchyDetails,
    overallScore: score,
    issues,
  };
}

/**
 * Runs parallel validation on 50+ URLs with concurrency limiter
 */
export async function runBulkValidation(
  urls: string[],
  concurrencyLimit: number = 8
): Promise<{ summary: BulkValidationSummary; results: BulkUrlValidationResult[] }> {
  const cleanUrls = urls
    .map(u => u.trim())
    .filter(u => u.length > 0 && !u.startsWith('#'));

  const results: BulkUrlValidationResult[] = [];
  const queue = [...cleanUrls];
  const actualConcurrency = Math.min(Math.max(concurrencyLimit, 1), 15);

  const worker = async () => {
    while (queue.length > 0) {
      const url = queue.shift();
      if (!url) break;
      try {
        const result = await validateSingleUrl(url);
        results.push(result);
      } catch (err: any) {
        results.push({
          url,
          normalizedUrl: url,
          statusCode: 0,
          statusText: err.message || 'Worker Exception',
          responseTimeMs: 0,
          pageSizeKb: 0,
          title: '',
          titleLength: 0,
          canonicalUrl: null,
          canonicalStatus: 'missing',
          canonicalDetails: 'Execution error',
          metaDescription: null,
          metaDescriptionLength: 0,
          metaDescriptionStatus: 'missing',
          metaDescriptionDetails: 'Execution error',
          h1Count: 0,
          h1List: [],
          h2Count: 0,
          h2List: [],
          headingHierarchy: [],
          hierarchyStatus: 'missing_h1',
          hierarchyDetails: 'Execution error',
          overallScore: 0,
          issues: [{ severity: 'error', type: 'status', message: err.message || 'Validation error' }],
        });
      }
    }
  };

  const workers: Promise<void>[] = [];
  for (let i = 0; i < actualConcurrency; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  // Compute Summary Metrics
  let totalScore = 0;
  let totalTime = 0;
  let canonicalIssues = 0;
  let missingMeta = 0;
  let headingIssues = 0;
  let httpErrors = 0;
  let passedCount = 0;

  for (const r of results) {
    totalScore += r.overallScore;
    totalTime += r.responseTimeMs;
    if (r.canonicalStatus !== 'valid_match' && r.canonicalStatus !== 'self_referencing') {
      canonicalIssues++;
    }
    if (r.metaDescriptionStatus !== 'optimal') {
      missingMeta++;
    }
    if (r.hierarchyStatus !== 'valid') {
      headingIssues++;
    }
    if (r.statusCode >= 400 || r.statusCode === 0) {
      httpErrors++;
    }
    if (r.overallScore >= 80) {
      passedCount++;
    }
  }

  const count = Math.max(results.length, 1);
  const summary: BulkValidationSummary = {
    totalUrls: cleanUrls.length,
    completedUrls: results.length,
    avgResponseTimeMs: Math.round(totalTime / count),
    healthScore: Math.round(totalScore / count),
    canonicalIssuesCount: canonicalIssues,
    missingMetaCount: missingMeta,
    headingHierarchyIssuesCount: headingIssues,
    httpErrorsCount: httpErrors,
    passedCount,
  };

  return { summary, results };
}
