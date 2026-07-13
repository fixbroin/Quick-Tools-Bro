import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Image Rotator - Rotate & Flip Images',
    description: 'Rotate images by 90, 180, or 270 degrees, or flip them horizontally/vertically. Safe, instant, and runs entirely in your browser.',
    keywords: ['rotate image', 'flip photo', 'mirror image online', 'rotate photo clockwise', 'free photo rotator'],
    path: '/tools/rotate-image',
});

export default function RotateImageLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Image Rotator - Rotate & Flip Images',
    description: 'Rotate images by 90, 180, or 270 degrees, or flip them horizontally/vertically. Safe, instant, and runs entirely in your browser.',
    url: `${SITE_CONFIG.url}/tools/rotate-image`,
  });
  return (
    <>
      <Script
        id="rotate-image-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
