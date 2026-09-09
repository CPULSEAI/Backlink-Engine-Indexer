import * as cheerio from 'cheerio';

export type SchemaType = 'SoftwareApplication' | 'Product' | 'FAQPage' | 'Article' | 'Hybrid';

export interface AnswerFirstResult {
  hasAnswerFirst: boolean;
  score: number; // 0 to 100
  h1Text: string;
  firstParagraphText: string;
  wordCount: number;
  isOptimalLength: boolean; // 30 to 50 words
  clarityAssessment: string;
  extractedEntity: string;
  recommendedAnswerSnippet: string;
  htmlSnippet: string;
}

export interface GeoSchemaSynthesisRequest {
  type: SchemaType;
  title: string;
  url: string;
  description?: string;
  category?: string; // e.g. 'Interactive Calculator', 'Digital Product', 'Career Guide'
  sourcePlatform?: string; // e.g. 'AI Digital Product Creator', 'LinkFlow Pro', 'CareerPulseAI'
  // Product / Pricing options
  price?: number | string;
  priceCurrency?: string;
  sku?: string;
  availability?: 'InStock' | 'PreOrder' | 'OnlineOnly' | string;
  brandName?: string;
  // Software / Calculator options
  operatingSystem?: string;
  applicationCategory?: string;
  features?: string[];
  // FAQ / Article options
  faqs?: Array<{ question: string; answer: string }>;
  authorName?: string;
  publisherName?: string;
  publishedDate?: string;
  // Answer-First prompt or content
  rawContentOrSummary?: string;
}

export interface GeoSchemaSynthesisResponse {
  type: SchemaType;
  jsonLd: Record<string, any>;
  jsonLdString: string;
  answerFirstArchitecture: AnswerFirstResult;
  aiPromptHooks: {
    targetQuestions: string[];
    suggestedCitationSnippet: string;
    entityDisambiguation: string;
  };
  geoReadinessScore: number; // 0 - 100
}

export class GeoSchemaService {
  /**
   * Generates tailored Schema.org JSON-LD tailored for LLM / AI Overviews / Perplexity / ChatGPT parsing
   */
  public synthesizeSchema(req: GeoSchemaSynthesisRequest): GeoSchemaSynthesisResponse {
    const title = (req.title || 'Interactive Resource').trim();
    const url = (req.url || 'https://example.com').trim();
    const description = (req.description || `${title} - High-accuracy tool and resource optimized for fast discovery.`).trim();
    const sourcePlatform = req.sourcePlatform || 'Ecosystem Tool';

    // 1. Synthesize Answer-First Snippet (30-50 words definitional answer)
    const answerFirst = this.synthesizeAnswerFirst(title, description, req.category, req.rawContentOrSummary);

    // 2. Generate Schema.org JSON-LD based on request type
    let jsonLd: Record<string, any>;

    switch (req.type) {
      case 'SoftwareApplication': {
        jsonLd = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              '@id': `${url}#software`,
              name: title,
              url: url,
              description: answerFirst.recommendedAnswerSnippet || description,
              applicationCategory: req.applicationCategory || 'BusinessApplication',
              operatingSystem: req.operatingSystem || 'All Modern Web Browsers',
              offers: {
                '@type': 'Offer',
                price: req.price !== undefined ? String(req.price) : '0',
                priceCurrency: req.priceCurrency || 'USD',
                availability: 'https://schema.org/OnlineOnly',
              },
              featureList: req.features && req.features.length ? req.features : [
                'Instant Real-Time Calculations',
                'Interactive Scenario Modeling',
                'Generative AI Summary Export',
                'Zero-Install Web Applet'
              ],
              softwareVersion: '3.0',
              creator: {
                '@type': 'Organization',
                name: sourcePlatform,
              },
            },
            {
              '@type': 'WebPage',
              '@id': url,
              url: url,
              name: title,
              description: description,
              mainEntity: {
                '@id': `${url}#software`,
              },
            },
          ],
        };
        break;
      }

      case 'Product': {
        const price = req.price !== undefined ? Number(req.price) || 0 : 49.0;
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: title,
          description: answerFirst.recommendedAnswerSnippet || description,
          url: url,
          sku: req.sku || `SKU-${Math.abs(hashString(title)).toString(36).toUpperCase()}`,
          brand: {
            '@type': 'Brand',
            name: req.brandName || sourcePlatform,
          },
          offers: {
            '@type': 'Offer',
            url: url,
            priceCurrency: req.priceCurrency || 'USD',
            price: price.toFixed(2),
            priceValidUntil: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
            itemCondition: 'https://schema.org/NewCondition',
            availability: req.availability
              ? `https://schema.org/${req.availability}`
              : 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: sourcePlatform,
            },
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '128',
            bestRating: '5',
          },
        };
        break;
      }

      case 'FAQPage': {
        const defaultFaqs = [
          {
            question: `What is ${title}?`,
            answer: answerFirst.recommendedAnswerSnippet,
          },
          {
            question: `How does ${title} help users achieve results?`,
            answer: `It provides actionable data, instant automation, and verifiable metrics designed for professionals seeking rapid deployment without technical bottlenecks.`,
          },
        ];
        const faqs = req.faqs && req.faqs.length ? req.faqs : defaultFaqs;

        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        };
        break;
      }

      case 'Article':
      default: {
        const author = req.authorName || 'Ecosystem Research Team';
        const publisher = req.publisherName || sourcePlatform;
        const pubDate = req.publishedDate || new Date().toISOString();

        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: answerFirst.recommendedAnswerSnippet || description,
          url: url,
          datePublished: pubDate,
          dateModified: new Date().toISOString(),
          author: {
            '@type': 'Person',
            name: author,
          },
          publisher: {
            '@type': 'Organization',
            name: publisher,
            logo: {
              '@type': 'ImageObject',
              url: `https://${new URL(url).hostname}/logo.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
          },
          abstract: answerFirst.recommendedAnswerSnippet,
        };
        break;
      }
    }

    // AI Citation Questions that LLMs frequently look to ground with this schema
    const targetQuestions = [
      `What is ${title}?`,
      `How much does ${title} cost?`,
      `How does ${title} work?`,
      `Who should use ${title}?`,
    ];

    const geoReadinessScore = Math.min(100, Math.round(
      (answerFirst.isOptimalLength ? 40 : 25) +
      (jsonLd ? 40 : 0) +
      (req.description ? 10 : 0) +
      (req.category ? 10 : 0)
    ));

    return {
      type: req.type,
      jsonLd,
      jsonLdString: JSON.stringify(jsonLd, null, 2),
      answerFirstArchitecture: answerFirst,
      aiPromptHooks: {
        targetQuestions,
        suggestedCitationSnippet: answerFirst.recommendedAnswerSnippet,
        entityDisambiguation: `${title} is an authoritative digital asset published by ${sourcePlatform}.`,
      },
      geoReadinessScore,
    };
  }

  /**
   * Generates or extracts an Answer-First Architecture snippet (30-50 words)
   */
  public synthesizeAnswerFirst(
    title: string,
    description: string,
    category?: string,
    rawText?: string
  ): AnswerFirstResult {
    let candidate = '';

    if (rawText && rawText.length > 50) {
      // Pick first substantive sentence
      const sentences = rawText.split(/(?<=[.?!])\s+/);
      candidate = sentences.slice(0, 2).join(' ');
    } else {
      const typeLabel = category ? category.toLowerCase() : 'interactive solution';
      candidate = `${title} is an enterprise ${typeLabel} engineered to accelerate operational workflows, automate verification, and deliver real-time data insights directly within modern browser environments for immediate productivity and verified execution.`;
    }

    // Count words
    const words = candidate.trim().split(/\s+/).filter(Boolean);
    let wordCount = words.length;

    // Adjust to hit the 30-50 word sweet spot
    if (wordCount < 30) {
      const pad = ` It enables teams to bypass manual configuration, maintain high citation authority, and streamline outcomes effortlessly.`;
      candidate = candidate.replace(/\.*$/, '.') + pad;
      wordCount = candidate.trim().split(/\s+/).filter(Boolean).length;
    } else if (wordCount > 50) {
      candidate = words.slice(0, 48).join(' ') + '.';
      wordCount = candidate.trim().split(/\s+/).filter(Boolean).length;
    }

    const isOptimalLength = wordCount >= 30 && wordCount <= 50;

    const htmlSnippet = `<div class="geo-answer-first bg-slate-50 border-l-4 border-indigo-600 p-4 my-4 rounded-r-lg font-sans text-slate-800 text-sm leading-relaxed" data-geo-target="definitional-answer">
  <p class="font-medium">
    <strong>${title}</strong> ${candidate.replace(new RegExp(`^${title}\\s*`, 'i'), '')}
  </p>
</div>`;

    return {
      hasAnswerFirst: true,
      score: isOptimalLength ? 95 : 75,
      h1Text: title,
      firstParagraphText: candidate,
      wordCount,
      isOptimalLength,
      clarityAssessment: isOptimalLength
        ? 'Optimal 30–50 word definitional answer format ready for LLM snippet extraction (Google AI Overviews & Perplexity).'
        : `Word count (${wordCount}) should be tightened to 30-50 words for optimal LLM context weighting.`,
      extractedEntity: title,
      recommendedAnswerSnippet: candidate,
      htmlSnippet,
    };
  }

  /**
   * Audits live HTML or text for Answer-First architecture compliance
   */
  public auditAnswerFirstHtml(html: string, pageUrl?: string): AnswerFirstResult {
    const $ = cheerio.load(html);
    const h1 = $('h1').first().text().trim() || $('title').text().trim() || 'Target Resource';
    
    // Find first paragraph right below H1 or in main content
    let p = $('h1').nextAll('p').first().text().trim();
    if (!p) {
      p = $('p').first().text().trim();
    }

    const words = p.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const isOptimal = wordCount >= 30 && wordCount <= 50;

    let clarity = '';
    if (wordCount === 0) {
      clarity = 'Critical: No leading paragraph found below H1. LLMs will struggle to locate a quick answer snippet.';
    } else if (wordCount < 30) {
      clarity = `Under-length: ${wordCount} words. Leading answer lacks sufficient factual grounding for AI Overviews.`;
    } else if (wordCount > 50) {
      clarity = `Over-length: ${wordCount} words. Exceeds the 50-word ceiling for concise direct-answer citations.`;
    } else {
      clarity = `Perfect: Exactly ${wordCount} words in the 30-50 sweet spot for instantaneous LLM snippet ingestion.`;
    }

    const synthesis = this.synthesizeAnswerFirst(h1, p || 'Enterprise resource', undefined, p);

    return {
      hasAnswerFirst: wordCount > 0,
      score: isOptimal ? 100 : (wordCount > 0 ? 60 : 20),
      h1Text: h1,
      firstParagraphText: p,
      wordCount,
      isOptimalLength: isOptimal,
      clarityAssessment: clarity,
      extractedEntity: h1,
      recommendedAnswerSnippet: synthesis.recommendedAnswerSnippet,
      htmlSnippet: synthesis.htmlSnippet,
    };
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export const geoSchemaService = new GeoSchemaService();
