'use client';

import type { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bot } from 'lucide-react';

interface ChatAvatarProps {
  sender: 'user' | 'ai';
}

const ChatAvatar: FC<ChatAvatarProps> = ({ sender }) => {
  if (sender === 'user') {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
      <AvatarFallback>
        <Bot className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  );
};

export default ChatAvatar;
