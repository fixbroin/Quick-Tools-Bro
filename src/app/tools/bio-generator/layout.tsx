import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Social Bio Generator - Profile Bios Maker',
    description: 'Generate catchy, structured social bios for LinkedIn, Twitter, or Instagram client-side. Fast, safe, and free.',
    keywords: ['bio generator', 'profile bio creator', 'social media bio maker', 'linkedin summary helper', 'free social tool'],
    path: '/tools/bio-generator',
});

export default function BioGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Social Bio Generator - Profile Bios Maker',
    description: 'Generate catchy, structured social bios for LinkedIn, Twitter, or Instagram client-side. Fast, safe, and free.',
    url: `${SITE_CONFIG.url}/tools/bio-generator`,
  });
  return (
    <>
      <Script
        id="bio-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
