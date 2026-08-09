export interface DirectoryEntry {
  id: string;
  name: string;
  type: 'WHOIS' | 'SEO Analyzer' | 'Site Stats' | 'Archiver' | 'Directory' | 'Ping Platform';
  urlPattern: string; // supports {domain}, {clean_url}, {url}, {encoded_url}
  method: 'GET' | 'POST';
  postDataPattern?: string;
  authorityScore: number;
}

export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Edge/125.0.2535.92',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)'
];

export const DIRECTORY_LIST: DirectoryEntry[] = [
  {
    id: 'domaintools',
    name: 'DomainTools WHOIS',
    type: 'WHOIS',
    urlPattern: 'https://whois.domaintools.com/{domain}',
    method: 'GET',
    authorityScore: 92
  },
  {
    id: 'netcraft',
    name: 'Netcraft Site Report',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.netcraft.com/site-report/?url={domain}',
    method: 'GET',
    authorityScore: 89
  },
  {
    id: 'hypestat',
    name: 'HypeStat Website Info',
    type: 'Site Stats',
    urlPattern: 'https://hypestat.com/info/{domain}',
    method: 'GET',
    authorityScore: 85
  },
  {
    id: 'builtwith',
    name: 'BuiltWith Technology Profile',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.builtwith.com/?{domain}',
    method: 'GET',
    authorityScore: 91
  },
  {
    id: 'w3snoop',
    name: 'W3Snoop Site Analysis',
    type: 'Site Stats',
    urlPattern: 'https://www.w3snoop.com/s/{domain}',
    method: 'GET',
    authorityScore: 78
  },
  {
    id: 'statshow',
    name: 'StatShow Web Analytics',
    type: 'Site Stats',
    urlPattern: 'https://www.statshow.com/www/{domain}',
    method: 'GET',
    authorityScore: 76
  },
  {
    id: 'cutestat',
    name: 'CuteStat Directory',
    type: 'Site Stats',
    urlPattern: 'https://www.cutestat.com/{domain}',
    method: 'GET',
    authorityScore: 82
  },
  {
    id: 'siteworthchecker',
    name: 'SiteWorthChecker',
    type: 'Site Stats',
    urlPattern: 'https://www.siteworthchecker.com/about/{domain}',
    method: 'GET',
    authorityScore: 74
  },
  {
    id: 'whois_com',
    name: 'Whois.com Lookup',
    type: 'WHOIS',
    urlPattern: 'https://www.whois.com/whois/{domain}',
    method: 'GET',
    authorityScore: 90
  },
  {
    id: 'surfthestats',
    name: 'SurfTheStats Analyzer',
    type: 'Site Stats',
    urlPattern: 'https://www.surfthestats.com/domain/{domain}',
    method: 'GET',
    authorityScore: 71
  },
  {
    id: 'website_indexer',
    name: 'Website Indexer Service',
    type: 'Directory',
    urlPattern: 'https://www.website-indexer.com/index.php?url={encoded_url}',
    method: 'GET',
    authorityScore: 80
  },
  {
    id: 'pingmyurl',
    name: 'Ping My URL Express',
    type: 'Ping Platform',
    urlPattern: 'https://www.pingmyurl.com/ping.php?url={encoded_url}',
    method: 'GET',
    authorityScore: 77
  },
  {
    id: 'seoptimer',
    name: 'SEOptimer Audit',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.seoptimer.com/{domain}',
    method: 'GET',
    authorityScore: 88
  },
  {
    id: 'woorank',
    name: 'WooRank Teaser Audit',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.woorank.com/en/teaser-review/{domain}',
    method: 'GET',
    authorityScore: 89
  },
  {
    id: 'robtex',
    name: 'Robtex DNS Directory',
    type: 'WHOIS',
    urlPattern: 'https://www.robtex.com/dns-lookup/{domain}',
    method: 'GET',
    authorityScore: 87
  },
  {
    id: 'urlvoid',
    name: 'URLVoid Reputation',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.urlvoid.com/scan/{domain}/',
    method: 'GET',
    authorityScore: 84
  },
  {
    id: 'securityheaders',
    name: 'Security Headers Checker',
    type: 'SEO Analyzer',
    urlPattern: 'https://securityheaders.com/?q={clean_url}',
    method: 'GET',
    authorityScore: 88
  },
  {
    id: 'pagespeed',
    name: 'Google PageSpeed Insights',
    type: 'SEO Analyzer',
    urlPattern: 'https://pagespeed.web.dev/analysis?url={encoded_url}',
    method: 'GET',
    authorityScore: 99
  },
  {
    id: 'gtmetrix',
    name: 'GTmetrix Performance',
    type: 'SEO Analyzer',
    urlPattern: 'https://gtmetrix.com/reports/{domain}',
    method: 'GET',
    authorityScore: 92
  },
  {
    id: 'rank2traffic',
    name: 'Rank2Traffic Estimation',
    type: 'Site Stats',
    urlPattern: 'https://www.rank2traffic.com/{domain}',
    method: 'GET',
    authorityScore: 79
  },
  {
    id: 'siteprice',
    name: 'SitePrice Evaluation',
    type: 'Site Stats',
    urlPattern: 'https://www.siteprice.org/website-worth/{domain}',
    method: 'GET',
    authorityScore: 81
  },
  {
    id: 'siterankdata',
    name: 'SiteRankData',
    type: 'Site Stats',
    urlPattern: 'https://www.siterankdata.com/{domain}',
    method: 'GET',
    authorityScore: 73
  },
  {
    id: 'trafficcheck',
    name: 'Traffic Check Directory',
    type: 'Site Stats',
    urlPattern: 'https://www.trafficcheck.org/domain/{domain}',
    method: 'GET',
    authorityScore: 70
  },
  {
    id: 'worthofweb',
    name: 'WorthOfWeb Directory',
    type: 'Site Stats',
    urlPattern: 'https://www.worthofweb.com/website-value/{domain}/',
    method: 'GET',
    authorityScore: 83
  },
  {
    id: 'websiteoutlook',
    name: 'Website Outlook',
    type: 'Site Stats',
    urlPattern: 'https://www.websiteoutlook.com/www.{domain}',
    method: 'GET',
    authorityScore: 78
  },
  {
    id: 'webindexer_biz',
    name: 'Web Indexer Biz',
    type: 'Directory',
    urlPattern: 'https://www.webindexer.biz/submit?url={encoded_url}',
    method: 'GET',
    authorityScore: 72
  },
  {
    id: 'web_archive',
    name: 'Wayback Machine Archive',
    type: 'Archiver',
    urlPattern: 'https://web.archive.org/web/*/{url}',
    method: 'GET',
    authorityScore: 98
  },
  {
    id: 'muckrack',
    name: 'MuckRack Outlet Lookup',
    type: 'Directory',
    urlPattern: 'https://www.muckrack.com/media-outlet/{domain}',
    method: 'GET',
    authorityScore: 86
  },
  {
    id: 'easycounter',
    name: 'EasyCounter Statistics',
    type: 'Site Stats',
    urlPattern: 'https://whois.easycounter.com/{domain}',
    method: 'GET',
    authorityScore: 79
  },
  {
    id: 'sitemapx',
    name: 'SitemapX SEO Audit',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.sitemapx.com/analyze/{domain}',
    method: 'GET',
    authorityScore: 75
  },
  {
    id: 'dnschecker',
    name: 'DNSChecker Explorer',
    type: 'WHOIS',
    urlPattern: 'https://www.dnschecker.org/all-dns-records-of-domain.php?query={domain}',
    method: 'GET',
    authorityScore: 87
  },
  {
    id: 'nslookup_io',
    name: 'NSLookup IO Directory',
    type: 'WHOIS',
    urlPattern: 'https://www.nslookup.io/domains/{domain}/dns-records/',
    method: 'GET',
    authorityScore: 85
  },
  {
    id: 'mxtoolbox',
    name: 'MxToolbox Health Scan',
    type: 'WHOIS',
    urlPattern: 'https://www.mxtoolbox.com/SuperTool.aspx?action=scan%3a{domain}',
    method: 'GET',
    authorityScore: 91
  },
  {
    id: 'intodns',
    name: 'IntoDNS Diagnostics',
    type: 'WHOIS',
    urlPattern: 'https://www.intodns.com/{domain}',
    method: 'GET',
    authorityScore: 88
  },
  {
    id: 'spyonweb',
    name: 'SpyOnWeb Analytics',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.spyonweb.com/{domain}',
    method: 'GET',
    authorityScore: 82
  },
  {
    id: 'siteliner',
    name: 'Siteliner Crawler',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.siteliner.com/{domain}',
    method: 'GET',
    authorityScore: 86
  },
  {
    id: 'nibbler',
    name: 'Nibbler Web Audit',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.nibbler.silktide.com/en_US/reports/{domain}',
    method: 'GET',
    authorityScore: 87
  },
  {
    id: 'similarchecker',
    name: 'Similar Checker',
    type: 'Site Stats',
    urlPattern: 'https://www.similarchecker.com/{domain}',
    method: 'GET',
    authorityScore: 71
  },
  {
    id: 'checkdomain',
    name: 'CheckDomain Central',
    type: 'WHOIS',
    urlPattern: 'https://www.checkdomain.com/cgi-bin/checkdomain.pl?domain={domain}',
    method: 'GET',
    authorityScore: 83
  },
  {
    id: 'who_is',
    name: 'Who.is Directory',
    type: 'WHOIS',
    urlPattern: 'https://www.who.is/whois/{domain}',
    method: 'GET',
    authorityScore: 90
  },
  {
    id: 'domainwhois_org',
    name: 'DomainWhois Org',
    type: 'WHOIS',
    urlPattern: 'https://www.domainwhois.org/{domain}',
    method: 'GET',
    authorityScore: 76
  },
  {
    id: 'seocentro',
    name: 'SEO Centro Analyzer',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.seocentro.com/tools/seo/seo-analyzer.html?url={encoded_url}',
    method: 'GET',
    authorityScore: 81
  },
  {
    id: 'seomastering',
    name: 'SEO Mastering',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.seomastering.com/site-report/{domain}',
    method: 'GET',
    authorityScore: 77
  },
  {
    id: 'website_calculator',
    name: 'Website Calculator',
    type: 'Site Stats',
    urlPattern: 'https://www.website-calculator.com/calculator/{domain}',
    method: 'GET',
    authorityScore: 73
  },
  {
    id: 'rankwatch',
    name: 'RankWatch Analyzer',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.rankwatch.com/free-tools/website-analyzer/{domain}',
    method: 'GET',
    authorityScore: 85
  },
  {
    id: 'alexa_legacy',
    name: 'Alexa SEO Profile',
    type: 'Site Stats',
    urlPattern: 'https://www.alexa.com/siteinfo/{domain}',
    method: 'GET',
    authorityScore: 88
  },
  {
    id: 'semrush_overview',
    name: 'SEMrush Domain Overview',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.semrush.com/website/{domain}/overview/',
    method: 'GET',
    authorityScore: 95
  },
  {
    id: 'similarweb_profile',
    name: 'SimilarWeb Profile',
    type: 'Site Stats',
    urlPattern: 'https://www.similarweb.com/website/{domain}/',
    method: 'GET',
    authorityScore: 94
  },
  {
    id: 'virustotal_domain',
    name: 'VirusTotal Domain Report',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.virustotal.com/gui/domain/{domain}',
    method: 'GET',
    authorityScore: 96
  },
  {
    id: 'threatcrowd',
    name: 'ThreatCrowd Profile',
    type: 'WHOIS',
    urlPattern: 'https://www.threatcrowd.org/domain.php?domain={domain}',
    method: 'GET',
    authorityScore: 82
  },
  {
    id: 'ssllabs',
    name: 'Qualys SSL Labs Analysis',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.ssllabs.com/ssltest/analyze.html?d={domain}',
    method: 'GET',
    authorityScore: 95
  },
  {
    id: 'pingomatic_express',
    name: 'Ping-O-Matic Endpoint',
    type: 'Ping Platform',
    urlPattern: 'https://pingomatic.com/ping/?title={domain}&blogurl={encoded_url}',
    method: 'GET',
    authorityScore: 91
  },
  {
    id: 'siteadvisor_mcafee',
    name: 'McAfee SiteAdvisor',
    type: 'SEO Analyzer',
    urlPattern: 'https://www.siteadvisor.com/sites/{domain}',
    method: 'GET',
    authorityScore: 90
  },
  {
    id: 'web_stat_view',
    name: 'Web-Stat Traffic Overview',
    type: 'Site Stats',
    urlPattern: 'https://www.web-stat.com/view/{domain}',
    method: 'GET',
    authorityScore: 78
  },
  {
    id: 'whois_softonic',
    name: 'Softonic Domain WHOIS',
    type: 'WHOIS',
    urlPattern: 'https://whois.tools.softonic.com/{domain}',
    method: 'GET',
    authorityScore: 86
  }
];

export function extractUrlDetails(rawUrl: string): { domain: string; clean_url: string; url: string; encoded_url: string } {
  let formatted = rawUrl.trim();
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = 'https://' + formatted;
  }

  try {
    const parsed = new URL(formatted);
    const domain = parsed.hostname.replace(/^www\./, '');
    const clean_url = parsed.hostname + parsed.pathname + parsed.search;
    return {
      domain,
      clean_url,
      url: parsed.href,
      encoded_url: encodeURIComponent(parsed.href)
    };
  } catch {
    // Fallback if parsing fails
    const cleaned = rawUrl.trim().replace(/^https?:\/\//, '').split('/')[0];
    return {
      domain: cleaned,
      clean_url: cleaned,
      url: 'https://' + cleaned,
      encoded_url: encodeURIComponent('https://' + cleaned)
    };
  }
}

export function formatDirectoryUrl(entry: DirectoryEntry, rawTargetUrl: string): string {
  const { domain, clean_url, url, encoded_url } = extractUrlDetails(rawTargetUrl);
  return entry.urlPattern
    .replace(/{domain}/g, domain)
    .replace(/{clean_url}/g, clean_url)
    .replace(/{url}/g, url)
    .replace(/{encoded_url}/g, encoded_url);
}
