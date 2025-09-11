'use server';

/**
 * @fileOverview An AI agent for generating favicons from various sources.
 *
 * - faviconGenerator - A function that generates a favicon from an image, text, or emoji.
 * - FaviconGeneratorInput - The input type for the faviconGenerator function.
 * - FaviconGeneratorOutput - The return type for the faviconGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const FaviconGeneratorInputSchema = z.object({
  source: z.string().describe('The source for the favicon, can be an emoji, text, or a data URI of an image.'),
  inputType: z.enum(['emoji', 'text', 'image']).describe('The type of input provided.'),
});
export type FaviconGeneratorInput = z.infer<typeof FaviconGeneratorInputSchema>;

export const FaviconGeneratorOutputSchema = z.object({
  files: z.record(z.string()).describe(
      'A map of file names to data URIs for the generated favicons. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep the backslashes here
    ),
});
export type FaviconGeneratorOutput = z.infer<typeof FaviconGeneratorOutputSchema>;

export async function faviconGenerator(input: FaviconGeneratorInput): Promise<FaviconGeneratorOutput> {
  return faviconGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faviconGeneratorPrompt',
  input: {schema: FaviconGeneratorInputSchema},
  output: {schema: FaviconGeneratorOutputSchema},
  prompt: `You are an expert designer specializing in generating favicons with transparent backgrounds.

You will take an input source (image, text, or emoji) and generate a set of favicons in different sizes.

Input Type: {{{inputType}}}
Source: {{{source}}}

Generate the following files as data URIs:
- android-chrome-192x192.png
- android-chrome-512x512.png
- apple-touch-icon.png (180x180)
- favicon-16x16.png
- favicon-32x32.png
- favicon.ico (48x48)
`,
});

const faviconGeneratorFlow = ai.defineFlow(
  {
    name: 'faviconGeneratorFlow',
    inputSchema: FaviconGeneratorInputSchema,
    outputSchema: FaviconGeneratorOutputSchema,
  },
  async input => {
    // This flow is now more of a placeholder as the client-side implementation handles generation.
    // If we wanted to use server-side generation, we would implement it here.
    // For now, we'll return an empty object as the client does the work.
    
    // const {output} = await prompt(input);
    // return output!;
    
    console.log("Server-side flow called, but generation is handled client-side.", input);
    return { files: {} };
  }
);
