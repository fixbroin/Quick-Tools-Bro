
'use server';
/**
 * @fileOverview A privacy policy generation AI agent.
 *
 * - generatePrivacyPolicy - A function that handles generating a privacy policy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { PrivacyPolicyInput, PrivacyPolicyOutput } from '@/app/tools/privacy-policy-generator/page';

// Re-define schemas on the server to avoid client/server boundary issues
const PrivacyPolicyInputSchema = z.object({
  companyName: z.string(),
  websiteUrl: z.string(),
  country: z.string(),
  state: z.string(),
  email: z.string(),
  collectData: z.string(),
  useCookies: z.string(),
  useThirdParty: z.string(),
  targetAudience: z.string(),
  dataTypes: z.array(z.string()),
  collectionMethods: z.array(z.string()),
  dataUsage: z.array(z.string()),
  shareData: z.string().optional(),
  thirdParties: z.string().optional(),
  compliance: z.array(z.string()),
});

const PrivacyPolicyOutputSchema = z.object({
  policy: z.string().describe('The generated privacy policy document.'),
});

export async function generatePrivacyPolicy(input: PrivacyPolicyInput): Promise<PrivacyPolicyOutput> {
  return generatePrivacyPolicyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'privacyPolicyPrompt',
  input: { schema: PrivacyPolicyInputSchema.extend({
    isDataCollected: z.boolean(),
    isThirdPartyUsed: z.boolean(),
    isDataShared: z.boolean(),
    isAudienceKids: z.boolean(),
    currentDate: z.string(),
  }) },
  output: { schema: PrivacyPolicyOutputSchema },
  prompt: `You are a legal expert specializing in writing privacy policies for websites and applications. Generate a comprehensive and professional privacy policy based on the following information. The policy should be formatted as plain text, using numbered sections (e.g., 1. Introduction, 2. Information We Collect) instead of markdown headings. Do not use asterisks for bolding.

Privacy Policy
Effective Date: {{{currentDate}}}

Company Information:
- Company/Business Name: {{{companyName}}}
- Website URL: {{{websiteUrl}}}
- Country of Operation: {{{country}}}
- State of Operation: {{{state}}}
- Contact Email: {{{email}}}

Data Collection & Usage:
- Do you collect personal data?: {{{collectData}}}
- Do you use cookies or tracking technologies?: {{{useCookies}}}
- Do you use third-party tools (e.g., Google Analytics)?: {{{useThirdParty}}}
- Target Audience: {{{targetAudience}}}

{{#if isDataCollected}}
Details of Data Collection:
- Types of Personal Data Collected: {{#each dataTypes}}- {{{this}}}{{/each}}
- Methods of Data Collection: {{#each collectionMethods}}- {{{this}}}{{/each}}
- How Collected Data is Used: {{#each dataUsage}}- {{{this}}}{{/each}}
{{/if}}

{{#if isThirdPartyUsed}}
- Do you share data with third parties?: {{{shareData}}}
{{#if isDataShared}}
- Third Parties data is shared with: {{{thirdParties}}}
{{/if}}
{{/if}}

Compliance:
- Data laws you comply with: {{#each compliance}}- {{{this}}}{{/each}}

Key Sections to Include:
1.  Introduction: State the purpose of the privacy policy.
2.  Information We Collect: Detail the types of data collected (based on \`dataTypes\`).
3.  How We Use Your Information: Explain the purposes for using the data (based on \`dataUsage\`).
4.  Cookies and Tracking Technologies: Explain the use of cookies if applicable.
5.  Third-Party Services: Mention the use of third-party tools and data sharing if applicable.
6.  Data Security: Briefly describe security measures taken.
7.  Your Data Protection Rights: Outline user rights based on specified compliance laws (e.g., GDPR, CCPA).
8.  Children's Privacy: {{#if isAudienceKids}}Include a specific, detailed section regarding children under 13, compliant with COPPA.{{else}}Include a standard section stating the service is not for children under 13.{{/if}}
9.  Changes to This Privacy Policy: Mention that the policy may be updated.
10. Contact Us: Provide the contact email.

Generate a complete privacy policy document based on these details. Ensure it is well-structured and easy to read.
`,
});

const generatePrivacyPolicyFlow = ai.defineFlow(
  {
    name: 'generatePrivacyPolicyFlow',
    inputSchema: PrivacyPolicyInputSchema,
    outputSchema: PrivacyPolicyOutputSchema,
  },
  async (input) => {
    const processedInput = {
      ...input,
      isDataCollected: input.collectData === 'Yes',
      isThirdPartyUsed: input.useThirdParty === 'Yes',
      isDataShared: input.shareData === 'Yes',
      isAudienceKids: input.targetAudience.includes('Kids under 13'),
      currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
    const { output } = await prompt(processedInput);
    return output!;
  }
);
