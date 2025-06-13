
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, Zap, Brain, Users, Repeat, Save, Loader2, PlusCircle, Trash2, FileText, Tv, BotMessageSquare, LayoutDashboard } from 'lucide-react'; // Removed QrCode
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Logo from '@/components/logo';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const SETTINGS_DOC_ID = 'mainConfig';
const SETTINGS_COLLECTION = 'agentSettings';

interface AgentSettings {
  // Welcome Message
  welcomeMessageText?: string;
  isWelcomeMessageEnabled?: boolean;

  // AI Agent Behavior
  agentPersonality?: string;
  agentResponseLength?: string;
  isAgentProactiveMode?: boolean;
  agentCustomInstructions?: string;

  // Agent Transfer Conditions
  agentTransferKeywords?: string; // Comma-separated
  agentMaxFailedAttempts?: number;
  isAgentSentimentTransfer?: boolean;

  // Knowledge Sources
  knowledgeFaqDocs?: string[];
  knowledgeWebUrls?: string[];
  knowledgeCustomText?: string; 

  // Follow-ups
  followupDelayHours?: number;
  followupMessageText?: string;
  isFollowupEnabled?: boolean;
}

const SettingsPage: NextPage = () => {
  const { toast } = useToast();

  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // State for Welcome Message
  const [welcomeMessage, setWelcomeMessage] = useState("Halo! Ada yang bisa saya bantu hari ini terkait motor Anda?");
  const [isWelcomeMessageEnabled, setIsWelcomeMessageEnabled] = useState(true);
  const [isSavingWelcome, setIsSavingWelcome] = useState(false);

  // State for AI Agent Behavior
  const [agentPersonality, setAgentPersonality] = useState('');
  const [agentResponseLength, setAgentResponseLength] = useState('');
  const [isAgentProactiveMode, setIsAgentProactiveMode] = useState(false);
  const [agentCustomInstructions, setAgentCustomInstructions] = useState('');
  const [isSavingBehavior, setIsSavingBehavior] = useState(false);

  // State for Agent Transfer Conditions
  const [agentTransferKeywords, setAgentTransferKeywords] = useState('');
  const [agentMaxFailedAttempts, setAgentMaxFailedAttempts] = useState<number>(3);
  const [isAgentSentimentTransfer, setIsAgentSentimentTransfer] = useState(false);
  const [isSavingTransfer, setIsSavingTransfer] = useState(false);
  
  // State for Knowledge Sources
  const [knowledgeFaqDocs, setKnowledgeFaqDocs] = useState<string[]>([]);
  const [newFaqDoc, setNewFaqDoc] = useState('');
  const [knowledgeWebUrls, setKnowledgeWebUrls] = useState<string[]>([]);
  const [newWebUrl, setNewWebUrl] = useState('');
  const [knowledgeCustomText, setKnowledgeCustomText] = useState(''); 
  const [isSavingKnowledge, setIsSavingKnowledge] = useState(false);

  // State for Follow-ups
  const [followupDelayHours, setFollowupDelayHours] = useState<number>(24);
  const [followupMessageText, setFollowupMessageText] = useState('');
  const [isFollowupEnabled, setIsFollowupEnabled] = useState(false);
  const [isSavingFollowups, setIsSavingFollowups] = useState(false);


  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoadingSettings(true);
      try {
        const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
        const docSnap = await getDoc(settingsDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as AgentSettings;
          // Welcome Message
          if (data.welcomeMessageText !== undefined) setWelcomeMessage(data.welcomeMessageText);
          if (data.isWelcomeMessageEnabled !== undefined) setIsWelcomeMessageEnabled(data.isWelcomeMessageEnabled);
          
          // AI Agent Behavior
          if (data.agentPersonality !== undefined) setAgentPersonality(data.agentPersonality);
          if (data.agentResponseLength !== undefined) setAgentResponseLength(data.agentResponseLength.toString());
          if (data.isAgentProactiveMode !== undefined) setIsAgentProactiveMode(data.isAgentProactiveMode);
          if (data.agentCustomInstructions !== undefined) setAgentCustomInstructions(data.agentCustomInstructions);

          // Agent Transfer
          if (data.agentTransferKeywords !== undefined) setAgentTransferKeywords(data.agentTransferKeywords);
          if (data.agentMaxFailedAttempts !== undefined) setAgentMaxFailedAttempts(data.agentMaxFailedAttempts);
          if (data.isAgentSentimentTransfer !== undefined) setIsAgentSentimentTransfer(data.isAgentSentimentTransfer);

          // Knowledge Sources
          if (data.knowledgeFaqDocs !== undefined) setKnowledgeFaqDocs(data.knowledgeFaqDocs);
          if (data.knowledgeWebUrls !== undefined) setKnowledgeWebUrls(data.knowledgeWebUrls);
          if (data.knowledgeCustomText !== undefined) setKnowledgeCustomText(data.knowledgeCustomText); 

          // Follow-ups
          if (data.followupDelayHours !== undefined) setFollowupDelayHours(data.followupDelayHours);
          if (data.followupMessageText !== undefined) setFollowupMessageText(data.followupMessageText);
          if (data.isFollowupEnabled !== undefined) setIsFollowupEnabled(data.isFollowupEnabled);

        } else {
          console.log("No such document in Firestore! Using default settings or creating one on save.");
          // Set defaults explicitly if document doesn't exist
          setWelcomeMessage("Halo! Ada yang bisa saya bantu hari ini terkait motor Anda?");
          setIsWelcomeMessageEnabled(true);
          setAgentPersonality('');
          setAgentResponseLength('');
          setIsAgentProactiveMode(false);
          setAgentCustomInstructions('');
          setAgentTransferKeywords('');
          setAgentMaxFailedAttempts(3);
          setIsAgentSentimentTransfer(false);
          setKnowledgeFaqDocs([]);
          setKnowledgeWebUrls([]);
          setKnowledgeCustomText('');
          setFollowupDelayHours(24);
          setFollowupMessageText('');
          setIsFollowupEnabled(false);
        }
      } catch (error) {
        console.error("Error fetching settings from Firestore:", error);
        toast({
          title: "Error Memuat Pengaturan",
          description: "Tidak dapat mengambil pengaturan dari database.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSaveSettings = async (settingsToSave: Partial<AgentSettings>, setIsSavingState: React.Dispatch<React.SetStateAction<boolean>>, sectionName: string) => {
    setIsSavingState(true);
    try {
      const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
      await setDoc(settingsDocRef, settingsToSave, { merge: true });
      toast({
        title: `Pengaturan ${sectionName} Disimpan`,
        description: `Pengaturan ${sectionName.toLowerCase()} telah diperbarui di Firestore.`,
      });
    } catch (error) {
      console.error(`Error saving ${sectionName.toLowerCase()} settings to Firestore:`, error);
      toast({
        title: `Error Menyimpan ${sectionName}`,
        description: `Gagal menyimpan pengaturan ${sectionName.toLowerCase()}.`,
        variant: "destructive",
      });
    } finally {
      setIsSavingState(false);
    }
  };
  
  const handleAddKnowledgeItem = (type: 'faq' | 'url') => {
    if (type === 'faq' && newFaqDoc.trim() !== '') {
      setKnowledgeFaqDocs(prev => [...prev, newFaqDoc.trim()]);
      setNewFaqDoc('');
    } else if (type === 'url' && newWebUrl.trim() !== '') {
      if (!newWebUrl.startsWith('http://') && !newWebUrl.startsWith('https://')) {
        toast({ title: "URL Tidak Valid", description: "Masukkan URL yang valid (diawali http:// atau https://)", variant: "destructive"});
        return;
      }
      setKnowledgeWebUrls(prev => [...prev, newWebUrl.trim()]);
      setNewWebUrl('');
    }
  };

  const handleRemoveKnowledgeItem = (type: 'faq' | 'url', itemIndex: number) => {
    if (type === 'faq') {
      setKnowledgeFaqDocs(prev => prev.filter((_, index) => index !== itemIndex));
    } else if (type === 'url') {
      setKnowledgeWebUrls(prev => prev.filter((_, index) => index !== itemIndex));
    }
  };


  return (
    <main className="flex flex-col min-h-screen bg-secondary">
      <header className="p-4 border-b bg-background flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Kembali ke Dashboard</span>
            </Link>
          </Button>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" asChild>
            <Link href="/playground">
              <BotMessageSquare className="mr-2 h-4 w-4" /> Chat Playground
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard WA
            </Link>
          </Button>
           {/* Removed QrCode link for local client mode */}
          <h1 className="text-xl font-semibold text-foreground hidden md:block ml-4">Pengaturan Agen AI</h1>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 lg:p-12">
        {isLoadingSettings ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Memuat pengaturan...</p>
          </div>
        ) : (
          <Tabs defaultValue="welcome" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
               <TabsTrigger value="welcome">
                <MessageSquare className="mr-2 h-4 w-4" /> Pesan Selamat Datang
              </TabsTrigger>
              <TabsTrigger value="behavior">
                <Zap className="mr-2 h-4 w-4" /> Perilaku
              </TabsTrigger>
              <TabsTrigger value="transfer">
                <Users className="mr-2 h-4 w-4" /> Transfer Agen
              </TabsTrigger>
              <TabsTrigger value="knowledge">
                <Brain className="mr-2 h-4 w-4" /> Sumber Pengetahuan
              </TabsTrigger>
              <TabsTrigger value="followups">
                <Repeat className="mr-2 h-4 w-4" /> Tindak Lanjut
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="welcome">
              <Card>
                <CardHeader>
                  <CardTitle>Pesan Selamat Datang</CardTitle>
                  <CardDescription>Sesuaikan pesan sapaan awal dari agen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-message-text">Teks Sapaan</Label>
                    <Textarea
                      id="welcome-message-text"
                      placeholder="cth., Halo! Ada yang bisa saya bantu hari ini terkait motor Anda?"
                      rows={3}
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      disabled={isSavingWelcome}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-welcome-message"
                      checked={isWelcomeMessageEnabled}
                      onCheckedChange={setIsWelcomeMessageEnabled}
                      disabled={isSavingWelcome}
                    />
                    <Label htmlFor="enable-welcome-message">Aktifkan Pesan Selamat Datang</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto" 
                    onClick={() => handleSaveSettings({ welcomeMessageText: welcomeMessage, isWelcomeMessageEnabled }, setIsSavingWelcome, "Pesan Selamat Datang")} 
                    disabled={isSavingWelcome}
                  >
                    {isSavingWelcome ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSavingWelcome ? "Menyimpan..." : "Simpan Pesan Selamat Datang"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="behavior">
              <Card>
                <CardHeader>
                  <CardTitle>Perilaku Agen AI</CardTitle>
                  <CardDescription>Tentukan bagaimana agen AI Anda berinteraksi dan merespons.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="agent-personality">Kepribadian</Label>
                    <Input 
                      id="agent-personality" 
                      placeholder="cth., Ramah dan Profesional" 
                      value={agentPersonality}
                      onChange={(e) => setAgentPersonality(e.target.value)}
                      disabled={isSavingBehavior}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="response-length">Panjang Respons</Label>
                    <Input 
                      id="response-length" 
                      placeholder="cth., Maks 150 kata atau jumlah token" 
                      value={agentResponseLength}
                      onChange={(e) => setAgentResponseLength(e.target.value)}
                      disabled={isSavingBehavior}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="proactive-mode" 
                      checked={isAgentProactiveMode}
                      onCheckedChange={setIsAgentProactiveMode}
                      disabled={isSavingBehavior}
                    />
                    <Label htmlFor="proactive-mode">Mode Proaktif</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-instructions">Instruksi Khusus</Label>
                    <Textarea 
                      id="custom-instructions" 
                      placeholder="Masukkan instruksi spesifik untuk AI..." 
                      rows={4} 
                      value={agentCustomInstructions}
                      onChange={(e) => setAgentCustomInstructions(e.target.value)}
                      disabled={isSavingBehavior}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto" 
                    onClick={() => handleSaveSettings({ agentPersonality, agentResponseLength, isAgentProactiveMode, agentCustomInstructions }, setIsSavingBehavior, "Perilaku Agen")}
                    disabled={isSavingBehavior}
                  >
                    {isSavingBehavior ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSavingBehavior ? "Menyimpan..." : "Simpan Perilaku"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="transfer">
              <Card>
                <CardHeader>
                  <CardTitle>Kondisi Transfer Agen</CardTitle>
                  <CardDescription>Atur kondisi kapan obrolan akan dialihkan ke agen manusia.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="transfer-keywords">Kata Kunci Transfer</Label>
                    <Input 
                      id="transfer-keywords" 
                      placeholder="cth., bicara dengan manusia, agen, keluhan" 
                      value={agentTransferKeywords}
                      onChange={(e) => setAgentTransferKeywords(e.target.value)}
                      disabled={isSavingTransfer}
                    />
                    <p className="text-sm text-muted-foreground">Kata kunci dipisahkan koma yang memicu transfer.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-failed-attempts">Maks Upaya Gagal (AI tidak mengerti)</Label>
                    <Input 
                      id="max-failed-attempts" 
                      type="number" 
                      value={agentMaxFailedAttempts}
                      onChange={(e) => setAgentMaxFailedAttempts(parseInt(e.target.value, 10))}
                      disabled={isSavingTransfer}
                    />
                    <p className="text-sm text-muted-foreground">Transfer setelah sejumlah respons AI yang tidak berhasil.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="sentiment-transfer" 
                      checked={isAgentSentimentTransfer}
                      onCheckedChange={setIsAgentSentimentTransfer}
                      disabled={isSavingTransfer}
                    />
                    <Label htmlFor="sentiment-transfer">Transfer Saat Sentimen Negatif Terdeteksi</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto" 
                    onClick={() => handleSaveSettings({ agentTransferKeywords, agentMaxFailedAttempts, isAgentSentimentTransfer }, setIsSavingTransfer, "Kondisi Transfer")}
                    disabled={isSavingTransfer}
                  >
                     {isSavingTransfer ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                     {isSavingTransfer ? "Menyimpan..." : "Simpan Kondisi Transfer"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="knowledge">
              <Card>
                <CardHeader>
                  <CardTitle>Sumber Pengetahuan</CardTitle>
                  <CardDescription>Kelola sumber informasi yang digunakan AI Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible className="w-full" defaultValue="custom-text">
                    <AccordionItem value="custom-text">
                      <AccordionTrigger>Teks Pengetahuan Tambahan</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="knowledge-custom-text">Informasi Layanan Tambahan / Catatan</Label>
                          <Textarea
                            id="knowledge-custom-text"
                            placeholder="cth., Layanan poles bodi motor besar mulai dari Rp 200.000. Diskon 10% untuk member."
                            rows={5}
                            value={knowledgeCustomText}
                            onChange={(e) => setKnowledgeCustomText(e.target.value)}
                            disabled={isSavingKnowledge}
                          />
                           <p className="text-sm text-muted-foreground">Tuliskan informasi tambahan atau catatan yang bisa digunakan AI.</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="faq-docs">
                      <AccordionTrigger>Dokumen FAQ (Nama/Path)</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {knowledgeFaqDocs.map((doc, index) => (
                          <div key={`faq-${index}`} className="flex items-center justify-between p-2 border rounded-md">
                            <p className="text-sm truncate flex-1 mr-2">{doc}</p>
                            <Button variant="outline" size="icon" onClick={() => handleRemoveKnowledgeItem('faq', index)} disabled={isSavingKnowledge}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2 items-center">
                          <Input 
                            placeholder="Tambah nama/path dokumen FAQ" 
                            value={newFaqDoc}
                            onChange={(e) => setNewFaqDoc(e.target.value)}
                            disabled={isSavingKnowledge}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddKnowledgeItem('faq')}
                          />
                          <Button variant="secondary" onClick={() => handleAddKnowledgeItem('faq')} disabled={isSavingKnowledge || !newFaqDoc.trim()}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                          </Button>
                        </div>
                        <Button variant="outline" className="w-full" disabled>Unggah File FAQ (Belum Aktif)</Button>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="web-urls">
                      <AccordionTrigger>URL Situs Web</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {knowledgeWebUrls.map((url, index) => (
                          <div key={`url-${index}`} className="flex items-center justify-between p-2 border rounded-md">
                            <p className="text-sm truncate flex-1 mr-2">{url}</p>
                            <Button variant="outline" size="icon" onClick={() => handleRemoveKnowledgeItem('url', index)} disabled={isSavingKnowledge}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2 items-center">
                           <Input 
                            placeholder="Tambah URL (cth., https://contoh.com/info)" 
                            value={newWebUrl}
                            onChange={(e) => setNewWebUrl(e.target.value)}
                            disabled={isSavingKnowledge}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddKnowledgeItem('url')}
                          />
                          <Button variant="secondary" onClick={() => handleAddKnowledgeItem('url')} disabled={isSavingKnowledge || !newWebUrl.trim()}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="service-catalog">
                      <AccordionTrigger>Katalog Layanan</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Hubungkan ke database atau API layanan Anda.</p>
                        <Button variant="secondary" disabled>Hubungkan Katalog Layanan (Belum Aktif)</Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto" 
                    onClick={() => handleSaveSettings({ knowledgeFaqDocs, knowledgeWebUrls, knowledgeCustomText }, setIsSavingKnowledge, "Sumber Pengetahuan")}
                    disabled={isSavingKnowledge}
                  >
                    {isSavingKnowledge ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSavingKnowledge ? "Menyimpan..." : "Simpan Sumber Pengetahuan"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="followups">
              <Card>
                <CardHeader>
                  <CardTitle>Tindak Lanjut</CardTitle>
                  <CardDescription>Konfigurasikan pesan tindak lanjut otomatis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="followup-delay">Penundaan Tindak Lanjut (Jam)</Label>
                    <Input 
                      id="followup-delay" 
                      type="number" 
                      placeholder="cth., 24" 
                      value={followupDelayHours}
                      onChange={(e) => setFollowupDelayHours(parseInt(e.target.value, 10))}
                      disabled={isSavingFollowups}
                    />
                    <p className="text-sm text-muted-foreground">Waktu setelah obrolan berakhir untuk mengirim tindak lanjut.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followup-message">Pesan Tindak Lanjut</Label>
                    <Textarea 
                      id="followup-message" 
                      placeholder="cth., Semoga masalah Anda teratasi! Apakah Anda memerlukan bantuan lebih lanjut?" 
                      rows={3} 
                      value={followupMessageText}
                      onChange={(e) => setFollowupMessageText(e.target.value)}
                      disabled={isSavingFollowups}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="enable-followups" 
                      checked={isFollowupEnabled}
                      onCheckedChange={setIsFollowupEnabled}
                      disabled={isSavingFollowups}
                    />
                    <Label htmlFor="enable-followups">Aktifkan Tindak Lanjut Otomatis</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="ml-auto" 
                    onClick={() => handleSaveSettings({ followupDelayHours, followupMessageText, isFollowupEnabled }, setIsSavingFollowups, "Tindak Lanjut")}
                    disabled={isSavingFollowups}
                  >
                    {isSavingFollowups ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSavingFollowups ? "Menyimpan..." : "Simpan Pengaturan Tindak Lanjut"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
};

export default SettingsPage;
