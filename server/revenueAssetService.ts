export type RevenueAssetTier = 
  | 'TIER_1_STOREFRONT_PRODUCT' 
  | 'TIER_2_HIGH_INTENT_CALCULATOR' 
  | 'TIER_3_HIGH_INTENT_CONTENT' 
  | 'TIER_4_EDITORIAL_ASSET';

export interface RevenueAssetClassification {
  url: string;
  tier: RevenueAssetTier;
  tierName: string;
  priorityWeight: number; // 0 - 100
  commercialIntent: 'DIRECT_TRANSACTION' | 'TOOL_UTILITY' | 'HIGH_INTENT_RESEARCH' | 'INFORMATIONAL';
  suggestedSchemaType: 'Product' | 'SoftwareApplication' | 'Article' | 'FAQPage';
  revenuePotentialBadge: string;
}

export class RevenueAssetService {
  /**
   * Classifies a URL into a revenue asset tier based on monetization intent
   */
  public classifyUrl(url: string): RevenueAssetClassification {
    const cleanUrl = url.toLowerCase();

    // TIER 1: Storefronts, checkouts, pricing, products (Direct Revenue)
    if (
      cleanUrl.includes('/product') ||
      cleanUrl.includes('/shop') ||
      cleanUrl.includes('/store') ||
      cleanUrl.includes('/pricing') ||
      cleanUrl.includes('/checkout') ||
      cleanUrl.includes('/cart') ||
      cleanUrl.includes('/buy') ||
      cleanUrl.includes('/plans') ||
      cleanUrl.includes('/subscription')
    ) {
      return {
        url,
        tier: 'TIER_1_STOREFRONT_PRODUCT',
        tierName: 'Storefront & Product Page',
        priorityWeight: 100,
        commercialIntent: 'DIRECT_TRANSACTION',
        suggestedSchemaType: 'Product',
        revenuePotentialBadge: 'Tier-1 Immediate Revenue Asset',
      };
    }

    // TIER 2: Interactive Calculators & Decision Tools (Lead & Utility Conversion)
    if (
      cleanUrl.includes('/tools/') ||
      cleanUrl.includes('/calculator') ||
      cleanUrl.includes('/estimator') ||
      cleanUrl.includes('/salary') ||
      cleanUrl.includes('/comparator') ||
      cleanUrl.includes('/benchmark') ||
      cleanUrl.includes('/generator') ||
      cleanUrl.includes('/analyzer')
    ) {
      return {
        url,
        tier: 'TIER_2_HIGH_INTENT_CALCULATOR',
        tierName: 'Interactive Calculator & Tool',
        priorityWeight: 85,
        commercialIntent: 'TOOL_UTILITY',
        suggestedSchemaType: 'SoftwareApplication',
        revenuePotentialBadge: 'Tier-2 High-Intent Utility Asset',
      };
    }

    // TIER 3: High-Intent Editorial, Buying Guides, Whitepapers & Case Studies
    if (
      cleanUrl.includes('/reports/') ||
      cleanUrl.includes('/guide') ||
      cleanUrl.includes('/whitepaper') ||
      cleanUrl.includes('/review') ||
      cleanUrl.includes('/best-') ||
      cleanUrl.includes('/vs-') ||
      cleanUrl.includes('/compare') ||
      cleanUrl.includes('/case-study')
    ) {
      return {
        url,
        tier: 'TIER_3_HIGH_INTENT_CONTENT',
        tierName: 'High-Intent Guide & Commercial Report',
        priorityWeight: 70,
        commercialIntent: 'HIGH_INTENT_RESEARCH',
        suggestedSchemaType: 'Article',
        revenuePotentialBadge: 'Tier-3 Commercial Research Asset',
      };
    }

    // TIER 4: General Editorial or Blog Content
    return {
      url,
      tier: 'TIER_4_EDITORIAL_ASSET',
      tierName: 'Standard Content & Editorial',
      priorityWeight: 45,
      commercialIntent: 'INFORMATIONAL',
      suggestedSchemaType: 'Article',
      revenuePotentialBadge: 'Tier-4 Brand Awareness Asset',
    };
  }

  /**
   * Sorts an array of URLs so that high-priority revenue assets are processed first
   */
  public prioritizeUrls(urls: string[]): {
    sortedUrls: string[];
    classifications: RevenueAssetClassification[];
    revenueAssetCount: number;
    summary: {
      storefronts: number;
      calculators: number;
      highIntentGuides: number;
      general: number;
    };
  } {
    const classifications = urls.map((u) => this.classifyUrl(u));

    // Sort descending by priority weight
    const sortedClassifications = [...classifications].sort((a, b) => b.priorityWeight - a.priorityWeight);
    const sortedUrls = sortedClassifications.map((c) => c.url);

    const summary = {
      storefronts: classifications.filter((c) => c.tier === 'TIER_1_STOREFRONT_PRODUCT').length,
      calculators: classifications.filter((c) => c.tier === 'TIER_2_HIGH_INTENT_CALCULATOR').length,
      highIntentGuides: classifications.filter((c) => c.tier === 'TIER_3_HIGH_INTENT_CONTENT').length,
      general: classifications.filter((c) => c.tier === 'TIER_4_EDITORIAL_ASSET').length,
    };

    const revenueAssetCount = summary.storefronts + summary.calculators + summary.highIntentGuides;

    return {
      sortedUrls,
      classifications: sortedClassifications,
      revenueAssetCount,
      summary,
    };
  }
}

export const revenueAssetService = new RevenueAssetService();
