
'use server';
/**
 * @fileOverview A refund policy generation AI agent.
 *
 * - generateRefundPolicy - A function that handles generating a refund policy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { RefundPolicyInput, RefundPolicyOutput } from '@/app/tools/refund-policy-generator/page';

// Re-define schemas on the server to avoid client/server boundary issues
const RefundPolicyInputSchema = z.object({
  companyName: z.string(),
  websiteUrl: z.string(),
  country: z.string(),
  state: z.string(),
  supportContact: z.string(),
  offerRefunds: z.enum(['Yes', 'No']),
  refundTimeframe: z.string().optional(),
  eligiblePurchases: z.string().optional(),
  refundMethod: z.string().optional(),
  nonRefundableConditions: z.string().optional(),
  refundRequestProcess: z.string().optional(),
});

const RefundPolicyOutputSchema = z.object({
  policy: z.string().describe('The generated refund policy document.'),
});

export async function generateRefundPolicy(input: RefundPolicyInput): Promise<RefundPolicyOutput> {
  return generateRefundPolicyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refundPolicyPrompt',
  input: { schema: RefundPolicyInputSchema.extend({
      doesOfferRefunds: z.boolean(),
      currentDate: z.string(),
  }) },
  output: { schema: RefundPolicyOutputSchema },
  prompt: `You are a legal expert specializing in writing refund policies for businesses. Generate a comprehensive and professional refund policy based on the following information. The policy should be formatted as plain text, using numbered sections (e.g., 1. Introduction, 2. Refund Eligibility) instead of markdown headings. Do not use asterisks for bolding.

Effective Date: {{{currentDate}}}

Company Information:
- Company/Business Name: {{{companyName}}}
- Website URL: {{{websiteUrl}}}
- Country of Operation: {{{country}}}
- State of Operation: {{{state}}}
- Customer Support Contact: {{{supportContact}}}

Refund Details:
- Do you offer refunds?: {{{offerRefunds}}}

{{#if doesOfferRefunds}}
- Timeframe for requesting a refund: {{{refundTimeframe}}}
- Eligible purchases for refunds: {{{eligiblePurchases}}}
- How refunds are issued (method): {{{refundMethod}}}
- Conditions where a refund will NOT be provided: {{{nonRefundableConditions}}}
- How customers should request a refund: {{{refundRequestProcess}}}
{{/if}}

Key Sections to Include:
1.  Introduction: State the purpose of the refund policy.
2.  Refund Eligibility: {{#if doesOfferRefunds}}Detail the conditions for a refund, including the timeframe ({{{refundTimeframe}}}), what purchases are eligible ({{{eligiblePurchases}}}), and what conditions make items non-refundable ({{{nonRefundableConditions}}}).{{else}}State clearly that no refunds are offered.{{/if}}
3.  How to Request a Refund: {{#if doesOfferRefunds}}Explain the process for requesting a refund ({{{refundRequestProcess}}}).{{/if}}
4.  Refund Processing: {{#if doesOfferRefunds}}Describe how refunds will be processed and the method used ({{{refundMethod}}}).{{/if}}
5.  Contact Information: Provide the customer support contact details for questions.

Generate a complete refund policy document based on these details. Ensure it is well-structured and easy to read. Conclude with the disclaimer: "This is a standard auto-generated Refund Policy. Please review with a legal professional for compliance with your region."
`,
});

const generateRefundPolicyFlow = ai.defineFlow(
  {
    name: 'generateRefundPolicyFlow',
    inputSchema: RefundPolicyInputSchema,
    outputSchema: RefundPolicyOutputSchema,
  },
  async (input) => {
    const processedInput = {
      ...input,
      doesOfferRefunds: input.offerRefunds === 'Yes',
      currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
    const { output } = await prompt(processedInput);
    return output!;
  }
);
