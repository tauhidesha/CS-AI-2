'use client';

import type { FC } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import ChatAvatar from './chat-avatar';
import type { Message } from './chat-interface';
import NextImage from 'next/image';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const { text, sender, timestamp, imageDataUri } = message;
  const isUser = sender === 'user';
  const isSystem = sender === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="px-3 py-1.5 text-xs bg-muted text-muted-foreground rounded-full shadow">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-2 my-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <ChatAvatar sender="ai" />}
      <div
        className={cn(
          'max-w-[70%] rounded-xl px-4 py-2.5 shadow-md break-words flex flex-col',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground rounded-bl-none'
        )}
      >
        {isUser && imageDataUri && (
          <div className="mb-2 relative w-full max-w-xs aspect-[16/10] rounded-md overflow-hidden self-center" data-ai-hint="user uploaded image">
            <NextImage 
              src={imageDataUri} 
              alt="User upload" 
              layout="fill" 
              objectFit="contain" 
              className="rounded-md"
            />
          </div>
        )}
        {text && <p className="text-sm">{text}</p>}
        <p className={cn('text-xs mt-1', isUser ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left')}>
          {format(new Date(timestamp), 'p')}
        </p>
      </div>
      {isUser && <ChatAvatar sender="user" />}
    </div>
  );
};

export default ChatMessage;