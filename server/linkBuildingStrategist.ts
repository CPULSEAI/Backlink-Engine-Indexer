import { GoogleGenAI, Type } from '@google/genai';
import { LinkBuildingStrategyResult } from '../src/types';

export class LinkBuildingStrategistService {
  private getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is not configured. Please ensure your Gemini API key is set in Settings > Secrets.'
      );
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  public async generateStrategy(
    targetUrl: string,
    niche: string,
    coreService: string
  ): Promise<LinkBuildingStrategyResult> {
    const cleanUrl = targetUrl?.trim() || 'https://careerpulseai.net';
    const cleanNiche = niche?.trim() || 'AI Resume & Career Automation SaaS';
    const cleanService =
      coreService?.trim() ||
      'Automated AI resume builder, career trajectory optimizer, and interview coach';

    const ai = this.getClient();

    const prompt = `Act as an elite SEO link building strategist and technical search architect.
You are analyzing the target website and formulating a data-backed, authentic link acquisition campaign.

Target Website: "${cleanUrl}"
Niche / Industry: "${cleanNiche}"
Core Product / Service: "${cleanService}"

Perform the following 4 core strategic link building deliverables:
1. Identify exactly 3 top direct real-world competitors in this specific niche (provide actual existing domains and names, their authority level, and why they dominate link equity).
2. For each competitor, suggest exactly 2 high-leverage types of "linkable assets" (e.g., specific interactive tools, calculators, proprietary benchmark data studies, downloadable template bundles, or deep pillar guides) that naturally attract authoritative contextual backlinks in this niche.
3. Provide a list of 5 search queries (advanced Google Dorks like \`[niche] "write for us"\` or \`inurl:resources [topic]\`, \`intitle:"resources" [keyword]\`, etc.) specifically engineered for this niche to find active guest post, resource page, and partnership opportunities.
4. Write a short, highly personalized, non-spammy outreach email template that can be sent to site owners and editors in this niche to pitch a resource link, integration, or guest contribution. Include dynamic placeholder tags like [Name], [Specific Article / Resource Title], [Mutual Value Proposition].

Return your response strictly adhering to the JSON schema below.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an authoritative, senior SEO Link Building Strategist. You deliver zero-fluff, highly realistic, actionable link building blueprints with genuine competitor insight, authentic Google search dorks, and high-converting outreach templates.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: '2-3 sentence strategic executive assessment of the link acquisition opportunity.',
            },
            competitors: {
              type: Type.ARRAY,
              description: 'Array of 3 direct competitors in the niche with 2 linkable assets each.',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  nicheRelevance: { type: Type.STRING },
                  authorityLevel: {
                    type: Type.STRING,
                    enum: ['Authority Leader', 'High Domain Rating', 'Established Challenger'],
                  },
                  whyTheyDominate: { type: Type.STRING },
                  linkableAssets: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        assetType: {
                          type: Type.STRING,
                          enum: [
                            'Interactive Tool',
                            'Calculator',
                            'Original Research / Data Study',
                            'Comprehensive Pillar Guide',
                            'Template / Resource Bundle',
                            'Benchmark / Industry Index',
                          ],
                        },
                        topicDescription: { type: Type.STRING },
                        whyItEarnsBacklinks: { type: Type.STRING },
                        targetLinkAudiences: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        estimatedLinkAcquisitionPotential: {
                          type: Type.STRING,
                          enum: ['High', 'Very High', 'Exceptional'],
                        },
                        implementationChecklist: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                      required: [
                        'id',
                        'title',
                        'assetType',
                        'topicDescription',
                        'whyItEarnsBacklinks',
                        'targetLinkAudiences',
                        'estimatedLinkAcquisitionPotential',
                        'implementationChecklist',
                      ],
                    },
                  },
                },
                required: [
                  'name',
                  'domain',
                  'nicheRelevance',
                  'authorityLevel',
                  'whyTheyDominate',
                  'linkableAssets',
                ],
              },
            },
            googleDorks: {
              type: Type.ARRAY,
              description: '5 high-impact Google Dorks for finding link building opportunities.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  query: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    enum: [
                      'Guest Post',
                      'Resource Page',
                      'Partnership / Integration',
                      'Roundup / Directory',
                      'Broken Link Target',
                    ],
                  },
                  explanation: { type: Type.STRING },
                  proTip: { type: Type.STRING },
                },
                required: ['id', 'query', 'category', 'explanation', 'proTip'],
              },
            },
            outreachTemplate: {
              type: Type.OBJECT,
              properties: {
                subjectLines: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                previewText: { type: Type.STRING },
                body: { type: Type.STRING },
                pitchType: {
                  type: Type.STRING,
                  enum: [
                    'Resource Page Suggestion',
                    'Guest Contribution / Co-Marketing',
                    'Value-Add Asset Mention',
                  ],
                },
                personalizationHooks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                complianceAntiSpamTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                followUpSnippet: { type: Type.STRING },
              },
              required: [
                'subjectLines',
                'body',
                'pitchType',
                'personalizationHooks',
                'complianceAntiSpamTips',
                'followUpSnippet',
              ],
            },
            actionPlanNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'executiveSummary',
            'competitors',
            'googleDorks',
            'outreachTemplate',
            'actionPlanNextSteps',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned an empty response for the Link Building Strategy.');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text.trim());
    } catch (e: any) {
      throw new Error(`Failed to parse AI Link Building Strategy response: ${e.message}`);
    }

    // Enhance Google Dorks with live search URLs
    const formattedDorks = (parsed.googleDorks || []).map((dork: any, idx: number) => {
      const q = dork.query || '';
      return {
        id: dork.id || `dork_${idx + 1}`,
        query: q,
        category: dork.category || 'Resource Page',
        explanation: dork.explanation || 'Discovers active resource lists and contextual partner pages.',
        searchUrl: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
        proTip: dork.proTip || 'Filter results by past year for freshly active domains.',
      };
    });

    return {
      targetUrl: cleanUrl,
      niche: cleanNiche,
      coreService: cleanService,
      generatedAt: new Date().toISOString(),
      executiveSummary: parsed.executiveSummary || 'Targeted link acquisition blueprint compiled for domain authority acceleration.',
      competitors: parsed.competitors || [],
      googleDorks: formattedDorks,
      outreachTemplate: parsed.outreachTemplate || {
        subjectLines: [`Quick question about your [Topic] resource guide`],
        body: `Hi [Name],\n\nI was reviewing your article on [Specific Article Title] and noticed how thoroughly you covered [Specific Subtopic].\n\nWe recently published a dedicated [Asset Type / Free Tool] on [Topic] that provides [Unique Value/Data Point]:\n[Link]\n\nThought it might make a helpful addition for your readers looking for [Specific Outcome]. Either way, thanks for the insightful piece!\n\nBest regards,\n[Your Name]`,
        pitchType: 'Resource Page Suggestion',
        personalizationHooks: ['Mention a specific paragraph or statistic from their post'],
        complianceAntiSpamTips: ['Keep under 150 words', 'Never use generic template greetings'],
        followUpSnippet: `Hi [Name], just checking if you had a moment to check out the [Asset Name]? Happy to provide custom graphics or data embeds if useful.`,
      },
      actionPlanNextSteps: parsed.actionPlanNextSteps || [
        'Deploy the highest-potential interactive tool or calculator asset on your domain.',
        'Execute the 5 Google Dork queries to identify top 25 prospect domains.',
        'Personalize and dispatch outreach pitches using the provided email blueprint.',
      ],
    };
  }
}
