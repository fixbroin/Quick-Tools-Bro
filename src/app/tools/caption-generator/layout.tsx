import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Social Media Caption Generator',
    description: 'Create engaging social captions for Instagram, LinkedIn, or Twitter client-side. Completely free.',
    keywords: ['caption generator', 'instagram caption maker', 'linkedin post creator', 'tweets helper', 'free social tool'],
    path: '/tools/caption-generator',
});

export default function CaptionGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Social Media Caption Generator',
    description: 'Create engaging social captions for Instagram, LinkedIn, or Twitter client-side. Completely free.',
    url: `${SITE_CONFIG.url}/tools/caption-generator`,
  });
  return (
    <>
      <Script
        id="caption-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
