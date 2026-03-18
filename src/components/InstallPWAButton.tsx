'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, Share, X, Sparkles, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWAButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    // Check if the app is in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
    
    // Check if user is on an iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(ios);

    // On iOS, if not standalone, we show it manually after a delay
    if (ios && !isStandalone) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isStandalone]);

  const handleInstallClick = () => {
    if (!prompt) return;

    prompt.prompt();
    prompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        setIsVisible(false);
      }
      setPrompt(null);
    });
  };

  const dismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  // If already installed or dismissed, don't show anything
  if (isStandalone || isDismissed || !isVisible) {
    return null;
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

  return (
    <>
      {/* Mobile Floating Banner */}
      <div className="fixed bottom-20 left-4 right-4 z-[60] md:hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ease-in-out">
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-background/80 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md">
          <div className="absolute -right-4 -top-4 h-24 w-24 bg-primary/10 blur-2xl" />
          
          <button 
            onClick={dismiss}
            className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg ring-1 ring-white/20">
              <Image src="/android-chrome-192x192.png" alt={siteName} width={32} height={32} className="rounded-md" />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-sm font-bold tracking-tight text-foreground">{siteName}</span>
                <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              </div>
              <p className="text-[11px] font-medium text-muted-foreground/80 leading-tight">
                {isIos ? 'Tap Share and "Add to Home Screen"' : 'Install for the best experience'}
              </p>
            </div>

            {!isIos && prompt && (
              <Button 
                onClick={handleInstallClick} 
                variant="accent" 
                size="sm" 
                className="h-8 rounded-full px-4 text-xs font-bold shadow-md hover:scale-105 transition-transform"
              >
                Install
              </Button>
            )}
            
            {isIos && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Share className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop/Inline Horizontal View */}
      <div className="hidden md:block relative group overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-1 transition-all hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute -right-12 -top-12 h-32 w-32 bg-primary/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
        
        <button 
          onClick={dismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-1.5 text-muted-foreground/30 transition-all hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex items-center gap-6 px-6 py-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg ring-1 ring-white/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
                <Image src="/android-chrome-512x512.png" alt={siteName} width={32} height={32} className="rounded-lg" />
            </div>

            <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="space-y-0.5">
                    <h3 className="font-headline text-base font-bold tracking-tight flex items-center gap-2">
                        Install {siteName} <Sparkles className="h-3 w-3 text-primary" />
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

                    {!isIos && prompt && (
                        <Button 
                            onClick={handleInstallClick} 
                            variant="accent" 
                            size="sm"
                            className="h-9 rounded-full px-6 font-bold shadow-md hover:shadow-primary/20 hover:scale-105 transition-all"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Install Now
                        </Button>
                    )}

                    {isIos && (
                         <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold text-primary">
                            <Share className="h-3.5 w-3.5" /> Share &gt; Add to Home Screen
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
