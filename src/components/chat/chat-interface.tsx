
'use client';

import { useState, useEffect, useRef, type FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { handleUserMessage } from '@/lib/actions';
import ChatMessage from './chat-message';
import ChatInput from './chat-input';
import ChatAvatar from './chat-avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const SETTINGS_DOC_ID = 'mainConfig';
const SETTINGS_COLLECTION = 'agentSettings';

interface AgentSettings {
  welcomeMessageText?: string;
  isWelcomeMessageEnabled?: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: number;
  imageDataUri?: string; // Added for user images
}

const ChatInterface: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitialMessage, setIsLoadingInitialMessage] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      // setIsLoadingInitialMessage(true); // Managed by initial messages.length check now

      let initialMessageText = "Welcome to MotoAssist! I'm here to help with your motorcycle washing, detailing, or repainting questions. How can I assist you today?";
      let showWelcomeMessage = true;

      try {
        const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
        const docSnap = await getDoc(settingsDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as AgentSettings;
          if (data.isWelcomeMessageEnabled === false) {
            showWelcomeMessage = false;
          } else {
            if (data.welcomeMessageText) {
              initialMessageText = data.welcomeMessageText;
            }
            showWelcomeMessage = data.isWelcomeMessageEnabled === undefined ? true : data.isWelcomeMessageEnabled;
          }
        }
      } catch (error) {
        console.error("Error fetching welcome message from Firestore:", error);
        // Do not set messages here if there's an error, let it fallback or show nothing initially
      }
      
      if (showWelcomeMessage) {
        setMessages((prevMessages) => {
          // Only add welcome message if the chat is truly empty
          if (prevMessages.length === 0) {
            return [
              {
                id: 'welcome-' + uuidv4(), // Give welcome message a somewhat unique prefix for debugging
                text: initialMessageText,
                sender: 'ai',
                timestamp: Date.now(),
              },
            ];
          }
          return prevMessages; // Otherwise, don't touch existing messages
        });
      } else {
         // If welcome message is disabled, and chat is empty, ensure it's an empty array.
         // If chat is not empty, don't clear it just because welcome is disabled.
        setMessages((prevMessages) => prevMessages.length === 0 ? [] : prevMessages);
      }
      setIsLoadingInitialMessage(false); // Always set loading to false after attempting
    };

    // Check if messages is empty before fetching. This is key.
    if (messages.length === 0 && typeof window !== 'undefined') {
      setIsLoadingInitialMessage(true); // Set loading true only when we are about to fetch
      fetchWelcomeMessage();
    } else {
      // If messages are not empty, or not in client, we are past initial loading.
      setIsLoadingInitialMessage(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep empty dependency array: This effect logic should run once on mount.
          // The internal checks (messages.length === 0) will guard subsequent executions if remount occurs.

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if(scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async (currentInputValue: string, currentUserImageDataUri?: string) => {
    const textToSend = currentInputValue.trim();
    if (!textToSend && !currentUserImageDataUri) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: textToSend,
      sender: 'user',
      timestamp: Date.now(),
      imageDataUri: currentUserImageDataUri, 
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue(''); 
    setIsLoading(true);

    try {
      const aiResponseText = await handleUserMessage(userMessage.text, userMessage.imageDataUri);
      const aiMessage: Message = {
        id: uuidv4(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessageText = error instanceof Error ? error.message : "Sorry, I'm having trouble connecting. Please try again later.";
      const errorSender: 'ai' | 'system' = errorMessageText.startsWith("I'm sorry, but I cannot provide an answer") ? 'ai' : 'system';

      const errorMessage: Message = {
        id: uuidv4(),
        text: errorMessageText,
        sender: errorSender,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      
      if (errorSender === 'system' || !errorMessageText.includes("content restrictions")) {
        toast({
          title: "Error",
          description: "Could not connect to the AI service or an unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render loader if messages are empty AND we are in the process of loading initial message
  if (isLoadingInitialMessage && messages.length === 0) {
    return (
      <div className="flex flex-col h-full max-h-screen bg-background rounded-lg shadow-xl overflow-hidden items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-screen bg-background md:rounded-b-lg shadow-xl overflow-hidden">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && ( // Show "typing..." indicator when AI is processing
            <div className="flex items-end gap-2 my-3 justify-start">
               <ChatAvatar sender="ai" />
                <div className="max-w-[70%] rounded-xl px-4 py-2.5 shadow-md bg-card text-card-foreground rounded-bl-none">
                    <p className="text-sm text-muted-foreground italic">MotoAssist is typing...</p>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={(text, imgDataUri) => sendMessage(text, imgDataUri)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
