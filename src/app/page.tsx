
// src/app/page.tsx (New WhatsApp Dashboard - formerly admin/whatsapp/page.tsx)
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { LayoutDashboard, BotMessageSquare, Send, Settings, Menu } from 'lucide-react'; // Removed QrCode
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Logo from '@/components/logo';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect, useMemo } from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarTrigger, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

interface ConversationEntry {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  timestamp: Date;
}

interface ChatMessageEntry {
  id:string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

const MainDashboardPage: NextPage = () => {
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [selectedConversationMessages, setSelectedConversationMessages] = useState<ChatMessageEntry[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

  const NavLinks: React.FC = () => {
    const pathname = usePathname();
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            isActive={pathname === '/'} 
            tooltip={{ children: "Dashboard", side: "right", align: "center" }}
          >
            <Link href="/">
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            isActive={pathname === '/playground'} 
            tooltip={{ children: "Chat Playground", side: "right", align: "center" }}
          >
            <Link href="/playground">
              <BotMessageSquare />
              <span>Chat Playground</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* Removed QrCode link for local client mode */}
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            isActive={pathname === '/settings'} 
            tooltip={{ children: "Pengaturan Agen", side: "right", align: "center" }}
          >
            <Link href="/settings">
              <Settings />
              <span>Pengaturan Agen</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  };
  
  const MobileNavLinks = () => (
    <>
      <Button variant="secondary" className="justify-start text-base" asChild>
        <Link href="/"> <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard </Link>
      </Button>
      <Button variant="ghost" className="justify-start text-base" asChild>
        <Link href="/playground"> <BotMessageSquare className="mr-3 h-5 w-5" /> Chat Playground </Link>
      </Button>
       {/* Removed QrCode link for local client mode */}
      <Button variant="ghost" className="justify-start text-base" asChild>
        <Link href="/settings"> <Settings className="mr-3 h-5 w-5" /> Pengaturan Agen </Link>
      </Button>
    </>
  );


  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen bg-secondary"> {/* PARENT A */}
        {/* Desktop Main Navigation Sidebar Wrapper */}
        <div className="md:hidden xl:block"> {/* Wrapper div for desktop sidebar visibility */}
          <Sidebar collapsible="icon" side="left" className="bg-background border-r">
            <SidebarHeader className="p-4 border-b">
              <Logo />
            </SidebarHeader>
            <SidebarContent className="p-4">
              <NavLinks />
            </SidebarContent>
          </Sidebar>
        </div>

        {/* This div wraps the header and the main content (conversation list + chat area) */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">  {/* PARENT B */}
          <header className="p-4 border-b bg-background flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-2 md:gap-4 min-w-0"> {/* Added min-w-0 to left header group */}
              <SidebarTrigger className="hidden xl:inline-flex" />
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="xl:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Buka Menu Navigasi Utama</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <SheetTitle className="sr-only">Menu Navigasi Utama</SheetTitle>
                  <nav className="flex flex-col gap-3 p-4">
                    <div className="mb-4">
                      <Logo />
                    </div>
                    <MobileNavLinks />
                  </nav>
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-semibold text-foreground truncate">Dashboard WhatsApp</h1>
            </div>
            <div className="lg:hidden">
              <Logo />
            </div>
          </header>

          {/* This div wraps the conversation list sidebar AND the main chat area */}
          <div className="flex flex-1 w-full min-w-0">  {/* PARENT C */}
            {/* Conversation List Sidebar */}
            <aside className="hidden md:flex flex-col w-80 flex-shrink-0 border-r bg-background overflow-y-auto">
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
            <main className="flex-1 min-w-0 flex flex-col bg-card"> {/* Removed overflow-hidden and inline style */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">John Doe</h2>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
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
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
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
              <div className="p-4 border-t bg-background">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Ketik balasan Anda..."
                    className="flex-1"
                  />
                  <Button size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainDashboardPage;
    
