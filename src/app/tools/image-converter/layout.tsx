import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Image Converter - Convert JPG to PNG & PNG to JPG Free',
    description: 'Easily convert images between JPG and PNG formats online for free. A simple, client-side tool for quick image format conversion without uploading files.',
    keywords: ['image converter', 'jpg to png', 'png to jpg', 'convert image format', 'online converter', 'free tool', 'image utility'],
    path: '/tools/image-converter',
});

export default function ImageConverterLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Image Converter - Convert JPG to PNG & PNG to JPG Free',
    description: 'Easily convert images between JPG and PNG formats online for free. A simple, client-side tool for quick image format conversion without uploading files.',
    url: `${SITE_CONFIG.url}/tools/image-converter`,
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
