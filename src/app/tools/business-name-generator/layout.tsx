import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Business Name Generator',
    description: 'Generate brandable, unique business names client-side based on seed keywords. Completely free and instant.',
    keywords: ['business name generator', 'brand name creator', 'company naming tool', 'store name ideas', 'free business tool'],
    path: '/tools/business-name-generator',
});

export default function BusinessNameGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Business Name Generator',
    description: 'Generate brandable, unique business names client-side based on seed keywords. Completely free and instant.',
    url: `${SITE_CONFIG.url}/tools/business-name-generator`,
  });
  return (
    <>
      <Script
        id="business-name-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
