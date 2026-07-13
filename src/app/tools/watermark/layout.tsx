import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Image Watermark Tool - Watermark Photos',
    description: 'Add text or logo watermarks to your images online client-side. Protect your creative work with custom opacities, grids, and positions.',
    keywords: ['image watermark', 'watermark photo', 'protect photos online', 'add watermark to image', 'free image tool'],
    path: '/tools/watermark',
});

export default function WatermarkLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Image Watermark Tool - Watermark Photos',
    description: 'Add text or logo watermarks to your images online client-side. Protect your creative work with custom opacities, grids, and positions.',
    url: `${SITE_CONFIG.url}/tools/watermark`,
  });
  return (
    <>
      <Script
        id="watermark-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
