import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online CSS Code Generator - Shadows, Borders & Gradients',
    description: 'Generate CSS styles visually online client-side. Configure box shadow, border-radius, gradients, and copy ready-to-use code.',
    keywords: ['css generator', 'box shadow generator', 'border radius generator', 'gradient code maker', 'free developer tool'],
    path: '/tools/css-generator',
});

export default function CSSGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online CSS Code Generator - Shadows, Borders & Gradients',
    description: 'Generate CSS styles visually online client-side. Configure box shadow, border-radius, gradients, and copy ready-to-use code.',
    url: `${SITE_CONFIG.url}/tools/css-generator`,
  });
  return (
    <>
      <Script
        id="css-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
