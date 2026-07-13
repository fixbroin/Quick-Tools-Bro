'use client';

import { useEffect } from 'react';
import { AD_CONFIG } from '@/lib/ad-config';

interface AdPlacementProps {
  position: 'top' | 'bottom';
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
    return (
      <div className="w-full max-w-4xl mx-auto my-4 p-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center min-h-[90px] text-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1">
          Demo Ad Placement Box ({position.toUpperCase()})
        </span>
        <p className="text-[11px] font-bold text-foreground">
          Ad Slot dimensions: 728px × 90px (Leaderboard banner)
        </p>
        <p className="text-[10px] text-muted-foreground">
          Active Provider: <strong className="uppercase">{provider}</strong> (Visible only when NEXT_PUBLIC_ADS_SHOW_DEMO=true)
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
    return (
      <div className="w-full max-w-4xl mx-auto my-4 overflow-hidden flex justify-center min-h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={adsensePubId}
          data-ad-slot={placement.slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // 3. Facebook Audience Network (Meta Ads)
  if (provider === 'facebook') {
    return (
      <div className="w-full max-w-4xl mx-auto my-4 overflow-hidden flex justify-center min-h-[90px]">
        <iframe
          src={`https://www.facebook.com/adnw_request?placement=${placement.fbPlacementId}&adtype=banner728x90`}
          width="728"
          height="90"
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
        className="w-full max-w-4xl mx-auto my-4 overflow-hidden flex justify-center"
        dangerouslySetInnerHTML={{ __html: placement.customHtml }}
      />
    );
  }

  return null;
}
