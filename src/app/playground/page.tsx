// src/app/playground/page.tsx
'use client'; // <--- TAMBAHKAN INI DI PALING ATAS

import type { NextPage } from 'next';
import Link from 'next/link';
import { LayoutDashboard, BotMessageSquare, Settings, Menu, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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

// Dynamically import ChatInterface with ssr: false
const ChatInterface = dynamic(() => import('@/components/chat/chat-interface'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 justify-center items-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading Chat Interface...</p>
    </div>
  ),
});

const PlaygroundPage: NextPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // isClient state is no longer strictly necessary if the whole page is 'use client'
  // but ChatInterface dynamic import still benefits from being sure it's client-side.

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
      <Button variant="ghost" className="justify-start text-base" asChild>
        <Link href="/"> <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard </Link>
      </Button>
      <Button variant="secondary" className="justify-start text-base" asChild>
        <Link href="/playground"> <BotMessageSquare className="mr-3 h-5 w-5" /> Chat Playground </Link>
      </Button>
      <Button variant="ghost" className="justify-start text-base" asChild>
        <Link href="/settings"> <Settings className="mr-3 h-5 w-5" /> Pengaturan Agen </Link>
      </Button>
    </>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen bg-secondary">
        <div className="md:hidden xl:block">
          <Sidebar collapsible="icon" side="left" className="bg-background border-r">
            <SidebarHeader className="p-4 border-b">
              <Logo />
            </SidebarHeader>
            <SidebarContent className="p-4">
              <NavLinks />
            </SidebarContent>
          </Sidebar>
        </div>
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <header className="p-4 border-b bg-background flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
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
              <h1 className="text-xl font-semibold text-foreground truncate">Chat Playground</h1>
            </div>
            <div className="lg:hidden">
                <Logo />
            </div>
          </header>
          <main className="flex-1 min-w-0 flex flex-col">
            {/* ChatInterface will be dynamically imported here */}
            <ChatInterface /> 
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PlaygroundPage;
