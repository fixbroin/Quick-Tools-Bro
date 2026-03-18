import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Online Image Resizer - Resize Photos for Free Instantly',
    description: 'Resize your images to any dimension for free. Change the width and height of your photos online, with or without maintaining the aspect ratio. Simple, fast, and secure.',
    keywords: ['image resizer', 'resize image', 'photo resizer', 'change image size', 'online resizer', 'image dimensions', 'free tool', 'instant image resizing'],
    path: '/tools/image-resizer',
});

export default function ImageResizerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Online Image Resizer - Resize Photos for Free Instantly',
    description: 'Resize your images to any dimension for free. Change the width and height of your photos online, with or without maintaining the aspect ratio. Simple, fast, and secure.',
    url: `${SITE_CONFIG.url}/tools/image-resizer`,
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
