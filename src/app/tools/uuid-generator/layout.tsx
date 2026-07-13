import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online UUID Generator - Bulk RFC 4122 UUID v4',
    description: 'Generate high-quality cryptographically secure UUID version 4 tokens online client-side. Supports bulk generations and standard formatting.',
    keywords: ['uuid generator', 'guid generator', 'generate uuid v4', 'bulk uuid generator', 'free developer tool'],
    path: '/tools/uuid-generator',
});

export default function UUIDGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online UUID Generator - Bulk RFC 4122 UUID v4',
    description: 'Generate high-quality cryptographically secure UUID version 4 tokens online client-side. Supports bulk generations and standard formatting.',
    url: `${SITE_CONFIG.url}/tools/uuid-generator`,
  });
  return (
    <>
      <Script
        id="uuid-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
