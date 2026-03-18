import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Love Calculator - Check Compatibility Between Names',
    description: 'Calculate the love compatibility between two names with this fun tool. Find out your love percentage and see what the future holds!',
    keywords: ['love calculator', 'compatibility test', 'love percentage', 'name calculator', 'relationship tool', 'fun calculator', 'love meter'],
    path: '/tools/love-calculator',
});

export default function LoveCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Love Calculator - Check Compatibility Between Names',
    description: 'Calculate the love compatibility between two names with this fun tool. Find out your love percentage and see what the future holds!',
    url: `${SITE_CONFIG.url}/tools/love-calculator`,
  });
  return (
    <>
      <Script
        id="tool-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
