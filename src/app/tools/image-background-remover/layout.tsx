import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Free Image Background Remover Online - 100% Automatic & Private',
  description: 'Remove background from images (JPG, PNG, WebP) instantly for free. Our AI-powered tool runs 100% in your browser, ensuring your photos never leave your device. No registration required.',
  keywords: ['remove background online', 'free background remover', 'transparent background maker', 'automatic background removal', 'ai image editor', 'png transparency', 'private image editor'],
  path: '/tools/image-background-remover',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Free Image Background Remover Online - 100% Automatic & Private',
    description: 'Remove background from images (JPG, PNG, WebP) instantly for free. Our AI-powered tool runs 100% in your browser, ensuring your photos never leave your device.',
    url: `${SITE_CONFIG.url}/tools/image-background-remover`,
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
