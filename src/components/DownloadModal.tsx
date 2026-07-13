'use client';

import { useState, useEffect } from 'react';
import { X, Download, CheckCircle2, Loader2 } from 'lucide-react';
import { AdPlacement } from './AdPlacement';
import { Button } from './ui/button';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  fileName: string;
}

export function DownloadModal({ isOpen, onClose, onDownload, fileName }: DownloadModalProps) {
  const [timeLeft, setTimeLeft] = useState(5);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setTimeLeft(5);
      setDownloadStarted(false);
      return;
    }

    if (timeLeft <= 0) {
      if (!downloadStarted) {
        setDownloadStarted(true);
        onDownload();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isOpen, timeLeft, downloadStarted, onDownload]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-card border rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            {downloadStarted ? (
              <CheckCircle2 className="h-6 w-6 text-green-500 animate-bounce" />
            ) : (
              <Loader2 className="h-6 w-6 animate-spin" />
            )}
          </div>
          <h3 className="text-lg font-black tracking-tight text-foreground">
            {downloadStarted ? 'Your Download has Started!' : 'Preparing Your File'}
          </h3>
          <p className="text-xs text-muted-foreground truncate px-4">
            {fileName || 'document.zip'}
          </p>
        </div>

        {/* Wait / Status Indicator */}
        <div className="bg-muted/40 py-3 px-4 rounded-2xl text-center border">
          {downloadStarted ? (
            <p className="text-xs font-bold text-green-500">
              Success! Click close below when finished.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Your file is being compiled securely in your browser. Please wait{' '}
              <span className="font-mono text-sm font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {timeLeft}s
              </span>
            </p>
          )}
        </div>

        {/* High-Converting Ad Placement */}
        <div className="border border-primary/10 rounded-2xl p-2 bg-muted/20 flex flex-col items-center justify-center">
          <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Sponsored Offer</span>
          <AdPlacement position="inline" />
        </div>

        {/* Action Button */}
        <div className="flex gap-2 pt-2">
          {downloadStarted ? (
            <Button onClick={onClose} className="w-full h-11 rounded-xl font-bold">
              Close Window
            </Button>
          ) : (
            <Button disabled className="w-full h-11 rounded-xl font-bold bg-muted text-muted-foreground">
              Please Wait...
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
