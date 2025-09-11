'use server';
/**
 * @fileOverview A currency conversion AI agent.
 *
 * - convertCurrency - A function that handles converting an amount from one currency to another.
 * - ConvertCurrencyInput - The input type for the convertCurrency function.
 * - ConvertCurrencyOutput - The return type for the convertCurrency function.
 * - getCurrencySymbols - A function that fetches all available currency symbols.
 * - CurrencySymbolsOutput - The return type for the getCurrencySymbols function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import axios from 'axios';

const ConvertCurrencyInputSchema = z.object({
  amount: z.number().describe('The amount to convert.'),
  from: z.string().describe('The currency to convert from.'),
  to: z.string().describe('The currency to convert to.'),
});
export type ConvertCurrencyInput = z.infer<typeof ConvertCurrencyInputSchema>;

const ConvertCurrencyOutputSchema = z.object({
  result: z.number().describe('The converted amount.'),
});
export type ConvertCurrencyOutput = z.infer<typeof ConvertCurrencyOutputSchema>;

const CurrencySymbolsOutputSchema = z.object({
    symbols: z.record(z.object({
        description: z.string(),
        code: z.string(),
    })).describe('A map of currency codes to their details.'),
});
export type CurrencySymbolsOutput = z.infer<typeof CurrencySymbolsOutputSchema>;


export async function convertCurrency(input: ConvertCurrencyInput): Promise<ConvertCurrencyOutput> {
  return convertCurrencyFlow(input);
}

export async function getCurrencySymbols(): Promise<CurrencySymbolsOutput> {
    return getCurrencySymbolsFlow();
}

const convertCurrencyFlow = ai.defineFlow(
  {
    name: 'convertCurrencyFlow',
    inputSchema: ConvertCurrencyInputSchema,
    outputSchema: ConvertCurrencyOutputSchema,
  },
  async (input) => {
    // This flow is no longer used for live data.
    // The client-side implementation handles the conversion with fixed rates.
    console.log("Server-side currency conversion flow called, but conversion is handled client-side.");
    return { result: 0 };
  }
);

const getCurrencySymbolsFlow = ai.defineFlow(
  {
    name: 'getCurrencySymbolsFlow',
    outputSchema: CurrencySymbolsOutputSchema,
  },
  async () => {
    // This flow is no longer used for live data.
    console.log("Server-side currency symbols flow called, but data is hardcoded client-side.");
    return { symbols: {} };
  }
);
