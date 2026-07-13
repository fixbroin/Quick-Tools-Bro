import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Hashtag Generator - Get Trending Tags',
    description: 'Generate trending hashtags for social media based on keywords client-side. Completely free and instant.',
    keywords: ['hashtag generator', 'instagram tags creator', 'get trending hashtags', 'tiktok tag finder', 'free social tool'],
    path: '/tools/hashtag-generator',
});

export default function HashtagGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Hashtag Generator - Get Trending Tags',
    description: 'Generate trending hashtags for social media based on keywords client-side. Completely free and instant.',
    url: `${SITE_CONFIG.url}/tools/hashtag-generator`,
  });
  return (
    <>
      <Script
        id="hashtag-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
