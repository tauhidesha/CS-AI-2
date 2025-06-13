
'use server';

import { answerServiceQuestions, AnswerServiceQuestionsInput } from '@/ai/flows/answer-service-questions';
import { summarizeConversation, SummarizeConversationInput } from '@/ai/flows/summarize-conversation';
import type { Message } from '@/components/chat/chat-interface';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
// Import sendAdminNotificationViaWhatsApp if you intend for the STUDIO server to send notifications
// based on AI's decision, independent of the local client's actions.
// For now, we assume the local client will handle sending notifications upon receiving a "transfer" response.
// import { sendAdminNotificationViaWhatsApp } from '@/lib/whatsapp-sender';

const SETTINGS_DOC_ID = 'mainConfig';
const SETTINGS_COLLECTION = 'agentSettings';

interface AgentBehaviorSettings {
  agentPersonality?: string;
  agentResponseLength?: string;
  agentCustomInstructions?: string;
  isAgentProactiveMode?: boolean;
  knowledgeCustomText?: string;
  agentTransferKeywords?: string; // Comma-separated
}

export async function handleUserMessage(question: string, imageDataUri?: string): Promise<string> {
  let agentBehavior: AgentBehaviorSettings = {
    agentPersonality: 'helpful and professional',
  };
  let knowledgeCustomTextContent: string | undefined = undefined;
  let transferKeywords: string[] = [];

  try {
    const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(settingsDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      agentBehavior = {
        agentPersonality: data.agentPersonality || agentBehavior.agentPersonality,
        agentResponseLength: data.agentResponseLength,
        agentCustomInstructions: data.agentCustomInstructions,
        isAgentProactiveMode: data.isAgentProactiveMode,
        knowledgeCustomText: data.knowledgeCustomText,
        agentTransferKeywords: data.agentTransferKeywords,
      };
      knowledgeCustomTextContent = data.knowledgeCustomText;
      if (data.agentTransferKeywords && typeof data.agentTransferKeywords === 'string') {
        transferKeywords = data.agentTransferKeywords.split(',').map(kw => kw.trim().toLowerCase()).filter(kw => kw.length > 0);
      }
    }
  } catch (error) {
    console.error('Error fetching agent behavior settings from Firestore:', error);
  }

  const lowercasedQuestion = question.toLowerCase();
  let transferTriggered = false;
  if (transferKeywords.length > 0) {
    for (const keyword of transferKeywords) {
      if (lowercasedQuestion.includes(keyword)) {
        transferTriggered = true;
        break;
      }
    }
  }

  if (transferTriggered) {
    // This specific message will be a signal for the local client.
    // The local client will then send the actual notification to the admin.
    console.log('[handleUserMessage] Transfer keyword detected. Signaling local client to notify admin.');
    // You can customize this message further if needed.
    return "TRANSFER_TO_HUMAN_REQUESTED:Baik, saya akan segera meneruskan Anda ke agen manusia. Mohon tunggu sebentar.";
  }

  try {
    const input: AnswerServiceQuestionsInput = {
      question,
      agentPersonality: agentBehavior.agentPersonality,
      agentResponseLength: agentBehavior.agentResponseLength,
      agentCustomInstructions: agentBehavior.agentCustomInstructions,
      knowledgeCustomText: knowledgeCustomTextContent,
      imageDataUri,
    };
    const result = await answerServiceQuestions(input);
    return result.answer;
  } catch (error) {
    console.error('Error calling answerServiceQuestions AI flow:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("Finish reason: SAFETY") || errorMessage.includes("Finish reason: RECITATION")) {
      return "I'm sorry, but I cannot provide an answer to that question due to content restrictions. Please try a different question.";
    }
    return "I'm sorry, I encountered an error processing your request. Please try again.";
  }
}

export async function getConversationSummary(messages: Message[]): Promise<string> {
  try {
    const conversationHistory = messages
      .map(msg => `${msg.sender === 'user' ? 'Customer' : 'MotoAssist'}: ${msg.text}`)
      .join('\n');

    const input: SummarizeConversationInput = { conversationHistory };
    const result = await summarizeConversation(input);
    return result.summary;
  } catch (error) {
    console.error('Error calling summarizeConversation AI flow:', error);
    return "Error summarizing conversation.";
  }
}
