'use client';

import { useEffect } from 'react';
import { AD_CONFIG } from '@/lib/ad-config';

interface AdPlacementProps {
  position: 'top' | 'bottom' | 'inline';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdPlacement({ position }: AdPlacementProps) {
  const { enabled, showDemo, provider, adsensePubId, placements } = AD_CONFIG;
  const placement = placements[position];

  useEffect(() => {
    // Initialize AdSense push if AdSense is selected and enabled
    if (enabled && provider === 'adsense') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense display error:', err);
      }
    }
  }, [enabled, provider, position]);

  // 1. Demo Mode Placeholder (Useful to visualize ad layout spots in development)
  if (showDemo) {
    const dimensions = position === 'inline' ? '300px × 250px (Medium Rectangle)' : '728px × 90px (Leaderboard banner)';
    const sizeClasses = position === 'inline' ? 'max-w-[300px] min-h-[250px]' : 'max-w-4xl min-h-[90px]';
    return (
      <div className={`w-full mx-auto my-4 p-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center text-center ${sizeClasses}`}>
        <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1">
          Demo Ad Placement ({position.toUpperCase()})
        </span>
        <p className="text-[11px] font-bold text-foreground">
          Ad Slot dimensions: {dimensions}
        </p>
        <p className="text-[10px] text-muted-foreground">
          Active Provider: <strong className="uppercase">{provider}</strong>
        </p>
      </div>
    );
  }

  // If ads are disabled globally, display absolutely nothing
  if (!enabled || provider === 'none') {
    return null;
  }

  // 2. Google AdSense Provider
  if (provider === 'adsense') {
    const style = position === 'inline' 
      ? { display: 'block', width: '100%', maxWidth: '300px', margin: '0 auto' } 
      : { display: 'block', width: '100%' };
    const format = position === 'inline' ? 'rectangle' : 'auto';
    return (
      <div className={`w-full mx-auto my-4 overflow-hidden flex justify-center ${position === 'inline' ? 'min-h-[250px]' : 'min-h-[90px]'}`}>
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-client={adsensePubId}
          data-ad-slot={placement.slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // 3. Facebook Audience Network (Meta Ads)
  if (provider === 'facebook') {
    const width = position === 'inline' ? '300' : '728';
    const height = position === 'inline' ? '250' : '90';
    const adtype = position === 'inline' ? 'banner300x250' : 'banner728x90';
    return (
      <div className={`w-full mx-auto my-4 overflow-hidden flex justify-center ${position === 'inline' ? 'min-h-[250px]' : 'min-h-[90px]'}`}>
        <iframe
          src={`https://www.facebook.com/adnw_request?placement=${placement.fbPlacementId}&adtype=${adtype}`}
          width={width}
          height={height}
          frameBorder="0"
          scrolling="no"
          style={{ border: 'none', overflow: 'hidden' }}
          title={`Facebook Ad ${position}`}
        />
      </div>
    );
  }

  // 4. Custom Ad Code Provider (Affiliates, Direct Banners, Alternative Networks like Adsterra/Media.net)
  if (provider === 'custom') {
    return (
      <div 
        className="w-full mx-auto my-4 overflow-hidden flex justify-center"
        dangerouslySetInnerHTML={{ __html: placement.customHtml }}
      />
    );
  }

  return null;
}
