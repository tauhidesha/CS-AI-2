
// Summarizes a conversation for customer service agents to quickly understand context.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The complete conversation history between the customer and the chatbot.'),
});
export type SummarizeConversationInput = z.infer<typeof SummarizeConversationInputSchema>;

const SummarizeConversationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
});
export type SummarizeConversationOutput = z.infer<typeof SummarizeConversationOutputSchema>;

export async function summarizeConversation(input: SummarizeConversationInput): Promise<SummarizeConversationOutput> {
  return summarizeConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: {schema: SummarizeConversationInputSchema},
  output: {schema: SummarizeConversationOutputSchema},
  prompt: `You are an AI customer service assistant. Please summarize the following conversation between a customer and a chatbot, highlighting the key issues and requests made by the customer.  The summary should be concise and easy to understand for a customer service agent.

Conversation History:
{{{conversationHistory}}}`,
});

const summarizeConversationFlow = ai.defineFlow(
  {
    name: 'summarizeConversationFlow',
    inputSchema: SummarizeConversationInputSchema,
    outputSchema: SummarizeConversationOutputSchema,
  },
  async input => {
    const result = await prompt(input);
    const output = result.output;

    if (!output) {
      let errorMessage = 'AI model did not return the expected output structure for summarization.';
      const finishReason = result.candidates?.[0]?.finishReason;
      if (finishReason) {
        errorMessage += ` Finish reason: ${finishReason}.`;
         if (finishReason === 'SAFETY') {
          errorMessage += ' The response was blocked due to safety settings.';
        } else if (finishReason === 'RECITATION') {
          errorMessage += ' The response was blocked due to recitation policy.';
        }
      }
      console.error('Genkit prompt for summarizeConversationFlow did not return an output. Full result:', JSON.stringify(result, null, 2));
      throw new Error(errorMessage);
    }
    return output;
  }
);
