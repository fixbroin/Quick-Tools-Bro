'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, Share } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


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

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    // Check if the app is in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
    
    // Check if user is on an iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!prompt) return;

    prompt.prompt();
    prompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setPrompt(null);
    });
  };

  // If already installed, don't show anything
  if (isStandalone) {
    return null;
  }

  // Show Chrome-style install button if prompt is available
  if (prompt) {
    return (
      <Button onClick={handleInstallClick} variant="accent" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Install App
      </Button>
    );
  }
  
  // Show instructions for iOS Safari users
  if (isIos && !isStandalone) {
     return (
        <Alert className="flex items-center gap-4">
            <Share className="h-6 w-6 text-primary"/>
            <div>
                <AlertTitle>Install on your iPhone</AlertTitle>
                <AlertDescription>
                   Tap the Share button and then &quot;Add to Home Screen&quot; to install this app.
                </AlertDescription>
            </div>
        </Alert>
     )
  }

  return null;
}
