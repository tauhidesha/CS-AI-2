
// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that answers questions about motorcycle washing, detailing, and repainting services, potentially using provided images and custom knowledge.
 *
 * - answerServiceQuestions - A function that handles the process of answering service-related questions.
 * - AnswerServiceQuestionsInput - The input type for the answerServiceQuestions function.
 * - AnswerServiceQuestionsOutput - The return type for the answerServiceQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerServiceQuestionsInputSchema = z.object({
  question: z.string().describe('The question about the motorcycle washing, detailing, and repainting services.'),
  agentPersonality: z.string().optional().describe('The desired personality for the AI agent (e.g., "friendly and professional", "witty and humorous").'),
  agentResponseLength: z.string().optional().describe('Guidance on the desired length of the AI\'s response (e.g., "concise", "detailed", "around 100 words").'),
  agentCustomInstructions: z.string().optional().describe('Specific custom instructions for the AI agent to follow.'),
  knowledgeCustomText: z.string().optional().describe('Additional textual knowledge or notes about services for the AI to consider. This could include special offers, temporary service changes, or specific details not covered elsewhere.'),
  imageDataUri: z.string().optional().describe("An optional image of the motorcycle or issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AnswerServiceQuestionsInput = z.infer<typeof AnswerServiceQuestionsInputSchema>;

const AnswerServiceQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the services, considering any provided image or custom knowledge.'),
});
export type AnswerServiceQuestionsOutput = z.infer<typeof AnswerServiceQuestionsOutputSchema>;

export async function answerServiceQuestions(input: AnswerServiceQuestionsInput): Promise<AnswerServiceQuestionsOutput> {
  return answerServiceQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerServiceQuestionsPrompt',
  input: {schema: AnswerServiceQuestionsInputSchema},
  output: {schema: AnswerServiceQuestionsOutputSchema},
  prompt: `You are a {{#if agentPersonality}}{{agentPersonality}}{{else}}helpful and professional{{/if}} customer service chatbot for a motorcycle washing, detailing, and repainting business.
  {{#if agentCustomInstructions}}Follow these specific instructions: {{{agentCustomInstructions}}}{{/if}}

  {{#if knowledgeCustomText}}
  Before answering, carefully consider the following additional information, notes, or special offers that might be relevant:
  <knowledge_custom_text>
  {{{knowledgeCustomText}}}
  </knowledge_custom_text>
  {{/if}}

  Answer the following customer question.
  {{#if imageDataUri}}
  An image has been provided by the customer. Analyze this image carefully as part of forming your response. The image might show the motorcycle, a specific part, a problem, or something else relevant to their question.
  Image: {{media url=imageDataUri}}
  {{/if}}
  Question: {{{question}}}

  {{#if agentResponseLength}}Please try to keep your response {{agentResponseLength}}.{{/if}}
  `,
});

const answerServiceQuestionsFlow = ai.defineFlow(
  {
    name: 'answerServiceQuestionsFlow',
    inputSchema: AnswerServiceQuestionsInputSchema,
    outputSchema: AnswerServiceQuestionsOutputSchema,
  },
  async input => {
    const result = await prompt(input);
    const output = result.output;

    if (!output) {
      let errorMessage = 'AI model did not return the expected output structure.';
      const finishReason = result.candidates?.[0]?.finishReason;
      const finishMessage = result.candidates?.[0]?.finishMessage;
      if (finishReason) {
        errorMessage += ` Finish reason: ${finishReason}.`;
        if (finishReason === 'SAFETY') {
          errorMessage += ' The response was blocked due to safety settings.';
        } else if (finishReason === 'RECITATION') {
          errorMessage += ' The response was blocked due to recitation policy.';
        }
        if (finishMessage) {
          errorMessage += ` Message: ${finishMessage}.`;
        }
      }
      console.error('Genkit prompt for answerServiceQuestionsFlow did not return an output. Full result:', JSON.stringify(result, null, 2));
      throw new Error(errorMessage);
    }
    return output;
  }
);
