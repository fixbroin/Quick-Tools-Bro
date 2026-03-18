import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Google Play Feature Graphic Generator - 1024x500',
    description: 'Design a custom 1024x500 feature graphic for your Google Play Store app listing. Easily customize text, logos, backgrounds, and more to create a professional banner.',
    keywords: ['feature graphic generator', 'google play store', 'app promotion', '1024x500 graphic', 'app marketing', 'play store banner', 'android developer tools'],
    path: '/tools/feature-graphic-generator',
});

export default function FeatureGraphicGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Google Play Feature Graphic Generator - 1024x500',
    description: 'Design a custom 1024x500 feature graphic for your Google Play Store app listing. Easily customize text, logos, backgrounds, and more to create a professional banner.',
    url: `${SITE_CONFIG.url}/tools/feature-graphic-generator`,
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
