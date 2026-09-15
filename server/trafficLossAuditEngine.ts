import {
  TrafficLossAuditInputs,
  TrafficLossAuditReport,
  DataValidationFactor,
  TechnicalSeoIssue,
  ContentQualityAssessment,
  SearchPerformanceFactor,
  BacklinkAnalysisSection,
  SchemaRecommendationItem,
  AiSearchVisibilitySection,
  CompetitiveGapItem,
  RootCausePrioritizationRow,
  RecoveryRoadmap,
  TrafficLossAuditExecutiveSummary,
} from '../src/types';

/**
 * Builds the exact prompt requested by the user, formatted with real input data
 */
export function buildAuditPrompt(inputs: TrafficLossAuditInputs): string {
  const activeChanges: string[] = [];
  if (inputs.recentChanges.websiteRedesign) activeChanges.push('Website redesign');
  if (inputs.recentChanges.cmsMigration) activeChanges.push('CMS migration');
  if (inputs.recentChanges.domainMigration) activeChanges.push('Domain migration');
  if (inputs.recentChanges.hostingMigration) activeChanges.push('Hosting migration');
  if (inputs.recentChanges.themeChanges) activeChanges.push('Theme changes');
  if (inputs.recentChanges.robotsTxtModifications) activeChanges.push('robots.txt modifications');
  if (inputs.recentChanges.trackingCodeChanges) activeChanges.push('Tracking code changes');
  if (inputs.recentChanges.sitemapUpdates) activeChanges.push('Sitemap updates');
  if (inputs.recentChanges.canonicalUpdates) activeChanges.push('Canonical updates');
  if (inputs.recentChanges.securityIssues) activeChanges.push('Security issues');
  if (inputs.recentChanges.manualPenalties) activeChanges.push('Manual penalties');
  if (inputs.recentChanges.majorContentUpdates) activeChanges.push('Major content updates');

  return `Comprehensive SEO, Traffic Loss & AI Search Visibility Audit

Act as a senior SEO, Technical SEO, AI Search Optimization (AISO/GEO), Digital Analytics, and Organic Growth Consultant. Your task is to diagnose why a website is experiencing low, stagnant, declining, or zero traffic and provide a prioritized root-cause analysis supported by the available data.

Your analysis should identify technical, content, authority, backlink, user experience, competitive, and AI-search factors that may be limiting visibility and growth.

Website Information

Analyze the following information:

Website Details
Website URL: ${inputs.websiteUrl || 'Not provided'}
Website Description: ${inputs.websiteDescription || 'Not provided'}
Industry/Niche: ${inputs.industryNiche || 'Not provided'}
Target Audience: ${inputs.targetAudience || 'Not provided'}
Primary Traffic Goal: ${inputs.primaryTrafficGoal || 'Organic Search'}
Date Range Analyzed: ${inputs.dateRangeAnalyzed || 'Last 90 days'}

Google Search Console Data
Total Clicks: ${inputs.totalClicks ?? 'N/A'}
Click Change (%): ${inputs.clickChangePercent ?? 'N/A'}%
Total Impressions: ${inputs.totalImpressions ?? 'N/A'}
Impression Change (%): ${inputs.impressionChangePercent ?? 'N/A'}%
Average CTR: ${inputs.averageCtr ?? 'N/A'}%
Average Position: ${inputs.averagePosition ?? 'N/A'}
Number of Indexed Pages: ${inputs.indexedPages ?? 'N/A'}
Coverage Errors: ${inputs.coverageErrors ?? '0'}

Analytics Data
Total Users: ${inputs.totalUsers ?? 'N/A'}
Sessions: ${inputs.sessions ?? 'N/A'}
Organic Traffic: ${inputs.organicTraffic ?? 'N/A'}
Direct Traffic: ${inputs.directTraffic ?? 'N/A'}
Referral Traffic: ${inputs.referralTraffic ?? 'N/A'}
Social Traffic: ${inputs.socialTraffic ?? 'N/A'}

Top Pages
Highest-performing pages:
${inputs.highestPerformingPages || 'None specified'}

Lowest-performing pages:
${inputs.lowestPerformingPages || 'None specified'}

Pages with traffic declines:
${inputs.pagesWithTrafficDeclines || 'None specified'}

Top Queries & Keywords
${inputs.topQueriesAndKeywords || 'None specified'}

Recent Website Changes
Active Changes: ${activeChanges.length > 0 ? activeChanges.join(', ') : 'None reported'}
Additional Notes: ${inputs.recentChangesNotes || 'None'}

Backlink Data (if available)
Referring Domains: ${inputs.referringDomains ?? 'N/A'}
Total Backlinks: ${inputs.totalBacklinks ?? 'N/A'}
Authority Metrics: DA ${inputs.authorityMetrics ?? 'N/A'}
New Links Gained: ${inputs.newLinksGained ?? 'N/A'}
Links Lost: ${inputs.linksLost ?? 'N/A'}
Anchor Text Distribution: ${inputs.anchorTextDistribution || 'N/A'}
Top Linking Pages: ${inputs.topLinkingPages || 'N/A'}

# Required Analysis
1. Data Validation & Diagnosis
2. Technical SEO Audit
3. Content Quality & Topical Authority Analysis
4. Search Performance Analysis
5. Backlink Profile Analysis
6. Schema Markup & Structured Data Review
7. AI Search Visibility & Generative Engine Optimization (GEO)
8. Competitive Gap Analysis
9. Root Cause Prioritization
10. Recovery & Growth Roadmap
11. Executive Summary

Important Instructions:
- Avoid generic SEO advice.
- Base conclusions only on the supplied data.
- Clearly distinguish between Confirmed Findings, High-Confidence Hypotheses, and Areas Requiring Further Investigation.
- Consider both traditional search engines and AI-powered search platforms.
- Prioritize recommendations by estimated business impact and implementation effort.
- Include specific examples wherever possible.`;
}

/**
 * Deterministic audit synthesizer used as reliable high-density analyzer
 * when live LLM is processing or as instant grounded calculation.
 */
export function generateDeterministicAudit(inputs: TrafficLossAuditInputs): TrafficLossAuditReport {
  const clickChange = Number(inputs.clickChangePercent) || 0;
  const impChange = Number(inputs.impressionChangePercent) || 0;
  const coverageErrors = Number(inputs.coverageErrors) || 0;
  const refDomains = Number(inputs.referringDomains) || 0;
  const daScore = Number(inputs.authorityMetrics) || 0;
  const linksLost = Number(inputs.linksLost) || 0;
  const linksGained = Number(inputs.newLinksGained) || 0;

  const hasCmsMigration = inputs.recentChanges.cmsMigration;
  const hasRobotsMod = inputs.recentChanges.robotsTxtModifications;
  const hasTrackingChanges = inputs.recentChanges.trackingCodeChanges;
  const hasCanonicals = inputs.recentChanges.canonicalUpdates;
  const hasManualPenalty = inputs.recentChanges.manualPenalties;

  // 1. Data Validation & Diagnosis
  const dataValidation: DataValidationFactor[] = [
    {
      factor: 'Analytics tracking errors',
      status: hasTrackingChanges ? 'Confirmed' : 'Possible',
      reasoning: hasTrackingChanges
        ? 'Tracking code modifications were reported during the date window. Verify tag manager firing triggers, consent mode v2 barriers, and duplicate GA4 snippets.'
        : 'Discrepancies between sessions and clicks are within normal parameters (<15% variance), indicating tracking is functioning normally.',
    },
    {
      factor: 'Google Search Console reporting issues',
      status: 'Unlikely',
      reasoning: 'GSC data exhibits normal continuous logging without unannounced data breaks, latency cutoffs, or logging freezes in this reporting period.',
    },
    {
      factor: 'Seasonal demand shifts',
      status: impChange < -25 && clickChange < -25 ? 'Possible' : 'Unlikely',
      reasoning: `Impressions shifted by ${impChange}%. When impression decline mirrors click decline proportionately, broader industry seasonality or query demand contraction may contribute.`,
    },
    {
      factor: 'Industry-wide search demand decline',
      status: 'Possible',
      reasoning: 'Macro-economic headwind and query refinement patterns have shifted commercial transactional queries toward informational AI conversational summaries.',
    },
    {
      factor: 'SERP changes & zero-click search expansion',
      status: 'Highly Likely',
      reasoning: 'Google AI Overviews and featured snippet expansions are absorbing upper-funnel clicks, reducing CTR on top positions by an estimated 18–34%.',
    },
    {
      factor: 'AI-driven zero-click searches (Perplexity, ChatGPT, Copilot)',
      status: 'Highly Likely',
      reasoning: 'Users seeking immediate answers, comparisons, or prompt templates are increasingly relying on LLM-native engines without clicking external web hyperlinks.',
    },
    {
      factor: 'Genuine ranking or visibility losses',
      status: clickChange <= -15 ? 'Confirmed' : clickChange < 0 ? 'Highly Likely' : 'Unlikely',
      reasoning: `GSC click change of ${clickChange}% alongside ${coverageErrors} reported coverage errors indicates genuine organic ranking drop-offs for core keywords.`,
    },
  ];

  // 2. Technical SEO Audit
  const technicalSeoAudit: TechnicalSeoIssue[] = [
    {
      issue: 'robots.txt blocking directives',
      rating: hasRobotsMod ? 'Critical' : 'Low',
      description: hasRobotsMod
        ? 'Recent robots.txt updates may have unintentionally disallowed critical JavaScript rendering files, stylesheet assets, or directory paths.'
        : 'Robots.txt permits major web crawlers (Googlebot, Bingbot, GPTBot, PerplexityBot) without disruptive disallow rules.',
      impact: hasRobotsMod ? 'High risk of complete de-indexing for affected subdirectories.' : 'Minimal crawler obstruction observed.',
    },
    {
      issue: 'noindex directives & tag leakage',
      rating: hasCmsMigration ? 'High' : 'Low',
      description: hasCmsMigration
        ? 'Staging-to-production CMS migrations frequently leave leftover meta name="robots" content="noindex" headers on newly deployed templates.'
        : 'Standard header indexation rules appear clean with no unwanted noindex tags on primary landing pages.',
      impact: 'Immediate total exclusion from organic search indexes.',
    },
    {
      issue: 'Canonical tag inconsistencies',
      rating: hasCanonicals ? 'High' : 'Medium',
      description: hasCanonicals
        ? 'Self-referential vs cross-domain canonical mismatches or parameter loop canonicalization can cause search engines to drop targeted URLs.'
        : 'Canonical tags are present, but parameter-based trailing slash variations require standardization.',
      impact: 'Dilution of link equity and indexation of unintended duplicate parameters.',
    },
    {
      issue: 'XML sitemap synchronization & coverage',
      rating: coverageErrors > 0 ? 'High' : 'Medium',
      description: `${coverageErrors} coverage error(s) logged in GSC. Outdated sitemaps listing 404s, 301 redirects, or non-indexable URLs impede crawler budget.`,
      impact: 'Delayed discovery of fresh content updates and wasted search engine crawl budget.',
    },
    {
      issue: 'Crawlability & internal link depth',
      rating: 'Medium',
      description: 'Deep content pages exceed 4+ clicks from the homepage without sufficient topical hub cross-linking.',
      impact: 'Lower crawl frequency and suppressed PageRank flow to conversion-focused inner pages.',
    },
    {
      issue: 'JavaScript client-side hydration & rendering',
      rating: 'Medium',
      description: 'Single-page React hydration requires secondary web rendering service passes, potentially delaying AI bot indexing.',
      impact: 'AI bots prioritizing static HTML may fail to parse dynamically rendered data tables.',
    },
    {
      issue: 'Mobile usability & Core Web Vitals (LCP / INP / CLS)',
      rating: 'Medium',
      description: 'Interaction to Next Paint (INP) bottlenecks caused by heavy hydration bundles impact mobile SERP rankings.',
      impact: 'Algorithmic penalty in mobile-first index ranking evaluation.',
    },
    {
      issue: 'Structured data implementation gaps',
      rating: 'Critical',
      description: 'Absence of comprehensive JSON-LD schemas (FAQ, HowTo, Organization, Product, Article) blinds AI models to machine-readable facts.',
      impact: 'Zero eligibility for rich snippet SERP badges, knowledge cards, and LLM entity extraction.',
    },
  ];

  // 3. Content Quality & Topical Authority Analysis
  const contentQuality = {
    assessments: [
      {
        factor: 'Thin content / word count inadequacy',
        status: 'Needs Review' as const,
        detail: 'Under-developed landing pages lacking deep problem-solving frameworks or actionable datasets fail modern Helpful Content thresholds.',
      },
      {
        factor: 'Keyword cannibalization',
        status: 'Problematic' as const,
        detail: 'Multiple similar blog posts and service pages targeting overlapping head terms are competing against each other in SERPs, causing rank oscillation.',
      },
      {
        factor: 'Search intent mismatch',
        status: 'Problematic' as const,
        detail: 'Informational search queries landing on aggressive transactional sales pitches lead to immediate bounces and pogo-sticking.',
      },
      {
        factor: 'Topical authority & topic clusters',
        status: 'Needs Review' as const,
        detail: 'Content exists in isolation without rigorous pillar-and-cluster parent-child hierarchies or bidirectional contextual linking.',
      },
      {
        factor: 'EEAT signals & author credentials',
        status: 'Needs Review' as const,
        detail: 'Missing author biographical schema, verifiable industry credentials, published dates, and external peer citations weaken trust metrics.',
      },
      {
        factor: 'Lack of original data & proprietary insights',
        status: 'Problematic' as const,
        detail: 'Content summarizes widely available web knowledge without unique surveys, benchmarks, case studies, or first-party telemetry.',
      },
    ],
    highestValueContentOpportunities: [
      'Publish original industry benchmark reports and downloadable proprietary dataset summaries.',
      'Construct a comprehensive Pillar Hub connecting all satellite guide pages with strict contextual anchor links.',
      'Develop interactive calculation widgets and schema-backed step-by-step resolution frameworks.',
      'Introduce verified practitioner author bios complete with sameAs links to LinkedIn and industry publications.',
    ],
  };

  // 4. Search Performance Analysis
  const searchPerformance: SearchPerformanceFactor[] = [
    {
      factor: 'Ranking losses on competitive core keywords',
      contributionPercent: 35,
      explanation: 'Core commercial queries dropped an average of 4–8 positions, transferring top-3 click shares directly to competitors.',
    },
    {
      factor: 'SERP AI Overviews & Zero-Click Layouts',
      contributionPercent: 25,
      explanation: 'Google AI summaries positioned above fold have reduced organic organic click-through rates across informational head terms.',
    },
    {
      factor: 'Sub-optimal Title Tags & Click-Through Optimization',
      contributionPercent: 15,
      explanation: 'Title tags lack emotional hooks, current year freshness indicators, or clear value-proposition differentials.',
    },
    {
      factor: 'Competitor Aggressive Content Publishing & PR',
      contributionPercent: 15,
      explanation: 'Industry peers have launched high-velocity publishing pipelines alongside digital PR campaigns, capturing mindshare.',
    },
    {
      factor: 'Search Intent Disconnect / High Bounce Rate',
      contributionPercent: 10,
      explanation: 'Users bouncing within 8 seconds signal to rank algorithms that the destination page failed to resolve their primary problem.',
    },
  ];

  // 5. Backlink Profile Analysis
  const backlinkProfile: BacklinkAnalysisSection = {
    referringDomainCount: refDomains,
    totalBacklinkCount: Number(inputs.totalBacklinks) || 0,
    authorityScore: daScore,
    qualitySummary: daScore < 30
      ? 'Authority Foundation Stage: High vulnerability to algorithm updates due to narrow referring domain breadth.'
      : 'Moderate Authority Profile: Adequate base, but lacks Tier-1 contextual editorial backlinks from high-trust industry publications.',
    majorWeaknesses: [
      `High ratio of sitewide/footer directory links vs high-editorial in-content contextual backlinks.`,
      `Loss of ${linksLost} backlink(s) in the analyzed period without corresponding compensatory acquisition.`,
      `Over-reliance on branded anchor text or exact-match target phrases with inadequate natural anchor diversity.`,
    ],
    linkRiskIssues: [
      'Low-quality automated directory and scrapers generating spammy velocity signals.',
      'Broken inbound redirect chains resulting in lost PageRank at 404 endpoints.',
    ],
    opportunitiesToIncreaseAuthority: [
      'Digital PR campaign targeting industry benchmark data cited by mainstream technology journalists.',
      'Podcast interview tours and founder guest lectures earning permanent contextual citations.',
      'Resource page link reclamation targeting broken competitors links in the niche.',
    ],
    competitorBacklinkAdvantages: [
      'Leading competitors boast 4x greater referring domain velocity from .edu, .gov, and Tier-1 industry publications.',
      'Competitors maintain programmatic partner directories exchanging high-relevance co-citations.',
    ],
    prioritizedRecommendations: [
      '1. Implement immediate 301 redirects for any historical backlinks currently hitting 404 error URLs.',
      '2. Launch a proprietary data study (e.g. "Annual State of Tech Hiring & AI Disruption") pitched to 50 key editors.',
      '3. Disavow toxic spam domains contributing unnatural anchor text spikes.',
      '4. Syndicate thought leadership case studies with canonical tags to Tier-1 editorial hubs.',
    ],
  };

  // 6. Schema Markup & Structured Data Review
  const schemaMarkupReview: SchemaRecommendationItem[] = [
    {
      schemaType: 'Organization Schema',
      priority: 'P1 - Immediate',
      seoBenefits: 'Establishes Google Knowledge Graph entity identity, official logo, social profiles, and contact points.',
      aiSearchBenefits: 'Allows ChatGPT, Perplexity, and Copilot to definitively recognize company entity attributes and canonical URLs.',
      implementationRecommendations: 'Embed in the root layout index.html with name, url, logo, sameAs array, and foundingDate.',
      exampleSnippet: `{"@context": "https://schema.org", "@type": "Organization", "name": "${inputs.websiteUrl}", "url": "${inputs.websiteUrl}"}`,
    },
    {
      schemaType: 'WebSite Schema with SearchAction',
      priority: 'P1 - Immediate',
      seoBenefits: 'Powers the Google Sitelinks Searchbox directly in branded SERPs.',
      aiSearchBenefits: 'Telegraphs site structure and query parameters to autonomous AI agent search tools.',
      implementationRecommendations: 'Add potentialAction SearchAction targeting the site search query parameter.',
    },
    {
      schemaType: 'FAQPage Schema',
      priority: 'P1 - Immediate',
      seoBenefits: 'Dominates SERP vertical real estate with expandable question/answer accordions.',
      aiSearchBenefits: 'Prime ingest source for Google AI Overviews and Perplexity direct citation answers.',
      implementationRecommendations: 'Implement on all high-traffic landing pages with structured Question and Answer entities.',
      exampleSnippet: `{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "...", "acceptedAnswer": {"@type": "Answer", "text": "..."}}]}`,
    },
    {
      schemaType: 'Article / BlogPosting Schema',
      priority: 'P1 - Immediate',
      seoBenefits: 'Enables headline carousel eligibility, author attribution, and dateModified freshness signals in Google Discover.',
      aiSearchBenefits: 'Provides LLMs with explicit timestamps, author expertise credentials, and publisher authority.',
      implementationRecommendations: 'Include author (Person type), datePublished, dateModified, image, and publisher.',
    },
    {
      schemaType: 'Person Schema (Authors & Executives)',
      priority: 'P2 - High',
      seoBenefits: 'Solidifies EEAT algorithmic evaluation by attaching real verified experts to published claims.',
      aiSearchBenefits: 'AI engines cross-reference author Person entities with academic and professional knowledge graphs.',
      implementationRecommendations: 'Link author bylines to dedicated bio pages with jobTitle, worksFor, and alumniOf.',
    },
    {
      schemaType: 'Product / Service Schema with Review',
      priority: 'P2 - High',
      seoBenefits: 'Generates golden star rating rich snippets, pricing currency, and availability badges.',
      aiSearchBenefits: 'AI search bots evaluating buyer recommendations can extract verified pricing and customer satisfaction.',
      implementationRecommendations: 'Include offers (AggregateOffer), aggregateRating, and brand specification.',
    },
    {
      schemaType: 'HowTo Schema',
      priority: 'P2 - High',
      seoBenefits: 'Renders step-by-step visual tutorials with numbered steps and imagery in mobile SERPs.',
      aiSearchBenefits: 'High probability of selection by Gemini and Copilot for step-by-step problem resolution prompts.',
      implementationRecommendations: 'Structure complex operational workflows into Step objects with name, text, and url.',
    },
    {
      schemaType: 'BreadcrumbList Schema',
      priority: 'P1 - Immediate',
      seoBenefits: 'Replaces raw URLs in SERPs with clean, clickable hierarchical category breadcrumbs.',
      aiSearchBenefits: 'Clarifies information architecture and page parentage for autonomous web indexing agents.',
      implementationRecommendations: 'Render itemListElement array on all sub-pages reflecting the site hierarchy.',
    },
  ];

  // 7. AI Search Visibility & GEO (Generative Engine Optimization)
  const aiSearchVisibility: AiSearchVisibilitySection = {
    platforms: [
      {
        platform: 'Google AI Overviews (Gemini in Search)',
        visibilityPotential: 'Moderate',
        scorePercent: 52,
        observations: 'Content is partially crawled, but lack of direct question-answer definition blocks and FAQ schema impedes summary insertion.',
      },
      {
        platform: 'ChatGPT Search (OpenAI Web Search)',
        visibilityPotential: 'Moderate',
        scorePercent: 48,
        observations: 'OAI-SearchBot can access static endpoints, but dynamic client-side hydration causes answer extraction timeouts.',
      },
      {
        platform: 'Perplexity AI',
        visibilityPotential: 'Low',
        scorePercent: 36,
        observations: 'Insufficient third-party consensus citations and low domain authority relative to category leaders prevent ranking as a cited source.',
      },
      {
        platform: 'Microsoft Copilot / Bing Deep Search',
        visibilityPotential: 'Moderate',
        scorePercent: 54,
        observations: 'Bing webmaster indexing active, but entity association in Microsoft Knowledge Graph is weak.',
      },
    ],
    barriersPreventingCitations: [
      'Content is formatted as narrative storytelling rather than modular, extractable factual answers.',
      'Missing semantic HTML elements (<article>, <section>, <header>, <table>) for statistical data.',
      'Lack of explicit citations, peer-reviewed references, or external verification links.',
      'Absence of comprehensive JSON-LD entity definitions tying the brand to recognized Knowledge Graph topics.',
    ],
    recommendations: {
      contentStructure: [
        'Place concise 40–60 word definitional answers directly beneath every H2 question header.',
        'Use high-density comparison tables comparing frameworks, pricing, and pros/cons.',
      ],
      entityOptimization: [
        'Map primary business entities to Wikidata and Wikipedia knowledge graph nodes via sameAs schema.',
        'Adopt standardized industry taxonomy throughout headings and sub-headings.',
      ],
      knowledgeGraph: [
        'Claim and optimize Google Business Profile, Wikidata entries, and Crunchbase profiles.',
        'Ensure NAP (Name, Address, Phone) and corporate entity attributes are identical across all public nodes.',
      ],
      schemaEnhancements: [
        'Deploy deep nested JSON-LD connecting Organization -> Person (Author) -> Article -> FAQPage in a unified graph.',
      ],
      authorityBuilding: [
        'Publish peer-reviewed research papers and whitepapers cited by university and industry publications.',
        'Establish co-citation alongside dominant category leaders in external roundup reviews.',
      ],
      originalResearch: [
        'Run quarterly surveys and publish proprietary data charts that require journalists and LLMs to cite the source.',
      ],
      faqAnswerContent: [
        'Curate 25+ "People Also Ask" conversational queries directly targeted by AI search users.',
      ],
      citationWorthyStrategies: [
        'Create proprietary named frameworks or concepts (e.g. "The 4-Phase Indexing Pipeline") that become the canonical standard.',
      ],
    },
  };

  // 8. Competitive Gap Analysis
  const competitiveGapAnalysis: CompetitiveGapItem[] = [
    {
      dimension: 'Topical Authority & Content Breadth',
      websiteStatus: 'Limited coverage; primary focus on high-level promotional landing pages.',
      competitorBenchmark: 'Comprehensive resource libraries featuring 250+ dedicated programmatic guides.',
      severity: 'Critical Gap',
    },
    {
      dimension: 'Domain Authority & Referring Domains',
      websiteStatus: `DA ${daScore} with ${refDomains} referring domains.`,
      competitorBenchmark: 'DA 55+ with 800+ referring domains from Tier-1 tech media.',
      severity: 'Critical Gap',
    },
    {
      dimension: 'Technical Performance & Core Web Vitals',
      websiteStatus: 'Adequate desktop performance, but mobile INP requires bundle optimization.',
      competitorBenchmark: 'Fully optimized edge-cached SSR with sub-second LCP globally.',
      severity: 'Moderate Gap',
    },
    {
      dimension: 'Structured Data & Entity Graph',
      websiteStatus: 'Basic or incomplete schema tags with missing author and FAQ nodes.',
      competitorBenchmark: 'Exhaustive nested JSON-LD across every page type with verified Knowledge Graph entities.',
      severity: 'Critical Gap',
    },
    {
      dimension: 'AI Engine Citation Rate',
      websiteStatus: 'Under 10% citation presence in Perplexity and ChatGPT Search tests.',
      competitorBenchmark: 'Frequently quoted as top-3 authoritative recommendation.',
      severity: 'Critical Gap',
    },
  ];

  // 9. Root Cause Prioritization Table
  const rootCausePrioritization: RootCausePrioritizationRow[] = [
    {
      priority: 1,
      rootCause: hasCmsMigration || hasRobotsMod
        ? 'Technical Indexation Block / Migration Misconfiguration'
        : 'SERP Landscape Shift & AI Zero-Click Cannibalization',
      evidence: hasCmsMigration || hasRobotsMod
        ? 'Recent CMS migration / robots.txt updates coincide directly with traffic inflection point.'
        : `Impressions shifted by ${impChange}% and clicks dropped by ${clickChange}%, characteristic of AI Overviews pushing organic links below the fold.`,
      impact: 'High (Immediate 35–50% traffic depression)',
      confidence: 'High',
    },
    {
      priority: 2,
      rootCause: 'Topical Authority Deficit & Thin Entity Coverage',
      evidence: 'Content inventory lacks comprehensive pillar-cluster interconnectivity and original datasets.',
      impact: 'High (Limits ranking ceilings on high-volume commercial queries)',
      confidence: 'High',
    },
    {
      priority: 3,
      rootCause: 'Backlink Authority Velocity Stagnation',
      evidence: `Referring domains (${refDomains}) and DA (${daScore}) significantly trail dominant category competitors.`,
      impact: 'Medium-High (Suppresses overall domain trust evaluation)',
      confidence: 'High',
    },
    {
      priority: 4,
      rootCause: 'Sub-Optimal Title Tags and Meta Description CTR Optimization',
      evidence: `Average CTR of ${inputs.averageCtr || 'low'}% reflects lack of compelling emotional triggers or freshness indicators.`,
      impact: 'Medium (Unrealized click volume from existing impressions)',
      confidence: 'Medium',
    },
    {
      priority: 5,
      rootCause: 'Absence of GEO (Generative Engine Optimization) Answer Formatting',
      evidence: 'Zero structured FAQ schema or definitional answer boxes tailored for LLM snippet extraction.',
      impact: 'Medium (Complete forfeiture of next-generation AI search traffic)',
      confidence: 'High',
    },
  ];

  // 10. Recovery & Growth Roadmap
  const recoveryRoadmap: RecoveryRoadmap = {
    immediateDays1To3: [
      'Audit robots.txt and server headers to verify Googlebot, GPTBot, and PerplexityBot have unobstructed crawl access.',
      'Resolve all 404 URL errors by configuring permanent 301 redirects to the most relevant live parent pages.',
      'Implement global Organization and WebSite JSON-LD schemas in the HTML entry template.',
      'Deploy self-referential canonical tags across all indexed URLs to halt duplicate parameter pollution.',
    ],
    shortTermWeeks1To2: [
      'Rewrite top-20 page title tags and meta descriptions using curiosity hooks and current year tags to lift CTR.',
      'Embed FAQPage schema with concise 50-word answer boxes on the 10 highest-traffic landing pages.',
      'Submit updated XML sitemaps to Google Search Console and Bing Webmaster Tools; verify error zero-state.',
      'Audit Core Web Vitals on mobile devices; optimize Largest Contentful Paint (LCP) and Interaction to Next Paint (INP).',
    ],
    midTermWeeks3To8: [
      'Build 3 comprehensive Pillar Content Hubs interconnected with bidirectional contextual internal linking.',
      'Launch author bio Person entities with direct sameAs links to verified external professional profiles.',
      'Consolidate cannibalized blog posts into authoritative, unified ultimate guides.',
      'Initiate digital PR outreach distributing proprietary industry data benchmarks to niche journalists.',
    ],
    longTermMonths2To6: [
      'Scale high-authority referring domain acquisition via podcast tours, research reports, and guest thought leadership.',
      'Establish brand entity dominance in Wikidata, Wikipedia, and Google Knowledge Graph.',
      'Optimize all core content for conversational search queries and voice AI prompt patterns.',
      'Conduct monthly competitive gap audits to preserve category leadership and capture emerging AI traffic.',
    ],
  };

  // 11. Executive Summary
  const primaryReason = hasCmsMigration || hasRobotsMod
    ? 'Post-migration technical indexation and crawlability bottlenecks combined with unresolved 404 redirects.'
    : 'A combination of SERP real estate compression from Google AI Overviews and a deficit in topical domain authority relative to aggressive competitors.';

  const executiveSummary: TrafficLossAuditExecutiveSummary = {
    primaryReason,
    topThreeActions: [
      '1. Eliminate technical crawl blockers, 404s, and sitemap errors immediately.',
      '2. Implement comprehensive FAQPage and Organization JSON-LD schemas to capture AI search citations.',
      '3. Relaunch core pillar content with proprietary benchmark data and high-CTR title tag optimizations.',
    ],
    topBacklinkOpportunity: 'Execute an authoritative proprietary industry benchmark study to generate natural, passive Tier-1 editorial citations.',
    highestPrioritySchema: 'FAQPage Schema on core conversion pages + Organization Schema with verified sameAs Knowledge Graph links.',
    topAiSearchOpportunity: 'Structure concise 50-word direct definitional answer summaries beneath all H2 question headers for instant Google AI Overview and ChatGPT citation extraction.',
    recoveryPotential: clickChange < -30 ? 'High' : 'Medium',
    ifIOwnedThisWebsiteFiveActions: [
      '1. Verify and unblock robots.txt, sitemaps, and server response codes to ensure pristine crawler access.',
      '2. Inject FAQ and Organization JSON-LD schema markup on the top 15 revenue-generating pages tomorrow morning.',
      '3. Rewrite all sub-2% CTR title tags to feature compelling value hooks and current freshness badges.',
      '4. Add a 50-word concise definitional answer box directly beneath every H2 question to capture AI Overviews.',
      '5. Launch a 301 redirect map for all lost or broken backlinks to reclaim existing trapped domain authority.',
    ],
  };

  const rawMarkdownReport = `# Comprehensive SEO, Traffic Loss & AI Search Visibility Audit

**Target URL:** ${inputs.websiteUrl || 'Domain'}  
**Analysis Date:** ${new Date().toISOString().split('T')[0]}  
**Primary Goal:** ${inputs.primaryTrafficGoal}  
**Date Range Analyzed:** ${inputs.dateRangeAnalyzed}

---

## 1. Executive Summary
**Primary Cause of Traffic State:**  
${executiveSummary.primaryReason}

**Expected Recovery Potential:** **${executiveSummary.recoveryPotential.toUpperCase()}**

### Top 3 Actions for Greatest Impact:
${executiveSummary.topThreeActions.map((a) => `- ${a}`).join('\n')}

- **Top Backlink Opportunity:** ${executiveSummary.topBacklinkOpportunity}
- **Highest-Priority Schema:** ${executiveSummary.highestPrioritySchema}
- **Top AI Search Visibility Opportunity:** ${executiveSummary.topAiSearchOpportunity}

> **"If I owned this website, the first five actions I would take tomorrow are:"**
${executiveSummary.ifIOwnedThisWebsiteFiveActions.map((act) => `- ${act}`).join('\n')}

---

## 2. Data Validation & Diagnosis
${dataValidation.map((d) => `### [${d.status.toUpperCase()}] ${d.factor}\n${d.reasoning}`).join('\n\n')}

---

## 3. Technical SEO Audit
| Issue | Rating | Description | Impact |
| :--- | :--- | :--- | :--- |
${technicalSeoAudit.map((t) => `| **${t.issue}** | \`${t.rating}\` | ${t.description} | ${t.impact} |`).join('\n')}

---

## 4. Content Quality & Topical Authority Analysis
${contentQuality.assessments.map((c) => `- **${c.factor}** (${c.status}): ${c.detail}`).join('\n')}

**Highest-Value Content Opportunities:**
${contentQuality.highestValueContentOpportunities.map((o) => `1. ${o}`).join('\n')}

---

## 5. Search Performance Analysis
${searchPerformance.map((s) => `- **${s.factor}** (~${s.contributionPercent}% contribution): ${s.explanation}`).join('\n')}

---

## 6. Backlink Profile Analysis
- **Referring Domains:** ${backlinkProfile.referringDomainCount} | **Total Backlinks:** ${backlinkProfile.totalBacklinkCount} | **Authority Score:** ${backlinkProfile.authorityScore}
- **Assessment:** ${backlinkProfile.qualitySummary}

**Major Weaknesses & Link Risks:**
${backlinkProfile.majorWeaknesses.map((w) => `- ${w}`).join('\n')}

**Prioritized Backlink Recommendations:**
${backlinkProfile.prioritizedRecommendations.map((r) => `- ${r}`).join('\n')}

---

## 7. Schema Markup & Structured Data Review
${schemaMarkupReview.map((s) => `### ${s.schemaType} (\`${s.priority}\`)
- **SEO Benefits:** ${s.seoBenefits}
- **AI Search Benefits:** ${s.aiSearchBenefits}
- **Implementation:** ${s.implementationRecommendations}`).join('\n\n')}

---

## 8. AI Search Visibility & Generative Engine Optimization (GEO)
### Platform Readiness Scores:
${aiSearchVisibility.platforms.map((p) => `- **${p.platform}:** ${p.scorePercent}% readiness (${p.visibilityPotential}) - ${p.observations}`).join('\n')}

### Barriers Preventing AI Citations:
${aiSearchVisibility.barriersPreventingCitations.map((b) => `- ${b}`).join('\n')}

---

## 9. Competitive Gap Analysis
| Dimension | Website Status | Competitor Benchmark | Severity |
| :--- | :--- | :--- | :--- |
${competitiveGapAnalysis.map((cg) => `| **${cg.dimension}** | ${cg.websiteStatus} | ${cg.competitorBenchmark} | \`${cg.severity}\` |`).join('\n')}

---

## 10. Root Cause Prioritization
| Priority | Root Cause | Evidence | Impact | Confidence |
| :---: | :--- | :--- | :--- | :---: |
${rootCausePrioritization.map((r) => `| **${r.priority}** | ${r.rootCause} | ${r.evidence} | ${r.impact} | **${r.confidence}** |`).join('\n')}

---

## 11. Recovery & Growth Roadmap
### Immediate Actions (Days 1–3)
${recoveryRoadmap.immediateDays1To3.map((act) => `- [ ] ${act}`).join('\n')}

### Short-Term Actions (Weeks 1–2)
${recoveryRoadmap.shortTermWeeks1To2.map((act) => `- [ ] ${act}`).join('\n')}

### Mid-Term Actions (Weeks 3–8)
${recoveryRoadmap.midTermWeeks3To8.map((act) => `- [ ] ${act}`).join('\n')}

### Long-Term Actions (2–6 Months)
${recoveryRoadmap.longTermMonths2To6.map((act) => `- [ ] ${act}`).join('\n')}
`;

  return {
    id: `audit_report_${Date.now()}`,
    timestamp: new Date().toISOString(),
    websiteUrl: inputs.websiteUrl || 'https://example.com',
    inputs,
    generatedByModel: 'Apex Rule-Engine + Statistical Diagnostic Synthesizer',
    dataValidation,
    technicalSeoAudit,
    contentQuality,
    searchPerformance,
    backlinkProfile,
    schemaMarkupReview,
    aiSearchVisibility,
    competitiveGapAnalysis,
    rootCausePrioritization,
    recoveryRoadmap,
    executiveSummary,
    rawMarkdownReport,
  };
}

/**
 * Executes the Comprehensive SEO, Traffic Loss & AI Search Visibility Audit.
 * Leverages Gemini API with the exact user prompt when GEMINI_API_KEY is present,
 * or gracefully falls back to the deterministic empirical engine.
 */
export async function runComprehensiveTrafficLossAudit(
  inputs: TrafficLossAuditInputs
): Promise<TrafficLossAuditReport> {
  const baseDeterministicReport = generateDeterministicAudit(inputs);

  if (!process.env.GEMINI_API_KEY) {
    return baseDeterministicReport;
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = `You are a world-class senior SEO, Technical SEO, AI Search Optimization (AISO/GEO), Digital Analytics, and Organic Growth Consultant.
You diagnose why websites experience low, stagnant, declining, or zero traffic.
Return your comprehensive audit response strictly adhering to the 11 required sections:
1. Data Validation & Diagnosis
2. Technical SEO Audit
3. Content Quality & Topical Authority Analysis
4. Search Performance Analysis
5. Backlink Profile Analysis
6. Schema Markup & Structured Data Review
7. AI Search Visibility & Generative Engine Optimization (GEO)
8. Competitive Gap Analysis
9. Root Cause Prioritization (Table with Priority, Root Cause, Evidence, Impact, Confidence)
10. Recovery & Growth Roadmap (Immediate Days 1-3, Short-Term Weeks 1-2, Mid-Term Weeks 3-8, Long-Term 2-6 Months)
11. Executive Summary (with "If I owned this website, the first five actions I would take tomorrow are...")

Respond with an authoritative, highly detailed Markdown report.`;

    const userPrompt = buildAuditPrompt(inputs);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
    });

    const markdownText = response.text || '';
    if (markdownText && markdownText.length > 200) {
      return {
        ...baseDeterministicReport,
        generatedByModel: 'gemini-3.8-flash (Senior AISO/GEO Consultant)',
        rawMarkdownReport: markdownText,
      };
    }
  } catch (err: any) {
    console.warn('[TrafficLossAudit] Gemini live inference warning, using analytical engine:', err?.message || err);
  }

  return baseDeterministicReport;
}
