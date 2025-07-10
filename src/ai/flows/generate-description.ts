'use server';

/**
 * @fileOverview An AI agent to generate menu item descriptions for Wafello.
 *
 * - generateDescription - A function that generates a product description.
 * - GenerateDescriptionInput - The input type for the generateDescription function.
 * - GenerateDescriptionOutput - The return type for the generateDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the menu item.'),
  category: z.string().describe('The category of the menu item (e.g., "Meyveli Waffle", "İçecekler").'),
});
export type GenerateDescriptionInput = z.infer<
  typeof GenerateDescriptionInputSchema
>;

const GenerateDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('A creative, appetizing, and concise menu description in Turkish.'),
});
export type GenerateDescriptionOutput = z.infer<
  typeof GenerateDescriptionOutputSchema
>;

export async function generateDescription(
  input: GenerateDescriptionInput
): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: {schema: GenerateDescriptionInputSchema},
  output: {schema: GenerateDescriptionOutputSchema},
  prompt: `You are a creative food writer for a waffle shop named "Wafello". Your task is to write a compelling, appetizing, and relatively short menu description in TURKISH.

  Menu Item Name: {{{productName}}}
  Category: {{{category}}}

  Generate a description that makes the customer want to order it immediately. Focus on fresh ingredients and delicious combinations. Keep it concise.
  `,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
