'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Volume2, VolumeX, SkipForward, ArrowRight } from 'lucide-react';
import { AD_CONFIG } from '@/lib/ad-config';
import { Button } from '@/components/ui/button';
import { AdPlacement } from '@/components/AdPlacement';

interface DownloadGateContextType {
  triggerDownload: (onDownload: () => void, fileName: string) => void;
}

const DownloadGateContext = createContext<DownloadGateContextType | undefined>(undefined);

export function useDownloadGate() {
  const context = useContext(DownloadGateContext);
  if (!context) {
    throw new Error('useDownloadGate must be used within a DownloadGateProvider');
  }
  return context;
}

declare global {
  interface Window {
    isBypassingGate?: boolean;
    lastAdWatchedTime?: number;
  }
}

export function DownloadGateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [onDownloadCallback, setOnDownloadCallback] = useState<() => void>(() => {});
  
  // Timer States
  const [elapsed, setElapsed] = useState(0);
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const { downloadAd } = AD_CONFIG;

  const triggerDownload = (onDownload: () => void, name: string) => {
    if (!downloadAd.enabled) {
      onDownload();
      return;
    }
    // If ad was watched recently (within 15s), bypass the gate to prevent double ad triggers (e.g. click Convert then click Download)
    if (window.lastAdWatchedTime && Date.now() - window.lastAdWatchedTime < 15000) {
      onDownload();
      return;
    }
    setOnDownloadCallback(() => onDownload);
    setFileName(name);
    setElapsed(0);
    setDownloadTriggered(false);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen || !downloadAd.enabled) {
      return;
    }

    if (elapsed >= downloadAd.duration) {
      if (!downloadTriggered) {
        setDownloadTriggered(true);
        window.lastAdWatchedTime = Date.now(); // Record watch timestamp
        window.isBypassingGate = true;
        onDownloadCallback();
        window.isBypassingGate = false;
        setIsOpen(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, elapsed, downloadTriggered, onDownloadCallback, downloadAd]);

  // Global browser download interceptor hook
  useEffect(() => {
    if (!downloadAd.enabled) return;

    const originalClick = HTMLAnchorElement.prototype.click;

    HTMLAnchorElement.prototype.click = function(this: HTMLAnchorElement) {
      if (window.isBypassingGate) {
        return originalClick.apply(this);
      }

      const href = this.href || '';
      const downloadAttr = this.getAttribute('download');

      // Intercept any anchor click that triggers a download (blob, download attribute, or direct attachment)
      if (downloadAttr !== null || href.startsWith('blob:') || href.includes('download')) {
        const self = this;
        triggerDownload(() => {
          window.isBypassingGate = true;
          originalClick.apply(self);
          window.isBypassingGate = false;
        }, downloadAttr || 'download-file');
        return;
      }

      return originalClick.apply(this);
    };

    return () => {
      HTMLAnchorElement.prototype.click = originalClick;
    };
  }, [downloadAd.enabled]);

  // Global click action interceptor hook (captures manual downloads and action buttons)
  useEffect(() => {
    if (!downloadAd.enabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      if (window.isBypassingGate) return;

      const target = e.target as HTMLElement;

      // Ignore all clicks originating inside the ad modal container to prevent recursive loops
      if (target.closest('#download-gate-modal')) {
        return;
      }

      // 1. Intercept manual mouse clicks on Anchor download links (e.g. <a> download tags)
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        const downloadAttr = anchor.getAttribute('download');

        // Check if this anchor click triggers a file download
        if (downloadAttr !== null || href.startsWith('blob:') || href.includes('download') || href.includes('attachment')) {
          if (anchor.getAttribute('data-gated') === 'true') {
            return; // Let the gated click proceed
          }

          e.preventDefault();
          e.stopPropagation();

          triggerDownload(() => {
            window.isBypassingGate = true;
            anchor.setAttribute('data-gated', 'true');
            anchor.click();
            window.isBypassingGate = false;
            
            setTimeout(() => {
              anchor.removeAttribute('data-gated');
            }, 1000);
          }, downloadAttr || 'download-file');
          return;
        }
      }

      // 2. Intercept button actions (Convert, Compress, Process, Generate, Download, Save, Calculate)
      const button = target.closest('button, input[type="button"], input[type="submit"]');
      if (!button) return;

      const text = button.textContent?.toLowerCase() || '';

      const isConvertAction = 
        text.includes('convert') || 
        text.includes('compress') || 
        text.includes('generate') || 
        text.includes('build') ||
        text.includes('process') ||
        text.includes('download') ||
        text.includes('save') ||
        text.includes('export') ||
        text.includes('create') ||
        text.includes('run') ||
        text.includes('calculate') ||
        text.includes('format') ||
        text.includes('encode') ||
        text.includes('decode') ||
        text.includes('encrypt') ||
        text.includes('decrypt') ||
        text.includes('minify') ||
        text.includes('optimize') ||
        text.includes('resize') ||
        text.includes('extract') ||
        text.includes('merge') ||
        text.includes('split') ||
        text.includes('render') ||
        text.includes('analyze') ||
        text.includes('write');

      const isExcludeAction =
        text.includes('back') ||
        text.includes('clear') ||
        text.includes('reset') ||
        text.includes('remove') ||
        text.includes('delete') ||
        text.includes('cancel') ||
        text.includes('close');

      if (isConvertAction && !isExcludeAction) {
        if (button.getAttribute('data-gated') === 'true') {
          return; // Let the gated click proceed
        }

        e.preventDefault();
        e.stopPropagation();

        triggerDownload(() => {
          window.isBypassingGate = true;
          button.setAttribute('data-gated', 'true');
          (button as HTMLButtonElement).click();
          window.isBypassingGate = false;
          
          setTimeout(() => {
            button.removeAttribute('data-gated');
          }, 1000);
        }, text.toUpperCase());
      }
    };

    // Use capture phase to intercept the click event early before standard handlers trigger
    document.addEventListener('click', handleGlobalClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [downloadAd.enabled]);

  const handleSkip = () => {
    if (elapsed >= downloadAd.skipAfter && !downloadTriggered) {
      setDownloadTriggered(true);
      window.lastAdWatchedTime = Date.now(); // Record watch timestamp
      window.isBypassingGate = true;
      onDownloadCallback();
      window.isBypassingGate = false;
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const skipSecondsLeft = Math.max(0, downloadAd.skipAfter - elapsed);
  const totalSecondsLeft = Math.max(0, downloadAd.duration - elapsed);
  const canSkip = elapsed >= downloadAd.skipAfter;

  return (
    <DownloadGateContext.Provider value={{ triggerDownload }}>
      {children}

      {/* Global Download Ad Gate Modal */}
      {isOpen && downloadAd.enabled && (
        <div id="download-gate-modal" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0 animate-in zoom-in duration-300">
            
            {/* Header / File Title Bar */}
            <div className="bg-[#1e293b] py-3 px-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 overflow-hidden mr-4">
                <span className="text-[10px] font-black uppercase bg-primary/20 text-primary px-2 py-0.5 rounded">Preparing</span>
                <span className="text-xs font-bold text-slate-200 truncate">{fileName || 'file.zip'}</span>
              </div>
              <button 
                onClick={handleClose} 
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Showcase Area: Custom Ad vs Google AdSense */}
            <div className="relative bg-black aspect-video flex items-center justify-center group">
              
              {downloadAd.mode === 'custom' ? (
                // 1. CUSTOM AD MODE (User uploaded images or videos)
                downloadAd.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video
                      src={downloadAd.fileUrl}
                      autoPlay
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-contain"
                    />
                    <button 
                      onClick={() => setIsMuted(prev => !prev)}
                      className="absolute bottom-4 left-4 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="h-4 w-4" /> Unmute
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4 text-green-400" /> Muted
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <a 
                    href={downloadAd.linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full h-full block relative"
                  >
                    <img 
                      src={downloadAd.fileUrl} 
                      alt="Advertisement" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors flex items-end p-4">
                      <span 
                        style={{ backgroundColor: '#673DE6', color: '#ffffff' }}
                        className="text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg"
                      >
                        Visit Site <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </a>
                )
              ) : (
                // 2. GOOGLE ADSENSE MODE (Fall back to AdSense units)
                <div className="w-full h-full bg-slate-900 flex items-center justify-center p-4">
                  <div className="w-full max-w-[300px] aspect-square rounded-2xl bg-slate-950 p-2 border border-slate-800 flex flex-col items-center justify-center">
                    <AdPlacement position="inline" />
                  </div>
                </div>
              )}

              {/* Advertisement Label */}
              <span className="absolute top-4 left-4 bg-black/60 text-[9px] font-extrabold tracking-widest text-slate-300 uppercase px-2 py-0.5 rounded border border-slate-700 pointer-events-none">
                {downloadAd.mode === 'custom' ? 'Sponsor Ad' : 'Google Ad'}
              </span>
            </div>

            {/* Controls / Progress Footer */}
            <div className="p-6 bg-[#0f172a] space-y-4">
              
              {/* Progress Text */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-200">
                    {downloadTriggered ? 'Download starting...' : 'Securing your file connection...'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Please support our free online utilities by watching our sponsor message.
                  </p>
                </div>

                {/* Status Countdown */}
                {!downloadTriggered && (
                  <div className="text-xs text-slate-400 font-bold bg-[#1e293b]/60 py-1.5 px-3 rounded-xl border border-slate-800">
                    Auto-download in <span className="font-mono text-primary text-sm font-black ml-1">{totalSecondsLeft}s</span>
                  </div>
                )}
              </div>

              {/* Skip / Download Button Row */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {!canSkip ? (
                  <Button 
                    disabled 
                    className="h-11 rounded-xl px-5 font-bold bg-slate-800 text-slate-400 border border-slate-700/50 flex items-center gap-2"
                  >
                    You can skip in {skipSecondsLeft}s
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSkip}
                    className="h-11 rounded-xl px-6 font-bold bg-green-600 hover:bg-green-500 text-white flex items-center gap-2 shadow-lg shadow-green-950/30 transition-transform hover:scale-[1.02]"
                  >
                    Skip Ad & Download <SkipForward className="h-4 w-4" />
                  </Button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </DownloadGateContext.Provider>
  );
}
