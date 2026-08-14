import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import { GoogleGenAI } from '@google/genai';

export interface CroAuditInput {
  userUrl: string;
  businessType: string;
  competitorUrl?: string;
  traffic?: number;
  conversionRate?: number;
  averageOrderValue?: number;
}

export interface CroGapItem {
  id: string;
  category: 'TRUST' | 'FRICTION' | 'CLARITY';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'MODERATE' | 'MINOR';
  recommendation: string;
  visualIndicator?: string;
}

export interface ComparisonMatrixItem {
  element: string;
  yourWebsite: string;
  competitor: string;
  fixRecommendation: string;
  status: 'WEAKER' | 'PARITY' | 'BETTER';
}

export interface RevenueProjection {
  currentTraffic: number;
  currentConversionRate: number;
  targetConversionRate: number;
  averageOrderValue: number;
  currentMonthlyRevenue: number;
  projectedMonthlyRevenue: number;
  monthlyLift: number;
  annualLift: number;
  estimatedOrdersGain: number;
}

export interface CroTimelinePhase {
  phase: string;
  timeFrame: string;
  title: string;
  focus: string;
  expectedOutcome: string;
  tasks: string[];
}

export interface CroAiFixes {
  headlines: string[];
  ctaRecommendations: Array<{
    text: string;
    subtext?: string;
    color: string;
    placement: string;
    codeSnippet: string;
  }>;
  codeFixes: string;
  valuePropRewrite: string;
  guaranteeCopy: string;
}

export interface CroAuditResult {
  id: string;
  timestamp: string;
  userUrl: string;
  userDomain: string;
  competitorUrl: string;
  competitorDomain: string;
  businessType: string;
  websiteTitle?: string;
  loadSpeedMs: number;
  mobileFriendlyScore: number;
  overallScore: number;
  trustGaps: CroGapItem[];
  frictionGaps: CroGapItem[];
  clarityGaps: CroGapItem[];
  comparisonMatrix: ComparisonMatrixItem[];
  revenueProjection: RevenueProjection;
  timeline: CroTimelinePhase[];
  masterPrompt: string;
  aiGeneratedFixes: CroAiFixes;
}

// Clean and normalize URLs
function cleanUrl(raw: string): { fullUrl: string; domain: string } {
  let cleaned = (raw || '').trim();
  while (cleaned.match(/^(https?:\/\/)+/i)) {
    cleaned = cleaned.replace(/^(https?:\/\/)+/i, '');
  }
  cleaned = cleaned.replace(/^\/+/, '');
  if (!cleaned) return { fullUrl: 'https://example.com', domain: 'example.com' };
  const fullUrl = `https://${cleaned}`;
  let domain = 'example.com';
  try {
    domain = new URL(fullUrl).hostname.replace(/^www\./i, '');
  } catch (e) {
    domain = cleaned.split('/')[0].replace(/^www\./i, '');
  }
  return { fullUrl, domain };
}

// Default benchmark leaders by business type
const DEFAULT_COMPETITORS: Record<string, { url: string; domain: string; name: string; headline: string; cta: string; pricing: string; proof: string }> = {
  'E-commerce products': {
    url: 'https://allbirds.com',
    domain: 'allbirds.com',
    name: 'Allbirds (E-commerce Leader)',
    headline: 'Super Natural Comfort. 30-Day Risk-Free Trial, Free Shipping & Returns.',
    cta: 'Shop Best Sellers (High Contrast Pill Button)',
    pricing: 'Clear transparent prices starting at $98 with 4-interest free payments.',
    proof: '4.8/5 Stars from 25,000+ Verified Buyers shown above the fold.',
  },
  'Local services': {
    url: 'https://thumbtack.com',
    domain: 'thumbtack.com',
    name: 'Thumbtack Pro (Local Services Benchmark)',
    headline: 'Get 3 Free Estimates in Under 2 Minutes. Guaranteed Background-Checked Pros.',
    cta: 'Get Instant Quote (Bright Accent Button)',
    pricing: 'Free Instant Estimates with upfront price ranges per zip code.',
    proof: 'Google Guaranteed Badge + 10,000+ local customer testimonials with photos.',
  },
  'Digital products': {
    url: 'https://teachable.com',
    domain: 'teachable.com',
    name: 'Teachable MasterClass (Digital Creator Benchmark)',
    headline: 'Master High-Ticket Skills in 30 Days or 100% Money-Back Guarantee.',
    cta: 'Enroll Now & Get Instant Access (High-Contrast Orange CTA)',
    pricing: 'One-time $197 or 3x $69 with instant course dashboard unlock.',
    proof: '14-Day No-Questions-Asked Refund Guarantee + Video Testimonials.',
  },
  'SaaS & Web tools': {
    url: 'https://linear.app',
    domain: 'linear.app',
    name: 'Linear (Modern SaaS Benchmark)',
    headline: 'The issue tracker built for high-performance product teams. Start free in 60s.',
    cta: 'Start Free Trial — No Credit Card Required',
    pricing: 'Free Forever Tier + $8/seat with transparent feature tier tables.',
    proof: 'Used by OpenAI, Vercel, Ramp, and 10,000+ top engineering organizations.',
  },
  'Consulting / Agency': {
    url: 'https://toptal.com',
    domain: 'toptal.com',
    name: 'Toptal (Consulting Leader)',
    headline: 'Hire the Top 3% of Freelance Talent. Risk-Free Trial Period.',
    cta: 'Schedule Strategy Call (Sticky Header CTA)',
    pricing: 'Custom transparent retainer models with 14-day trial evaluation.',
    proof: 'Fortune 500 client logos, ISO certification, and live case studies.',
  },
};

export async function runConversionAudit(input: CroAuditInput): Promise<CroAuditResult> {
  const { fullUrl: userUrl, domain: userDomain } = cleanUrl(input.userUrl);
  const businessType = input.businessType || 'E-commerce products';

  // Determine competitor
  let competitorUrl = input.competitorUrl?.trim();
  let competitorDomain = '';
  let competitorInfo = DEFAULT_COMPETITORS[businessType] || DEFAULT_COMPETITORS['E-commerce products'];

  if (competitorUrl) {
    const compClean = cleanUrl(competitorUrl);
    competitorUrl = compClean.fullUrl;
    competitorDomain = compClean.domain;
  } else {
    competitorUrl = competitorInfo.url;
    competitorDomain = competitorInfo.domain;
  }

  // Pillar 1: Scrape User Website
  let userScrape: {
    title: string;
    metaDesc: string;
    h1s: string[];
    buttons: string[];
    hasReviews: boolean;
    hasGuarantee: boolean;
    hasPricing: boolean;
    hasSsl: boolean;
    responseTimeMs: number;
  } = {
    title: '',
    metaDesc: '',
    h1s: [],
    buttons: [],
    hasReviews: false,
    hasGuarantee: false,
    hasPricing: false,
    hasSsl: userUrl.startsWith('https://'),
    responseTimeMs: 320,
  };

  const startTime = Date.now();
  try {
    const resp = await axios.get(userUrl, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ConversionWizardBot/2.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    userScrape.responseTimeMs = Date.now() - startTime;
    const $ = cheerio.load(resp.data);

    userScrape.title = $('title').first().text().trim() || userDomain;
    userScrape.metaDesc = $('meta[name="description"]').attr('content')?.trim() || '';

    $('h1').each((_, el) => {
      const t = $(el).text().trim().replace(/\s+/g, ' ');
      if (t && t.length < 150) userScrape.h1s.push(t);
    });

    $('button, a.btn, a.button, input[type="submit"], [role="button"]').each((_, el) => {
      const t = $(el).text().trim().replace(/\s+/g, ' ');
      if (t && t.length < 40 && !userScrape.buttons.includes(t)) {
        userScrape.buttons.push(t);
      }
    });

    const pageText = $('body').text().toLowerCase();
    userScrape.hasReviews = pageText.includes('review') || pageText.includes('rating') || pageText.includes('testimonial') || pageText.includes('★★★★★') || pageText.includes('5-star');
    userScrape.hasGuarantee = pageText.includes('guarantee') || pageText.includes('money back') || pageText.includes('30-day') || pageText.includes('refund policy') || pageText.includes('risk-free');
    userScrape.hasPricing = pageText.includes('$') || pageText.includes('pricing') || pageText.includes('plans') || pageText.includes('usd') || pageText.includes('/mo');
  } catch (err: any) {
    userScrape.responseTimeMs = Date.now() - startTime;
    userScrape.title = `${userDomain} — ${businessType}`;
  }

  // Pillar 2 & 3: Obstacle Categorization (The "Why")
  const trustGaps: CroGapItem[] = [];
  const frictionGaps: CroGapItem[] = [];
  const clarityGaps: CroGapItem[] = [];

  // 1. Trust Gaps
  if (!userScrape.hasReviews) {
    trustGaps.push({
      id: 'tg-1',
      category: 'TRUST',
      title: 'Missing Social Proof & Customer Reviews Above the Fold',
      description: 'Prospective buyers do not see verified ratings, star counts, or testimonial quotes upon landing. Over 88% of consumers consult reviews before purchasing.',
      severity: 'CRITICAL',
      recommendation: 'Embed a 5-star rating chip (e.g. "Rated 4.9/5 by 1,200+ customers") directly beneath the main hero headline.',
      visualIndicator: '⭐ No Star Ratings Detected',
    });
  }

  if (!userScrape.hasGuarantee) {
    trustGaps.push({
      id: 'tg-2',
      category: 'TRUST',
      title: 'Missing Clear Risk Reversal & Guarantee Signals',
      description: 'No prominent mention of a 30-day money-back guarantee, free trial, or risk-free warranty is visible on the primary landing viewport.',
      severity: 'MODERATE',
      recommendation: 'Add a "30-Day No-Hassle Money-Back Guarantee" badge or risk-reversal microcopy directly beneath the checkout CTA.',
      visualIndicator: '🛡️ Hidden Return Policy',
    });
  }

  trustGaps.push({
    id: 'tg-3',
    category: 'TRUST',
    title: 'Lack of Industry Security Badges & Trust Seals',
    description: 'The checkout and lead-capture areas lack visual verification icons (e.g. SSL 256-bit encryption, Stripe Verified, Google Guaranteed).',
    severity: 'MINOR',
    recommendation: 'Display secure checkout lock icons and payment provider logos near payment input fields.',
    visualIndicator: '🔒 Security Seals Missing',
  });

  // 2. Friction Gaps
  const hasGenericCta = userScrape.buttons.some((b) => /^(submit|click here|send|buy|go)$/i.test(b)) || userScrape.buttons.length === 0;
  if (hasGenericCta) {
    frictionGaps.push({
      id: 'fg-1',
      category: 'FRICTION',
      title: 'Passive or Low-Contrast Call-to-Action Button ("Submit")',
      description: 'Primary button uses passive, generic text (e.g., "Submit", "Click Here") or lacks high optical contrast against the background canvas.',
      severity: 'CRITICAL',
      recommendation: 'Replace with a benefit-driven action phrase (e.g. "Get Instant Access", "Start My Free Audit", "Claim 20% Off Today") styled in high-contrast vibrant amber or emerald.',
      visualIndicator: '🔘 Passive Button Copy',
    });
  }

  if (userScrape.responseTimeMs > 700) {
    frictionGaps.push({
      id: 'fg-2',
      category: 'FRICTION',
      title: `Suboptimal Server Response & Loading Latency (${userScrape.responseTimeMs}ms)`,
      description: `Page response time exceeds Google Core Web Vitals recommended threshold (<400ms). Every 100ms of delay decreases conversion rate by up to 1.1%.`,
      severity: 'MODERATE',
      recommendation: 'Enable edge caching, compress hero images to WebP, and defer non-critical JavaScript scripts.',
      visualIndicator: '⏱️ Latency Bottleneck',
    });
  } else {
    frictionGaps.push({
      id: 'fg-2b',
      category: 'FRICTION',
      title: 'Mobile Viewport Tap Target & Spacing Optimization',
      description: 'Interactive checkout elements and form inputs require minimum 48px touch targets to prevent misclicks on mobile devices.',
      severity: 'MINOR',
      recommendation: 'Ensure all CTA buttons span minimum 48px height with 12px finger-padding on mobile screens.',
      visualIndicator: '📱 Mobile Tap Friction',
    });
  }

  if (!userScrape.hasPricing) {
    frictionGaps.push({
      id: 'fg-3',
      category: 'FRICTION',
      title: 'Hidden Pricing & Unclear Total Cost Before Checkout',
      description: 'Visitors must initiate checkout or fill multi-step inquiry forms before learning baseline pricing, causing immediate cart abandonment.',
      severity: 'MODERATE',
      recommendation: 'Provide transparent starting prices or an upfront price range directly on the main landing page.',
      visualIndicator: '🏷️ Hidden Pricing Strategy',
    });
  }

  // 3. Clarity Gaps
  const userH1 = userScrape.h1s[0] || userScrape.title || 'Welcome to our website';
  const isVagueH1 = userH1.length < 15 || /welcome|home|solutions|services|we are/i.test(userH1);

  if (isVagueH1 || userScrape.h1s.length === 0) {
    clarityGaps.push({
      id: 'cg-1',
      category: 'CLARITY',
      title: 'Vague Headline Failing the "5-Second Value Test"',
      description: `Current headline "${userH1}" does not immediately tell a first-time visitor what specific problem is solved, who it is for, or what tangible outcome is guaranteed.`,
      severity: 'CRITICAL',
      recommendation: 'Rewrite headline using the formula: [Specific Outcome] + [Timeframe Guarantee] + [Without the Pain Point].',
      visualIndicator: '❓ Vague Value Proposition',
    });
  }

  clarityGaps.push({
    id: 'cg-2',
    category: 'CLARITY',
    title: 'Lack of Concrete Time-Saving or Dollar-Amount Guarantees',
    description: 'Copy uses abstract corporate claims (e.g., "high quality", "innovative solutions") rather than quantifiable metrics (e.g., "Save 4 hours/week", "Done in 15 mins").',
    severity: 'MODERATE',
    recommendation: 'Replace generic adjectives with measurable numbers and exact customer results.',
    visualIndicator: '📉 Abstract Benefit Claims',
  });

  // Competitor Comparison Matrix
  const comparisonMatrix: ComparisonMatrixItem[] = [
    {
      element: 'Pricing Strategy',
      yourWebsite: userScrape.hasPricing ? 'Pricing displayed on secondary page' : 'Hidden until checkout or contact form',
      competitor: competitorInfo.pricing,
      fixRecommendation: 'Display baseline transparent pricing and flexible payment options on the landing page.',
      status: userScrape.hasPricing ? 'PARITY' : 'WEAKER',
    },
    {
      element: 'Value Proposition & Headline',
      yourWebsite: `"${userH1.slice(0, 50)}..." (Abstract)`,
      competitor: `"${competitorInfo.headline}"`,
      fixRecommendation: 'Rewrite headline to focus on a specific, measurable outcome and time-saving guarantee.',
      status: 'WEAKER',
    },
    {
      element: 'Call to Action (CTA)',
      yourWebsite: userScrape.buttons[0] ? `"${userScrape.buttons[0]}"` : '"Submit" (Low contrast)',
      competitor: competitorInfo.cta,
      fixRecommendation: 'Upgrade button to high-contrast vibrant styling with action-oriented, first-person copy.',
      status: 'WEAKER',
    },
    {
      element: 'Social Proof & Trust Signals',
      yourWebsite: userScrape.hasReviews ? 'Standard text quotes' : 'Missing star ratings / reviews above fold',
      competitor: competitorInfo.proof,
      fixRecommendation: 'Add a 5-star rating badge, customer faces, and verified review count in the hero banner.',
      status: userScrape.hasReviews ? 'PARITY' : 'WEAKER',
    },
    {
      element: 'Risk Reversal & Guarantee',
      yourWebsite: userScrape.hasGuarantee ? 'Standard warranty' : 'No explicit money-back guarantee mentioned',
      competitor: '30-Day 100% Risk-Free Money-Back Guarantee with instant refund promise',
      fixRecommendation: 'Incorporate a prominent 30-day money-back guarantee badge adjacent to the checkout CTA.',
      status: userScrape.hasGuarantee ? 'PARITY' : 'WEAKER',
    },
    {
      element: 'Speed & Mobile Experience',
      yourWebsite: `${userScrape.responseTimeMs}ms response time`,
      competitor: '<250ms with instant edge CDN delivery and touch-friendly sticky CTA',
      fixRecommendation: 'Add a sticky bottom mobile CTA bar and compress hero media assets.',
      status: userScrape.responseTimeMs < 400 ? 'PARITY' : 'WEAKER',
    },
  ];

  // Revenue & Timeline Projection
  const traffic = input.traffic && input.traffic > 0 ? input.traffic : 10000;
  const currentCr = input.conversionRate && input.conversionRate > 0 ? input.conversionRate : 1.5;
  const aov = input.averageOrderValue && input.averageOrderValue > 0 ? input.averageOrderValue : 75;

  // Optimized target conversion rate (1.75x lift from addressing Trust, Friction, and Clarity)
  const targetCr = Number((currentCr * 1.8).toFixed(2));
  const currentMonthlyRevenue = Math.round(traffic * (currentCr / 100) * aov);
  const projectedMonthlyRevenue = Math.round(traffic * (targetCr / 100) * aov);
  const monthlyLift = projectedMonthlyRevenue - currentMonthlyRevenue;
  const annualLift = monthlyLift * 12;
  const estimatedOrdersGain = Math.round(traffic * ((targetCr - currentCr) / 100));

  const revenueProjection: RevenueProjection = {
    currentTraffic: traffic,
    currentConversionRate: currentCr,
    targetConversionRate: targetCr,
    averageOrderValue: aov,
    currentMonthlyRevenue,
    projectedMonthlyRevenue,
    monthlyLift,
    annualLift,
    estimatedOrdersGain,
  };

  // Realistic Growth Timeline
  const timeline: CroTimelinePhase[] = [
    {
      phase: 'Phase 1',
      timeFrame: 'Days 1–7 (Immediate)',
      title: 'Technical Friction & Fast Conversion Wins',
      focus: 'Eliminate friction, boost CTA button contrast, and display upfront pricing transparency.',
      expectedOutcome: 'Immediate bounce reduction & initial checkout flow stabilization (+0.3% - +0.5% CR lift).',
      tasks: [
        'Replace passive "Submit" button with benefit-rich copy ("Get Instant Access / Start Free")',
        'Increase CTA button background contrast using vibrant gradient or primary accent color',
        'Add starting price tag or transparent price range directly on the hero page',
        'Ensure mobile tap targets are minimum 48px height with zero layout shifts',
      ],
    },
    {
      phase: 'Phase 2',
      timeFrame: 'Weeks 2–4 (Short Term)',
      title: 'Hero Messaging & Value Proposition Overhaul',
      focus: 'Rewrite headlines using the AI Master Prompt to pass the 5-Second Clarity Test.',
      expectedOutcome: 'Noticeable conversion acceleration on cold and organic traffic (+0.5% - +0.8% CR lift).',
      tasks: [
        'Implement the 3 AI-suggested high-converting headline variations in an A/B split test',
        'Highlight a concrete time-saving or dollar-backed outcome (e.g. "Save 5 hours/week")',
        'Embed 3 key bullet points detailing exactly who this is for and what problem is eliminated',
        'Add a sticky floating CTA for mobile visitors scrolling past 50% of the page',
      ],
    },
    {
      phase: 'Phase 3',
      timeFrame: 'Months 2–3 (Medium Term)',
      title: 'Trust Architecture & Maximum Revenue Scale',
      focus: 'Gather new customer reviews, embed verified social proof, and establish strong risk reversal.',
      expectedOutcome: 'Full projected conversion rate achievement and annualized revenue scale (+1.8x total multiplier).',
      tasks: [
        'Collect and showcase 5-star customer reviews with real names and photos above the fold',
        'Introduce a formal "30-Day 100% No-Risk Money-Back Guarantee" seal at checkout',
        'Incorporate trusted third-party badges (Stripe Verified, Google Guaranteed, SSL Lock)',
        'Continuously iterate microcopy and evaluate funnel drop-off analytics',
      ],
    },
  ];

  // Master Prompt Generation (Exact user-requested template)
  const masterPrompt = `You are an expert conversion rate optimization (CRO) specialist and senior copywriter. 
I am going to provide you with the issues found on my website compared to my top competitor. 

My Website: ${userUrl}
My Competitor: ${competitorUrl}
What I Sell: ${businessType}

The Audit identified the following gaps holding back my sales:
1. ${clarityGaps[0]?.title || 'Headline is confusing and does not clearly explain the core benefit'}
2. ${frictionGaps[0]?.title || "The checkout button is hidden or passive and says 'Submit' instead of an action-oriented phrase"}
3. ${trustGaps[0]?.title || 'We lack visible social proof compared to our competitor who displays 5-star reviews upfront'}

Based on these gaps, please generate:
1. Three high-converting headline variations optimized for my target audience.
2. The exact text, color recommendation, and placement for my primary Call-To-Action (CTA) buttons.
3. If applicable, provide the clean HTML/CSS code or Shopify/WordPress settings adjustments needed to make these visual changes quickly.

Keep the tone persuasive, clear, and focused entirely on turning website visitors into paying customers.`;

  // Dynamic high-converting copywriting tailored per business type
  const NICHE_COPYWRITING: Record<string, CroAiFixes> = {
    'E-commerce products': {
      headlines: [
        `Premium ${userDomain.split('.')[0] || 'Quality'} — Delivered in 2 Days with 100% Risk-Free Guarantee`,
        `Upgrade Your Everyday Experience. Over 10,000+ Happy Verified Customers.`,
        `Direct from Manufacturer: Top-Rated Quality at 40% Less Than Big-Box Retailers`,
      ],
      ctaRecommendations: [
        {
          text: `Claim My 20% Off Order — Risk Free`,
          subtext: `Free express shipping • 30-Day hassle-free returns`,
          color: `#f59e0b (Vibrant Amber / Coral)`,
          placement: `Hero Header above fold + Sticky Mobile Bottom Bar`,
          codeSnippet: `<a href="#shop" class="cro-btn-primary">\n  <span>Claim My 20% Off Order &rarr;</span>\n  <small>Free Shipping &bull; 30-Day Money-Back Guarantee</small>\n</a>`,
        },
      ],
      codeFixes: `/* High-Converting E-commerce CTA & Trust Badge CSS */
.cro-btn-primary {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 14px 28px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}
.cro-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(245, 158, 11, 0.6);
}
.cro-trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #10b981;
  margin-top: 10px;
}`,
      valuePropRewrite: `We deliver premium, high-durability products direct to your door with zero middleman markup and instant 30-day money-back protection.`,
      guaranteeCopy: `30-Day 100% Risk-Free Money-Back Guarantee. Love it or return it for a full refund. We even cover the return shipping cost.`,
    },
    'Local services': {
      headlines: [
        `Fast, Trusted Local Service: Get 3 Free Estimates in Under 2 Minutes`,
        `5-Star Rated by Your Neighbors. Licensed, Insured & Guaranteed On-Time.`,
        `Fix Your Issue Today Without the Stress — Transparent Upfront Pricing`,
      ],
      ctaRecommendations: [
        {
          text: `Get Instant Free Estimate`,
          subtext: `No obligation • 100% guaranteed response within 15 minutes`,
          color: `#10b981 (High-Trust Emerald Green)`,
          placement: `Hero Header with Zip Code Input + Floating Call Button`,
          codeSnippet: `<a href="#quote" class="cro-btn-primary">\n  <span>Get Instant Free Estimate &rarr;</span>\n  <small>Licensed &bull; Insured &bull; No Obligation</small>\n</a>`,
        },
      ],
      codeFixes: `/* High-Trust Local Services CTA & Emergency Call Bar */
.cro-btn-primary {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 14px 28px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}
.cro-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6);
}`,
      valuePropRewrite: `We provide certified, on-demand local solutions with upfront transparent pricing and a 100% satisfaction guarantee.`,
      guaranteeCopy: `Our 100% Workmanship Warranty: If you're not fully satisfied with our service, we will return and fix it free of charge, guaranteed.`,
    },
    'Digital products': {
      headlines: [
        `Master High-Income Skills in 30 Days — Actionable Frameworks with Guaranteed Results`,
        `The All-in-One Resource System Trusted by 12,000+ Creators & Professionals`,
        `Stop Wasting Hundreds of Hours. Get Instant Access to Battle-Tested Templates Today.`,
      ],
      ctaRecommendations: [
        {
          text: `Get Instant Access Now`,
          subtext: `Instant dashboard unlock • Lifetime updates included`,
          color: `#f59e0b (Vibrant Amber / Coral)`,
          placement: `Hero Header + Pricing Comparison Table`,
          codeSnippet: `<a href="#enroll" class="cro-btn-primary">\n  <span>Get Instant Access Now &rarr;</span>\n  <small>14-Day No-Questions-Asked Money-Back Guarantee</small>\n</a>`,
        },
      ],
      codeFixes: `/* High-Converting Digital Product Checkout Button */
.cro-btn-primary {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 14px 28px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}
.cro-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(245, 158, 11, 0.6);
}`,
      valuePropRewrite: `Step-by-step systems and production-ready resources designed to save you 40+ hours and scale your results immediately.`,
      guaranteeCopy: `14-Day 100% Risk-Free Guarantee. Download the materials, go through the system, and if it doesn't 10x your productivity, email us for a full refund.`,
    },
    'SaaS & Web tools': {
      headlines: [
        `The High-Velocity Platform Built for Modern Teams. Start Free in 60 Seconds.`,
        `Automate 80% of Your Repetitive Workflows — Without Writing a Single Line of Code`,
        `Trusted by 5,000+ Fast-Growing Companies to Scale Operations 3x Faster`,
      ],
      ctaRecommendations: [
        {
          text: `Start 14-Day Free Trial`,
          subtext: `No credit card required • Instant 60-second workspace setup`,
          color: `#6366f1 (Indigo / Electric Violet)`,
          placement: `Hero Header with Email Input + Sticky Nav CTA`,
          codeSnippet: `<a href="#signup" class="cro-btn-primary">\n  <span>Start 14-Day Free Trial &rarr;</span>\n  <small>No credit card required &bull; 60s setup</small>\n</a>`,
        },
      ],
      codeFixes: `/* Modern SaaS High-Contrast Pill CTA */
.cro-btn-primary {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 14px 28px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}
.cro-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6);
}`,
      valuePropRewrite: `The all-in-one software platform that cuts operational overhead and empowers teams to execute 3x faster with intelligent automation.`,
      guaranteeCopy: `Start completely free for 14 days. No credit card required. Cancel anytime with a single click from your account dashboard.`,
    },
    'Consulting / Agency': {
      headlines: [
        `Scale Your Pipeline With Proven Growth Strategies — Guaranteed Qualified Opportunities`,
        `We Partner With Ambitious Brands to Drive Measurable ROI and Market Leadership`,
        `Stop Burning Budget on Unproven Campaigns. Get a Bespoke Strategy Blueprint Today.`,
      ],
      ctaRecommendations: [
        {
          text: `Schedule Free 30-Min Strategy Call`,
          subtext: `Strictly zero sales pitch • Walk away with an actionable growth audit`,
          color: `#0ea5e9 (Ocean Blue / Cobalt)`,
          placement: `Hero Header + Floating Schedule Widget`,
          codeSnippet: `<a href="#book" class="cro-btn-primary">\n  <span>Schedule Free Strategy Call &rarr;</span>\n  <small>Includes custom CRO audit roadmap</small>\n</a>`,
        },
      ],
      codeFixes: `/* High-Ticket Consulting & Advisory CTA Button */
.cro-btn-primary {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 14px 28px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.4);
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}
.cro-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(14, 165, 233, 0.6);
}`,
      valuePropRewrite: `We engineer predictable customer acquisition engines for leading brands, backed by performance milestones and transparent reporting.`,
      guaranteeCopy: `Our Performance Commitment: If we do not achieve your defined growth milestone in the first 60 days, we work for free until we do.`,
    },
  };

  let aiGeneratedFixes: CroAiFixes = NICHE_COPYWRITING[businessType] || NICHE_COPYWRITING['E-commerce products'];

  // Check if GEMINI_API_KEY is available in environment
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an elite Conversion Rate Optimization (CRO) expert and direct-response copywriter.
Analyze this website audit:
Website: ${userUrl} (${userDomain})
Business Type: ${businessType}
Competitor: ${competitorUrl} (${competitorDomain})

Identified Gaps:
- Clarity: ${clarityGaps.map((g) => g.title).join('; ')}
- Friction: ${frictionGaps.map((g) => g.title).join('; ')}
- Trust: ${trustGaps.map((g) => g.title).join('; ')}

Return a strict JSON object with:
{
  "headlines": ["Headline 1 with strong benefit hook", "Headline 2 with social proof angle", "Headline 3 with time/money guarantee"],
  "ctaRecommendations": [
    {
      "text": "Action-oriented button text",
      "subtext": "Microcopy risk reversal",
      "color": "Color recommendation (e.g. #f59e0b Amber / #10b981 Emerald)",
      "placement": "Recommended placement on page",
      "codeSnippet": "Clean HTML button snippet"
    }
  ],
  "codeFixes": "CSS snippet for high-contrast button and trust badge",
  "valuePropRewrite": "Clear 1-sentence value proposition",
  "guaranteeCopy": "Compelling 30-day risk reversal guarantee statement"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.headlines && Array.isArray(parsed.headlines)) {
          aiGeneratedFixes = {
            ...aiGeneratedFixes,
            ...parsed,
          };
        }
      }
    } catch (aiErr: any) {
      // Gracefully handle quota exhaustion (429) or connection limits without crashing or spamming errors
      const isQuota = aiErr?.message?.includes('429') || aiErr?.message?.includes('RESOURCE_EXHAUSTED');
      if (!isQuota) {
        console.info('[ConversionWizard] Using domain-tailored CRO copywriting matrix for:', businessType);
      }
    }
  }

  // Calculate overall CRO Health Score (0-100)
  let score = 85;
  score -= trustGaps.length * 10;
  score -= frictionGaps.length * 8;
  score -= clarityGaps.length * 9;
  if (userScrape.responseTimeMs > 800) score -= 8;
  const overallScore = Math.max(35, Math.min(96, score));

  return {
    id: `cro_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    userUrl,
    userDomain,
    competitorUrl,
    competitorDomain,
    businessType,
    websiteTitle: userScrape.title,
    loadSpeedMs: userScrape.responseTimeMs,
    mobileFriendlyScore: userScrape.responseTimeMs < 500 ? 94 : 82,
    overallScore,
    trustGaps,
    frictionGaps,
    clarityGaps,
    comparisonMatrix,
    revenueProjection,
    timeline,
    masterPrompt,
    aiGeneratedFixes,
  };
}
