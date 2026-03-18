import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Image Cropper - Crop Photos Instantly',
    description: 'Crop your JPG, PNG, and other images online for free. Easily define a cropping area and download the result. Works entirely in your browser with no uploads.',
    keywords: ['image cropper', 'crop image', 'photo cropper', 'online crop tool', 'free image editor', 'crop jpg', 'crop png', 'instant image cropping'],
    path: '/tools/image-cropper',
});

export default function ImageCropperLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Image Cropper - Crop Photos Instantly',
    description: 'Crop your JPG, PNG, and other images online for free. Easily define a cropping area and download the result. Works entirely in your browser with no uploads.',
    url: `${SITE_CONFIG.url}/tools/image-cropper`,
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
