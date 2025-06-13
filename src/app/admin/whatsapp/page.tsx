
// src/app/admin/whatsapp/page.tsx
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Send, Users, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Logo from '@/components/logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile sidebar
import { useState, useEffect, useMemo } from 'react';

interface ConversationEntry {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  timestamp: Date;
}

interface ChatMessageEntry {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

const AdminWhatsAppDashboardPage: NextPage = () => {
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [selectedConversationMessages, setSelectedConversationMessages] = useState<ChatMessageEntry[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Selected conversation ID state would go here if needed for dynamic chat display
  // const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);


  useEffect(() => {
    // Initialize data that uses new Date() only on the client side
    const initialConversations: ConversationEntry[] = [
      { id: '1', name: 'John Doe', lastMessage: 'Halo, mau tanya soal servis...', unread: 2, timestamp: new Date() },
      { id: '2', name: 'Jane Smith', lastMessage: 'Terima kasih atas bantuannya!', unread: 0, timestamp: new Date(Date.now() - 3600000) },
      { id: '3', name: 'Budi Santoso', lastMessage: 'Apakah besok bengkel buka?', unread: 1, timestamp: new Date(Date.now() - 7200000) },
      { id: '4', name: 'Siti Aminah', lastMessage: 'Harga cuci motor berapa ya?', unread: 0, timestamp: new Date(Date.now() - 10800000) },
      { id: '5', name: 'Agus Purnomo', lastMessage: 'Mau booking untuk detailing dong.', unread: 5, timestamp: new Date(Date.now() - 14400000) },
    ];
    setConversations(initialConversations);

    const initialMessages: ChatMessageEntry[] = [
      { id: 'm1', sender: 'user', text: 'Halo, mau tanya soal servis...', timestamp: new Date() },
      { id: 'm2', sender: 'agent', text: 'Halo! Tentu, ada yang bisa kami bantu?', timestamp: new Date(Date.now() + 60000) },
      { id: 'm3', sender: 'user', text: 'Motor saya sepertinya akinya soak.', timestamp: new Date(Date.now() + 120000) },
    ];
    // For now, we'll always show John Doe's messages.
    // If selectedConversationId was implemented, you'd filter or fetch messages based on it here.
    setSelectedConversationMessages(initialMessages);
  }, []);

  const filteredConversations = useMemo(() => {
    if (!searchTerm) {
      return conversations;
    }
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);


  return (
    <div className="flex flex-col h-screen bg-secondary">
      <header className="p-4 border-b bg-background flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Buka Menu Navigasi</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <nav className="flex flex-col gap-2 p-4">
                  <Logo className="mb-4" />
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/">
                      <MessageSquare className="mr-2 h-5 w-5" /> Chat Utama
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-5 w-5" /> Pengaturan Agen
                    </Link>
                  </Button>
                  <Button variant="secondary" className="justify-start">
                    <Users className="mr-2 h-5 w-5" /> Dashboard WhatsApp
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </Button>
           <Button variant="outline" size="icon" asChild className="hidden lg:inline-flex">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Kembali ke Halaman Utama</span>
            </Link>
          </Button>
          <div className="hidden lg:block">
             <Logo />
          </div>
          <h1 className="text-xl font-semibold text-foreground lg:ml-4">Dashboard WhatsApp</h1>
        </div>
         <div className="lg:hidden">
            <Logo />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Conversations List - Hidden on small screens, shown in Sheet */}
        <aside className="hidden lg:flex flex-col w-80 border-r bg-background overflow-y-auto">
          <div className="p-4">
            <Input
              placeholder="Cari percakapan..."
              className="mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="flex-1">
            <nav className="flex flex-col gap-1 p-2">
              {filteredConversations.map((conv) => (
                <Button
                  key={conv.id}
                  variant="ghost"
                  className="w-full justify-start h-auto py-3 px-3 items-start"
                  // onClick={() => setSelectedConversationId(conv.id)} // Add this later
                >
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold truncate text-sm">{conv.name}</span>
                      {conv.unread > 0 && (
                        <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                    {conv.timestamp && (
                        <p className="text-xs text-muted-foreground/70 text-right mt-1">
                        {new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(conv.timestamp)}
                        </p>
                    )}
                  </div>
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-card overflow-hidden">
          {/* Selected Chat Header */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">John Doe</h2> {/* Replace with selected conv name */}
            <p className="text-sm text-muted-foreground">Online</p> {/* Replace with actual status */}
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {selectedConversationMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-2.5 shadow-md break-words ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none' // Placeholder colors
                        : 'bg-gray-200 text-gray-800 rounded-bl-none' // Placeholder colors
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.timestamp && (
                        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-gray-500 text-left'}`}>
                        {new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(msg.timestamp)}
                        </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input for Agent */}
          <div className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ketik balasan Anda..."
                className="flex-1"
                // value={agentInputValue}
                // onChange={(e) => setAgentInputValue(e.target.value)}
              />
              <Button size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminWhatsAppDashboardPage;
