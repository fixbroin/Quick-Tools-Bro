'use client';
import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function LoadingSpinner() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 shadow-2xl border w-full max-w-[280px] text-center space-y-6">
        <div>
          <span className="font-headline text-2xl font-bold block">{siteName}</span>
        </div>
        <div className="relative flex items-center justify-center h-20 w-20">
          {/* Outer expanding ping ring */}
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-75" />
          {/* Inner pulsating logo */}
          <div className="relative rounded-2xl bg-background p-2 border shadow-sm animate-pulse">
            <Image 
              src="/android-chrome-192x192.png" 
              alt={siteName} 
              width={64} 
              height={64} 
              className="rounded-xl"
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    </div>
  );
}

function ProgressBarComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleStart = (url: string) => {
        const currentUrl = pathname + searchParams.toString();
        const newUrl = url.split('?')[0] + (url.split('?')[1] || '');
        if (currentUrl !== newUrl) {
            setIsLoading(true);
        }
    }

    const handleComplete = () => setIsLoading(false);

    const handleLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor && anchor.href) {
            handleStart(anchor.href);
        }
    };
    
    document.addEventListener('click', handleLinkClick);

    const timer = setTimeout(() => {
        if(isLoading) {
            handleComplete();
        }
    }, 5000);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      clearTimeout(timer);
    };
  }, [pathname, searchParams, isLoading]);

  return isLoading ? <LoadingSpinner /> : null;
}

export function ProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarComponent />
    </Suspense>
  )
}
