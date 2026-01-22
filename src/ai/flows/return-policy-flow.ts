
'use server';
/**
 * @fileOverview A return policy generation AI agent.
 *
 * - generateReturnPolicy - A function that handles generating a return policy.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { ReturnPolicyInput, ReturnPolicyOutput } from '@/app/tools/return-policy-generator/page';

// Re-define schemas on the server to avoid client/server boundary issues
const ReturnPolicyInputSchema = z.object({
  companyName: z.string(),
  websiteUrl: z.string(),
  country: z.string(),
  state: z.string(),
  supportContact: z.string(),
  acceptsReturns: z.enum(['Yes', 'No']),
  returnTimeframe: z.string().optional(),
  shippingResponsibility: z.string().optional(),
  itemCondition: z.string().optional(),
  returnExceptions: z.string().optional(),
  offersExchanges: z.enum(['Yes', 'No']).optional(),
});

const ReturnPolicyOutputSchema = z.object({
  policy: z.string().describe('The generated return policy document.'),
});

export async function generateReturnPolicy(input: ReturnPolicyInput): Promise<ReturnPolicyOutput> {
  return generateReturnPolicyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'returnPolicyPrompt',
  input: { schema: ReturnPolicyInputSchema.extend({
      doesAcceptReturns: z.boolean(),
      currentDate: z.string(),
  }) },
  output: { schema: ReturnPolicyOutputSchema },
  prompt: `You are a legal expert specializing in writing return policies for businesses. Generate a comprehensive and professional return policy based on the following information. The policy should be formatted as plain text, using numbered sections (e.g., 1. Introduction, 2. Conditions for Returns) instead of markdown headings. Do not use asterisks for bolding.

Effective Date: {{{currentDate}}}

Company Information:
- Company/Business Name: {{{companyName}}}
- Website URL: {{{websiteUrl}}}
- Country of Operation: {{{country}}}
- State of Operation: {{{state}}}
- Customer Support Contact: {{{supportContact}}}

Return Details:
- Do you accept returns?: {{{acceptsReturns}}}

{{#if doesAcceptReturns}}
- Timeframe for returns: {{{returnTimeframe}}}
- Who pays for return shipping?: {{{shippingResponsibility}}}
- Required condition of items for return: {{{itemCondition}}}
- Items/services that are exceptions to the return policy: {{{returnExceptions}}}
- Do you offer exchanges instead of returns?: {{{offersExchanges}}}
{{/if}}

Key Sections to Include:
1.  Introduction: State the purpose of the return policy.
2.  Conditions for Returns: {{#if doesAcceptReturns}}Detail the timeframe ({{{returnTimeframe}}}), required item condition ({{{itemCondition}}}), and who is responsible for shipping costs ({{{shippingResponsibility}}}).{{else}}State clearly that returns are not accepted.{{/if}}
3.  Exceptions: {{#if doesAcceptReturns}}List any items that are not eligible for return ({{{returnExceptions}}}).{{/if}}
4.  Exchanges: {{#if doesAcceptReturns}}State whether you offer exchanges ({{{offersExchanges}}}).{{/if}}
5.  How to Initiate a Return: {{#if doesAcceptReturns}}Explain the process for initiating a return.{{/if}}
6.  Contact Information: Provide the customer support contact details for questions.

Generate a complete return policy document based on these details. Ensure it is well-structured and easy to read. Conclude with the disclaimer: "This is a standard auto-generated Return Policy. Please review with a legal professional for compliance with your region."
`,
});

const generateReturnPolicyFlow = ai.defineFlow(
  {
    name: 'generateReturnPolicyFlow',
    inputSchema: ReturnPolicyInputSchema,
    outputSchema: ReturnPolicyOutputSchema,
  },
  async (input) => {
    const processedInput = {
      ...input,
      doesAcceptReturns: input.acceptsReturns === 'Yes',
      currentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
    const { output } = await prompt(processedInput);
    return output!;
  }
);
