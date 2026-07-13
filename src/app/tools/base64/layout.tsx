import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Base64 Encoder & Decoder',
    description: 'Encode or decode text and files to/from Base64 format online client-side. 100% private, runs entirely in your browser.',
    keywords: ['base64 encoder', 'base64 decoder', 'file to base64', 'base64 to file', 'free developer tool'],
    path: '/tools/base64',
});

export default function Base64Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Base64 Encoder & Decoder',
    description: 'Encode or decode text and files to/from Base64 format online client-side. 100% private, runs entirely in your browser.',
    url: `${SITE_CONFIG.url}/tools/base64`,
  });
  return (
    <>
      <Script
        id="base64-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
