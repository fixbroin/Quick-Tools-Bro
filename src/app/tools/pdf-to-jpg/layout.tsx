import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'PDF to JPG Converter - Convert PDF to High-Quality JPGs',
    description: 'Convert each page of a PDF document into separate, high-quality JPG images for free. A fast and secure online tool for all your PDF to JPG conversion needs.',
    keywords: ['pdf to jpg', 'convert pdf to jpg', 'pdf to image', 'pdf converter', 'online tool', 'free converter', 'document conversion'],
    path: '/tools/pdf-to-jpg',
});

export default function PdfToJpgLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'PDF to JPG Converter - Convert PDF to High-Quality JPGs',
    description: 'Convert each page of a PDF document into separate, high-quality JPG images for free. A fast and secure online tool for all your PDF to JPG conversion needs.',
    url: `${SITE_CONFIG.url}/tools/pdf-to-jpg`,
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
