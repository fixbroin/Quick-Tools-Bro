
'use server';
/**
 * @fileOverview An AI agent for generating YouTube thumbnails.
 *
 * - generateThumbnail - A function that generates a thumbnail from an image and a text prompt.
 * - GenerateThumbnailInput - The input type for the generateThumbnail function.
 * - GenerateThumbnailOutput - The return type for the generateThumbnail function.
 */

import { ai } from '@/ai/genkit';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';

const GenerateThumbnailInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "The source photo for the thumbnail, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This image will be 16:9 and may have black bars (letterboxing)."
    ),
  prompt: z.string().describe('A text prompt describing the desired style or content of the thumbnail.'),
  apiKey: z.string().optional().describe('The user-provided Google AI API key.'),
});
export type GenerateThumbnailInput = z.infer<typeof GenerateThumbnailInputSchema>;

const GenerateThumbnailOutputSchema = z.object({
  imageDataUri: z.string().describe(
      "The generated thumbnail image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateThumbnailOutput = z.infer<typeof GenerateThumbnailOutputSchema>;

export async function generateThumbnail(input: GenerateThumbnailInput): Promise<GenerateThumbnailOutput> {
  return generateThumbnailFlow(input);
}

const generateThumbnailFlow = ai.defineFlow(
  {
    name: 'generateThumbnailFlow',
    inputSchema: GenerateThumbnailInputSchema,
    outputSchema: GenerateThumbnailOutputSchema,
  },
  async (input) => {
    console.log('Generating thumbnail with input:', input.prompt);
    
    let generator = ai;
    if (input.apiKey) {
        generator = genkit({
            plugins: [googleAI({ apiKey: input.apiKey })],
            model: 'googleai/gemini-2.0-flash',
        });
    }

    const { media } = await generator.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            { media: { url: input.photoDataUri } },
            { text: `Your task is to transform the provided 16:9 image into a compelling YouTube thumbnail. The image may contain a centered subject with black bars (letterboxing).

Your goal is to creatively replace the black bars and enhance the entire scene based on the user's prompt: "${input.prompt}".

Follow these steps:
1.  Analyze the user's prompt to understand the desired theme, style, and any text to be added.
2.  Analyze the provided image to identify the main subject.
3.  Seamlessly integrate the main subject into a new, dynamic background that you generate based on the prompt.
4.  If there are black bars in the original image, you MUST fill them with the new background content.
5.  Add any text, graphics, or effects requested in the prompt to make the thumbnail eye-catching.
6.  The final output MUST be a single, cohesive 16:9 landscape image. Maintain the 16:9 aspect ratio without adding new black bars.` },
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media || !media.url) {
        throw new Error('AI did not return an image.');
    }
    
    return { imageDataUri: media.url };
  }
);
