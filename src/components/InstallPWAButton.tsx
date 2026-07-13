'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Extend Event type to include PWA-specific properties
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showIosGuide, setShowIosInstruction] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const DISMISS_KEY = 'pwa_install_prompt_dismissed_v3';

  // Determine which app we are installing based on UseBro branding
  const appInfo = {
    name: "UseBro App",
    desc: "Fast, 100% private in-browser web utilities"
  };

  // 1. Core initialization and event listeners
  useEffect(() => {
    setIsMounted(true);
    
    // Check if dismissed before
    if (localStorage.getItem(DISMISS_KEY) === 'true') {
      setIsDismissed(true);
    }
    
    // Check standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    if (isStandalone) setIsAppInstalled(true);

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // 2. Timer logic for minimizing the mobile banner
  useEffect(() => {
    if (!isMounted || isAppInstalled || isDismissed || isMinimized || !isMobile) return;
    
    // Banner is visible, start the 10s countdown to move it to the side as a floating badge
    if (installPrompt || isIos) {
        const timer = setTimeout(() => {
            setIsMinimized(true);
        }, 10000);
        return () => clearTimeout(timer);
    }
  }, [isMounted, isAppInstalled, isDismissed, isMobile, installPrompt, isIos, isMinimized]);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isIos && !isAppInstalled) {
        setShowIosInstruction(true);
        return;
    }

    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
    }
    setInstallPrompt(null);
  };
  
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  if (!isMounted || isAppInstalled || isDismissed) {
    return null;
  }

  // Only show if we have a prompt (Android/Chrome) OR if it's iOS (for manual guide)
  if (!installPrompt && !isIos) {
      return null;
  }

  // --- MOBILE UI (Sliding Banner -> Floating badge after 10 seconds) ---
  if (isMobile) {
      return (
        <>
            {/* Inline Mobile Install Button (Rendered where mounted on the page) */}
            <div className="w-full flex justify-center py-2 md:hidden">
              <Button 
                onClick={handleInstallClick} 
                className="w-full max-w-sm rounded-xl font-bold py-6 text-sm flex items-center justify-center gap-2.5 shadow-md shadow-primary/10 transition-transform active:scale-[0.98]"
              >
                <Image src="/android-chrome-192x192.png" alt="UseBro Logo" width={22} height={22} className="rounded-md shrink-0 shadow-sm" />
                <Download className="h-4 w-4 shrink-0 animate-bounce" />
                {isIos ? "Setup UseBro Web App" : "Install UseBro App"}
              </Button>
            </div>

            {/* LARGE BANNER (Initial State) */}
            <div 
                className={`fixed bottom-20 left-4 right-4 z-[100] transition-all duration-700 ease-in-out transform ${
                    isMinimized 
                    ? 'opacity-0 translate-y-20 pointer-events-none scale-50' 
                    : 'opacity-100 translate-y-0 scale-100'
                }`}
            >
                <div className="bg-card border-2 border-primary/20 shadow-2xl rounded-2xl p-4 flex items-center gap-4 relative">
                    <button 
                        onClick={handleDismiss}
                        className="absolute -top-2 -right-2 bg-muted text-muted-foreground rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors border"
                    >
                        <X size={14} />
                    </button>

                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border relative overflow-hidden">
                        <Image src="/android-chrome-192x192.png" alt="App Icon" width={40} height={40} className="rounded-lg shadow-sm" />
                    </div>

                    <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-bold text-foreground">Install {appInfo.name}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{appInfo.desc}</p>
                    </div>

                    <Button size="sm" onClick={handleInstallClick} className="rounded-full px-5 font-bold shadow-lg shadow-primary/20">
                        {isIos ? "Setup" : "Install"}
                    </Button>
                </div>
            </div>

            {/* MINIMIZED SIDE BADGE (After 10 Seconds) */}
            <div 
                onClick={handleInstallClick}
                className={`fixed top-[40%] right-0 z-[100] transition-all duration-700 ease-in-out transform flex items-center bg-primary text-white shadow-2xl rounded-l-xl p-2 cursor-pointer ${
                    isMinimized 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-20 pointer-events-none'
                }`}
            >
                <div className="flex flex-col items-center gap-1">
                    <Download size={18} className="animate-bounce" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter [writing-mode:vertical-lr] rotate-180">Install</span>
                </div>
                
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(e);
                    }}
                    className="absolute -top-2 -left-2 bg-destructive text-white rounded-full p-0.5 border-2 border-white shadow-md"
                >
                    <X size={10} />
                </button>
            </div>

            {/* iOS Installation Guide */}
            <Dialog open={showIosGuide} onOpenChange={setShowIosInstruction}>
                <DialogContent className="max-w-[90vw] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-primary" />
                            Install on iPhone
                        </DialogTitle>
                        <DialogDescription className="text-left pt-2">
                            To install the UseBro app on your iPhone, follow these simple steps:
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary font-bold text-xs">1</div>
                            <p className="text-sm">Tap the <span className="font-bold inline-flex items-center bg-muted px-1.5 py-0.5 rounded gap-1"><Share size={14} /> Share</span> button in Safari footer.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary font-bold text-xs">2</div>
                            <p className="text-sm">Scroll down and tap <span className="font-bold inline-flex items-center bg-muted px-1.5 py-0.5 rounded gap-1"><PlusSquare size={14} /> Add to Home Screen</span>.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary font-bold text-xs">3</div>
                            <p className="text-sm">Tap <span className="text-primary font-bold">Add</span> in the top right corner.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setShowIosInstruction(false)} className="w-full rounded-xl">Got it!</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
      );
  }

  // --- DESKTOP VIEW (Renders BOTH the inline desktop card banner AND the floating side tab) ---
  return (
    <>
      {/* Inline Horizontal Banner Card (Shown inline in page content flow) */}
      <div className="relative group overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-1 transition-all hover:shadow-lg hover:shadow-primary/5 w-full">
        <div className="absolute -right-12 -top-12 h-32 w-32 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
        
        <button 
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-1.5 text-muted-foreground/30 transition-all hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex items-center gap-6 px-6 py-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg ring-1 ring-white/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
                <Image src="/android-chrome-512x512.png" alt={appInfo.name} width={32} height={32} className="rounded-lg" />
            </div>

            <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="space-y-0.5">
                    <h3 className="font-headline text-base font-bold tracking-tight flex items-center gap-2">
                        Install {appInfo.name} <span className="p-1 rounded-lg bg-primary/10">✨</span>
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                        Fast access, offline mode & native experience.
                    </p>
                </div>

                <div className="flex items-center gap-6 border-l border-primary/20 pl-6 h-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Smartphone className="h-4 w-4" />
                        </div>
                        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                            Compatible with All Devices
                        </div>
                    </div>

                    <Button 
                        onClick={handleInstallClick} 
                        size="sm"
                        className="h-9 rounded-full px-6 font-bold shadow-md hover:shadow-primary/20 hover:scale-105 transition-all"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Install Now
                    </Button>
                </div>
            </div>
        </div>
      </div>

      {/* Floating Side Tab (Fixed on the right edge of screen) */}
      <div
        className="group fixed top-1/2 right-0 -translate-y-1/2 z-50 flex items-center bg-card border-y border-l border-primary/20 shadow-2xl rounded-l-2xl cursor-pointer transition-all duration-500 ease-out w-12 hover:w-48 h-16 overflow-hidden animate-pulse hover:animate-none"
        onClick={handleInstallClick}
      >
        <div className="flex items-center w-full h-full p-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform">
              <Download className="h-5 w-5 text-white animate-bounce group-hover:animate-none" />
          </div>
          
          <div className="ml-3 transition-all duration-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Desktop App</p>
            <p className="text-xs font-bold text-foreground">Install {appInfo.name}</p>
          </div>
        </div>

        <button
            onClick={handleDismiss}
            className="absolute top-1 right-1 h-4 w-4 rounded-full bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white flex items-center justify-center"
          >
            <X size={10} />
        </button>
      </div>
    </>
  );
}
