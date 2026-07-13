import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Video Title Generator - Catchy Titles Maker',
    description: 'Generate viral, click-worthy video titles for YouTube or TikTok client-side. Fast, safe, and completely free.',
    keywords: ['video title generator', 'youtube title creator', 'viral headlines maker', 'clickbait title builder', 'free social tool'],
    path: '/tools/video-title-generator',
});

export default function VideoTitleGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Video Title Generator - Catchy Titles Maker',
    description: 'Generate viral, click-worthy video titles for YouTube or TikTok client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/video-title-generator`,
  });
  return (
    <>
      <Script
        id="video-title-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
