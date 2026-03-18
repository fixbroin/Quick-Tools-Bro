import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Free Online Image Compressor - Reduce Image Size Without Quality Loss',
  description: 'Compress JPG, PNG, and WebP images online for free. Reduce file size up to 90% without losing quality. Fast, secure, and entirely browser-based.',
  keywords: ['image compressor', 'reduce image size', 'online image compression', 'compress png', 'compress jpg', 'webp compressor', 'free photo compressor'],
  path: '/tools/image-compressor',
});

export default function ImageCompressorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Image Compressor - Reduce Image Size Without Quality Loss',
    description: 'Compress JPG, PNG, and WebP images online for free. Reduce file size up to 90% without losing quality. Fast, secure, and entirely browser-based.',
    url: `${SITE_CONFIG.url}/tools/image-compressor`,
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
