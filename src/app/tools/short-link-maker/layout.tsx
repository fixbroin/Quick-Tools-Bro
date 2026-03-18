import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Short Link Maker - Create Short URLs Instantly',
    description: 'Create short, shareable URLs from long links with our free and easy-to-use short link maker. Shorten any URL in seconds for social media, marketing, and more.',
    keywords: ['short link maker', 'url shortener', 'link shortener', 'custom url', 'free url shortener', 'tinyurl generator', 'online tool'],
    path: '/tools/short-link-maker',
});

export default function ShortLinkMakerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Short Link Maker - Create Short URLs Instantly',
    description: 'Create short, shareable URLs from long links with our free and easy-to-use short link maker. Shorten any URL in seconds for social media, marketing, and more.',
    url: `${SITE_CONFIG.url}/tools/short-link-maker`,
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
