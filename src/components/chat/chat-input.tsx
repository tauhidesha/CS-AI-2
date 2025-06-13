'use client';

import type { FC, KeyboardEvent, ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2, Paperclip, XCircle } from 'lucide-react';
import NextImage from 'next/image'; // Using NextImage for preview

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string, imageDataUri?: string) => void; // Modified to include imageDataUri
  isLoading: boolean;
}

const ChatInput: FC<ChatInputProps> = ({ value, onChange, onSend, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && (value.trim() || selectedFile)) {
        handleSend();
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setPreviewUrl(resultStr);
        setImageDataUri(resultStr);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow selecting the same file again
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageDataUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if (!isLoading && (value.trim() || selectedFile)) {
      onSend(value, imageDataUri ?? undefined); // Pass imageDataUri
      // Image is cleared here, ChatInterface will clear text input value via prop
      handleRemoveImage(); 
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      {previewUrl && (
        <div className="mb-2 relative w-24 h-24 border rounded-md overflow-hidden shadow-md">
          <NextImage src={previewUrl} alt="Image preview" layout="fill" objectFit="cover" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 bg-black/60 text-white hover:bg-black/80 h-6 w-6 rounded-full p-1"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="shrink-0 rounded-full w-12 h-12"
          aria-label="Attach image"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Textarea
          placeholder="Ketik pesan atau lampirkan gambar..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 resize-none max-h-24 overflow-y-auto rounded-full py-3 px-4 focus-visible:ring-1"
          disabled={isLoading}
          aria-label="Chat input"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={isLoading || (!value.trim() && !selectedFile)}
          className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground w-12 h-12"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;