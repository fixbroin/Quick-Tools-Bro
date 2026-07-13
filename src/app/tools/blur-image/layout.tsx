import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Blur Image Tool - Blur Photos Instantly',
    description: 'Blur parts or all of your images online client-side. Protect privacy, redact info, or create aesthetic blur effects entirely in your browser.',
    keywords: ['blur image', 'blur photo', 'redact image info', 'censor photo text', 'free image blur tool'],
    path: '/tools/blur-image',
});

export default function BlurImageLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Blur Image Tool - Blur Photos Instantly',
    description: 'Blur parts or all of your images online client-side. Protect privacy, redact info, or create aesthetic blur effects entirely in your browser.',
    url: `${SITE_CONFIG.url}/tools/blur-image`,
  });
  return (
    <>
      <Script
        id="blur-image-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
