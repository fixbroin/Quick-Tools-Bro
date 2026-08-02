'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  threshold?: number; // Scroll offset threshold to show the button
}

export default function ScrollToTop({ threshold = 300 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 bottom-20 md:bottom-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Button
        onClick={scrollToTop}
        size="icon"
        variant="outline"
        className="h-10 w-10 rounded-full shadow-lg border-primary/20 bg-background/95 backdrop-blur hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-200 group relative"
        aria-label="Scroll to Top"
      >
        <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
        
        {/* Hover Tooltip */}
        <span className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 px-2.5 py-1 rounded bg-slate-950 text-slate-50 text-[10px] font-bold tracking-wide whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl border border-slate-800">
          Scroll to Top
        </span>
      </Button>
    </div>
  );
}
