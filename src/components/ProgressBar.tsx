'use client';
import { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Wrench } from 'lucide-react';

function LoadingSpinner() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 shadow-2xl border w-full max-w-[280px] text-center space-y-4">
        <div>
          <span className="font-headline text-2xl font-bold block">{siteName}</span>
        </div>
        <div className="text-primary">
          <Wrench className="h-12 w-12 animate-spin" />
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
