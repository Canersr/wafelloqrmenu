// src/ai/flows/suggest-waffle.ts
'use server';

/**
 * @fileOverview A waffle combination suggestion AI agent.
 *
 * - suggestWaffleCombination - A function that suggests waffle combinations.
 * - SuggestWaffleCombinationInput - The input type for the suggestWaffleCombination function.
 * - SuggestWaffleCombinationOutput - The return type for the suggestWaffleCombination function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWaffleCombinationInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The user\s waffle preferences (e.g., sweet, savory, fruity).'),
});
export type SuggestWaffleCombinationInput = z.infer<
  typeof SuggestWaffleCombinationInputSchema
>;

const SuggestWaffleCombinationOutputSchema = z.object({
  suggestedCombination: z
    .string()
    .describe('A creative waffle combination suggestion.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested combination.'),
});
export type SuggestWaffleCombinationOutput = z.infer<
  typeof SuggestWaffleCombinationOutputSchema
>;

export async function suggestWaffleCombination(
  input: SuggestWaffleCombinationInput
): Promise<SuggestWaffleCombinationOutput> {
  return suggestWaffleCombinationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWaffleCombinationPrompt',
  input: {schema: SuggestWaffleCombinationInputSchema},
  output: {schema: SuggestWaffleCombinationOutputSchema},
  prompt: `You are a creative waffle chef specializing in creating unique waffle combinations.

  Based on the user's preferences, suggest a waffle combination and explain your reasoning.

  User Preferences: {{{userPreferences}}}
  `,
});

const suggestWaffleCombinationFlow = ai.defineFlow(
  {
    name: 'suggestWaffleCombinationFlow',
    inputSchema: SuggestWaffleCombinationInputSchema,
    outputSchema: SuggestWaffleCombinationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
