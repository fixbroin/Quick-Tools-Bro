import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online URL Encoder & Decoder',
    description: 'Encode or decode URL query strings and parameters client-side. Fast, safe, and completely free.',
    keywords: ['url encoder', 'url decoder', 'url escape string', 'percent encoding calculator', 'free developer tool'],
    path: '/tools/url-encode',
});

export default function URLEncodeLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online URL Encoder & Decoder',
    description: 'Encode or decode URL query strings and parameters client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/url-encode`,
  });
  return (
    <>
      <Script
        id="url-encode-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
