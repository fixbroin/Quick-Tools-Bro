import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online YouTube Tag Generator - Tags for SEO',
    description: 'Generate optimized SEO tags for YouTube videos client-side. Completely free, safe, and instant.',
    keywords: ['youtube tag generator', 'youtube tags for seo', 'video tag creator', 'yt tags finder', 'free social tool'],
    path: '/tools/youtube-tag-generator',
});

export default function YouTubeTagGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online YouTube Tag Generator - Tags for SEO',
    description: 'Generate optimized SEO tags for YouTube videos client-side. Completely free, safe, and instant.',
    url: `${SITE_CONFIG.url}/tools/youtube-tag-generator`,
  });
  return (
    <>
      <Script
        id="youtube-tag-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
