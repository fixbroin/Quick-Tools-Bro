'use client';
import { useState, useEffect } from 'react';

const BANNER_LINKS = [
  'https://play.google.com/store/apps/details?id=com.fixbro.invoicebro&hl=en_IN',
  'https://brobookme.com',
  'https://play.google.com/store/apps/details?id=com.fixbro.newtalent&hl=en_IN',
  'https://play.google.com/store/apps/details?id=com.fixbro.chat&hl=en_IN',
  'https://fixbro.in/referral',
  'https://fixbro.in'
];

export function PromoBanner() {
  const [bannerIndex, setBannerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SHOW_BANNERS !== 'true') return;
    // Pick a random banner index (0 to 5) on mount to ensure hydration safety
    setBannerIndex(Math.floor(Math.random() * BANNER_LINKS.length));
  }, []);

  if (process.env.NEXT_PUBLIC_SHOW_BANNERS !== 'true') {
    return null;
  }

  if (bannerIndex === null) {
    return (
      <div className="relative w-full h-[180px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[450px] mt-6 rounded-2xl bg-muted animate-pulse border border-primary/5" />
    );
  }

  const bannerLink = BANNER_LINKS[bannerIndex];

  return (
    <div className="relative w-full h-[180px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[450px] mt-6 rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.005]">
      {/* Ad Attribution Badge */}
      <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[9px] font-black tracking-widest uppercase select-none pointer-events-none">
        Ad
      </span>
      <a href={bannerLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        <img 
          src={`/banners/${bannerIndex + 1}.png`} 
          alt="FixBro Promotion" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      </a>
    </div>
  );
}
