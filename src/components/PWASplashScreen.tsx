'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PWASplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Check if running in PWA standalone display-mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;

    // Check if splash has already been shown in this session to bypass page changes
    const hasShown = sessionStorage.getItem('pwa_splash_shown') === 'true';

    if (isStandalone && !hasShown) {
      setIsRendered(true);
      setIsVisible(true);

      // Play splash screen animation for 1.2s, then fade out
      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('pwa_splash_shown', 'true');
      }, 1200);

      // Completely remove from DOM after fade-out transition (300ms)
      const destroyTimer = setTimeout(() => {
        setIsRendered(false);
      }, 1500);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(destroyTimer);
      };
    }
  }, []);

  if (!isRendered) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl animate-pulse">
          <Image 
            src="/android-chrome-512x512.png" 
            alt="UseBro Logo" 
            fill
            priority
            sizes="96px"
            className="object-cover"
          />
        </div>
        <h2 className="font-headline text-3xl font-extrabold tracking-tight uppercase italic text-primary animate-bounce">
          UseBro.in
        </h2>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
          Loading Standalone App
        </p>
      </div>
    </div>
  );
}
