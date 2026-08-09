#!/usr/bin/env node

/**
 * Technical SEO Website Audit Crawler CLI
 * 
 * Usage:
 *   node scripts/seo-crawler.js <baseURL> [maxPages]
 *   node scripts/seo-crawler.js https://example.com 20
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Parse CLI Args
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
============================================================
🔍 TECHNICAL SEO WEBSITE AUDIT CRAWLER (Node.js + Cheerio)
============================================================

Usage:
  node scripts/seo-crawler.js <baseURL> [maxPages]

Examples:
  node scripts/seo-crawler.js https://example.com
  node scripts/seo-crawler.js https://example.com 25

Features:
  ✓ Domain Lock: Stays strictly within the starting domain
  ✓ Duplicate Protection: Uses visited Set data structure
  ✓ Page Audit: Extracts Title, Meta Description, H1, Status Code, Links, Image Alt gaps
  ✓ Technical Issue Detection: Missing titles, duplicate H1s, 404s, slow pages, noindex
  ✓ Impact Prioritization: High / Medium / Low severity grouping
  ✓ Console Table + Structured JSON Output (audit-results.json)
  `);
  process.exit(0);
}

let startUrl = args[0].trim();
if (!startUrl.startsWith('http://') && !startUrl.startsWith('https://')) {
  startUrl = 'https://' + startUrl;
}

const maxPages = parseInt(args[1], 10) || 20;

let parsedStart;
try {
  parsedStart = new URL(startUrl);
} catch (err) {
  console.error(`❌ Invalid URL provided: ${startUrl}`);
  process.exit(1);
}

const targetDomain = parsedStart.hostname;
const visited = new Set();
const queue = [parsedStart.href];
const pages = [];

console.log(`\n🚀 Starting Technical SEO Crawl`);
console.log(`📌 Target Domain: ${targetDomain}`);
console.log(`⚡ Max Pages Limit: ${maxPages}\n`);

async function runCrawl() {
  const startTimeAll = Date.now();

  while (queue.length > 0 && visited.size < maxPages) {
    const currentUrl = queue.shift();

    let cleanUrl;
    try {
      const u = new URL(currentUrl);
      u.hash = '';
      cleanUrl = u.href;
    } catch {
      continue;
    }

    if (visited.has(cleanUrl)) continue;
    visited.add(cleanUrl);

    process.stdout.write(`[${visited.size}/${maxPages}] Crawling: ${cleanUrl.substring(0, 70)}... `);

    const startPageTime = Date.now();
    let statusCode = 0;
    let html = '';
    let responseTimeMs = 0;

    try {
      const res = await axios.get(cleanUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Technical-SEO-Crawler/2.0'
        },
        timeout: 8000,
        validateStatus: () => true
      });
      responseTimeMs = Date.now() - startPageTime;
      statusCode = res.status;
      if (statusCode >= 200 && statusCode < 300) {
        html = typeof res.data === 'string' ? res.data : '';
      }
      console.log(`[HTTP ${statusCode}] (${responseTimeMs}ms)`);
    } catch (err) {
      responseTimeMs = Date.now() - startPageTime;
      statusCode = err.response?.status || 0;
      console.log(`[HTTP ${statusCode || 'ERR'}] (${responseTimeMs}ms)`);
    }

    const issues = [];

    if (statusCode === 404 || statusCode >= 500 || statusCode === 0) {
      issues.push({
        type: 'BROKEN_PAGE',
        impact: 'HIGH',
        title: `Page HTTP Status ${statusCode}`,
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
        internalLinksCount: 0,
        externalLinksCount: 0,
        imagesTotal: 0,
        imagesMissingAlt: [],
        issues
      });
      continue;
    }

    const $ = cheerio.load(html);

    // Title tag
    const title = $('title').first().text().trim();
    if (!title) {
      issues.push({ type: 'MISSING_TITLE', impact: 'HIGH', title: 'Missing <title> tag', url: cleanUrl });
    } else if (title.length > 65) {
      issues.push({ type: 'LONG_TITLE', impact: 'LOW', title: `Title length (${title.length} chars) > 65`, url: cleanUrl });
    }

    // Meta description
    const metaDesc = $('meta[name="description" i]').attr('content')?.trim() || '';
    if (!metaDesc) {
      issues.push({ type: 'MISSING_META_DESC', impact: 'MEDIUM', title: 'Missing meta description', url: cleanUrl });
    } else if (metaDesc.length < 50) {
      issues.push({ type: 'SHORT_META_DESC', impact: 'LOW', title: `Meta desc short (${metaDesc.length} chars)`, url: cleanUrl });
    }

    // H1 tags
    const h1s = [];
    $('h1').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) h1s.push(txt);
    });

    if (h1s.length === 0) {
      issues.push({ type: 'MISSING_H1', impact: 'HIGH', title: 'Missing <h1> heading', url: cleanUrl });
    } else if (h1s.length > 1) {
      issues.push({ type: 'DUPLICATE_H1', impact: 'HIGH', title: `Multiple <h1> headings (${h1s.length})`, url: cleanUrl });
    }

    // Meta robots
    const metaRobots = $('meta[name="robots" i]').attr('content')?.toLowerCase() || '';
    const isNoIndex = metaRobots.includes('noindex');
    if (isNoIndex) {
      issues.push({ type: 'NOINDEX_TAG', impact: 'HIGH', title: 'Page marked as noindex', url: cleanUrl });
    }

    // Slow response
    if (responseTimeMs > 1500) {
      issues.push({ type: 'SLOW_PAGE', impact: 'MEDIUM', title: `Slow response time (${responseTimeMs}ms)`, url: cleanUrl });
    }

    // Images alt text
    const imagesMissingAlt = [];
    let imagesTotal = 0;
    $('img').each((_, el) => {
      imagesTotal++;
      const src = $(el).attr('src') || '';
      const alt = $(el).attr('alt');
      if (alt === undefined || alt.trim() === '') {
        imagesMissingAlt.push(src || 'unknown_src');
      }
    });

    if (imagesMissingAlt.length > 0) {
      issues.push({
        type: 'MISSING_ALT_TEXT',
        impact: 'MEDIUM',
        title: `${imagesMissingAlt.length} images missing alt text`,
        url: cleanUrl
      });
    }

    // Links extraction
    const internalLinks = new Set();
    const externalLinks = new Set();

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')?.trim();
      if (!href || href.startsWith('javascript:') || href.startsWith('mailto:')) return;

      try {
        const resolved = new URL(href, cleanUrl);
        resolved.hash = '';
        if (resolved.hostname === targetDomain) {
          internalLinks.add(resolved.href);
          if (!visited.has(resolved.href) && !queue.includes(resolved.href)) {
            queue.push(resolved.href);
          }
        } else {
          externalLinks.add(resolved.href);
        }
      } catch {
        // ignore invalid URL
      }
    });

    pages.push({
      url: cleanUrl,
      statusCode,
      responseTimeMs,
      title,
      metaDescription: metaDesc,
      h1s,
      metaRobots,
      isNoIndex,
      internalLinksCount: internalLinks.size,
      externalLinksCount: externalLinks.size,
      imagesTotal,
      imagesMissingAlt,
      issues
    });
  }

  const durationSec = ((Date.now() - startTimeAll) / 1000).toFixed(1);
  const allIssues = pages.flatMap((p) => p.issues);
  const highImpact = allIssues.filter((i) => i.impact === 'HIGH');
  const mediumImpact = allIssues.filter((i) => i.impact === 'MEDIUM');
  const lowImpact = allIssues.filter((i) => i.impact === 'LOW');

  console.log(`\n============================================================`);
  console.log(`📊 AUDIT SUMMARY FOR: ${startUrl}`);
  console.log(`============================================================`);
  console.log(`• Total Pages Crawled: ${pages.length}`);
  console.log(`• Execution Time:      ${durationSec}s`);
  console.log(`• Total Issues Found:  ${allIssues.length}`);
  console.log(`  🔴 HIGH Impact:       ${highImpact.length}`);
  console.log(`  🟡 MEDIUM Impact:     ${mediumImpact.length}`);
  console.log(`  🔵 LOW Impact:        ${lowImpact.length}`);

  // Print High & Medium Impact Summary Console Table
  if (highImpact.length > 0) {
    console.log(`\n🔴 HIGH IMPACT ISSUES (CRITICAL ACTION REQUIRED):`);
    console.table(
      highImpact.map((iss) => ({
        Issue: iss.title,
        URL: iss.url.length > 55 ? iss.url.substring(0, 52) + '...' : iss.url
      }))
    );
  }

  if (mediumImpact.length > 0) {
    console.log(`\n🟡 MEDIUM IMPACT ISSUES:`);
    console.table(
      mediumImpact.map((iss) => ({
        Issue: iss.title,
        URL: iss.url.length > 55 ? iss.url.substring(0, 52) + '...' : iss.url
      }))
    );
  }

  // Save to JSON output
  const jsonReport = {
    baseURL: startUrl,
    targetDomain,
    crawledAt: new Date().toISOString(),
    totalPagesCrawled: pages.length,
    issuesSummary: {
      total: allIssues.length,
      high: highImpact.length,
      medium: mediumImpact.length,
      low: lowImpact.length
    },
    pages,
    highImpactIssues: highImpact,
    mediumImpactIssues: mediumImpact,
    lowImpactIssues: lowImpact
  };

  const outputPath = path.join(process.cwd(), 'audit-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(jsonReport, null, 2));
  console.log(`\n✅ Full Audit Report exported to: ${outputPath}\n`);
}

runCrawl().catch((err) => {
  console.error('Fatal crawl error:', err);
  process.exit(1);
});
