
'use server';
/**
 * @fileOverview A terms and conditions generation AI agent.
 *
 * - generateTermsAndConditions - A function that handles generating a terms and conditions document.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { TermsAndConditionsInput, TermsAndConditionsOutput } from '@/app/tools/terms-and-conditions-generator/page';

// Re-define schemas on the server to avoid client/server boundary issues
const TermsAndConditionsInputSchema = z.object({
  companyName: z.string(),
  websiteUrl: z.string(),
  country: z.string(),
  state: z.string(),
  email: z.string(),
  collectData: z.string(),
  useCookies: z.string(),
  useThirdParty: z.string(),
  targetAudience: z.string(),
  sellProducts: z.string(),
  offerSubscriptions: z.string(),
  userAccounts: z.string(),
  userContent: z.string(),
  allowRefunds: z.string(),
  refundWindow: z.string().optional(),
  userRestrictions: z.string(),
});

const TermsAndConditionsOutputSchema = z.object({
  terms: z.string().describe('The generated terms and conditions document.'),
});

export async function generateTermsAndConditions(input: TermsAndConditionsInput): Promise<TermsAndConditionsOutput> {
  return generateTermsAndConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'termsAndConditionsPrompt',
  input: { schema: TermsAndConditionsInputSchema.extend({
    doesSellProducts: z.boolean(),
    doesOfferSubscriptions: z.boolean(),
    hasUserAccounts: z.boolean(),
    hasUserContent: z.boolean(),
    doesAllowRefunds: z.boolean(),
    currentDate: z.string(),
  }) },
  output: { schema: TermsAndConditionsOutputSchema },
  prompt: `You are a legal expert specializing in writing Terms and Conditions for websites and applications. Generate a comprehensive and professional Terms & Conditions document based on the following information. The document should be formatted as plain text, using numbered sections (e.g., 1. Introduction, 2. User Accounts) instead of markdown headings. Do not use asterisks for bolding.

Terms and Conditions
Effective Date: {{{currentDate}}}

Company Information:
- Company/Business Name: {{{companyName}}}
- Website URL: {{{websiteUrl}}}
- Country of Operation: {{{country}}}
- State of Operation: {{{state}}}
- Contact Email: {{{email}}}

Website/App Features:
- Sells Products/Services: {{{sellProducts}}}
- Offers Subscriptions: {{{offerSubscriptions}}}
- Users Can Create Accounts: {{{userAccounts}}}
- Allows User-Generated Content: {{{userContent}}}
- Offers Refunds/Returns: {{{allowRefunds}}}
{{#if doesAllowRefunds}}
- Refund/Return Window: {{{refundWindow}}}
{{/if}}
- Restrictions on User Behavior: {{{userRestrictions}}}

Data & Privacy:
- Collects Personal Data: {{{collectData}}}
- Uses Cookies: {{{useCookies}}}
- Target Audience: {{{targetAudience}}}

Key Sections to Include:
1.  Introduction/Agreement to Terms: Welcome users and state that using the service means they agree to these terms.
2.  User Accounts: {{#if hasUserAccounts}}Describe user responsibilities for their accounts.{{/if}}
3.  Products/Services & Subscriptions: {{#if doesSellProducts}}Detail terms of sale and payment.{{/if}} {{#if doesOfferSubscriptions}}Detail subscription models.{{/if}}
4.  User-Generated Content: {{#if hasUserContent}}Define ownership, rights, and responsibilities for user-submitted content.{{/if}}
5.  Prohibited Activities: Outline the restrictions on user behavior based on \`userRestrictions\`.
6.  Intellectual Property Rights: State that the content on the site is owned by the company.
7.  Refunds/Returns Policy: {{#if doesAllowRefunds}}Create a clause based on the \`refundWindow\`.{{else}}State that no refunds are offered.{{/if}}
8.  Governing Law: Mention the country and state of operation.
9.  Disclaimer of Warranties & Limitation of Liability: Include standard legal disclaimers.
10. Contact Information: Provide the contact email.

Generate a complete Terms and Conditions document based on these details.
`,
});

const generateTermsAndConditionsFlow = ai.defineFlow(
  {
    name: 'generateTermsAndConditionsFlow',
    inputSchema: TermsAndConditionsInputSchema,
    outputSchema: TermsAndConditionsOutputSchema,
  },
  async (input) => {
    const processedInput = {
        ...input,
        doesSellProducts: input.sellProducts === 'Yes',
        doesOfferSubscriptions: input.offerSubscriptions === 'Yes',
        hasUserAccounts: input.userAccounts === 'Yes',
        hasUserContent: input.userContent === 'Yes',
        doesAllowRefunds: input.allowRefunds === 'Yes',
        currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
    const { output } = await prompt(processedInput);
    return output!;
  }
);
