import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Professional Favicon Generator - Create Icons for All Platforms',
  description: 'Generate a complete set of favicons for your website instantly. Create high-quality icons from images, text, or emojis for iOS, Android, and Desktop.',
  keywords: ['favicon generator', 'favicon creator', 'create favicon', 'ico generator', 'apple touch icon', 'favicon from image', 'favicon from text', 'emoji favicon', 'website icon generator'],
  path: '/tools/favicon-generator',
});

export default function FaviconGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Professional Favicon Generator - Create Icons for All Platforms',
    description: 'Generate a complete set of favicons for your website instantly. Create high-quality icons from images, text, or emojis for iOS, Android, and Desktop.',
    url: `${SITE_CONFIG.url}/tools/favicon-generator`,
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
