import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'JPG to PDF Converter - Combine JPGs into One PDF Free Instantly',
    description: 'Combine multiple JPG images into a single, easy-to-share PDF file for free. Reorder images and convert them in seconds, right in your browser. No uploads required.',
    keywords: ['jpg to pdf', 'convert jpg to pdf', 'image to pdf', 'combine jpg', 'pdf converter', 'online tool', 'free converter', 'instant jpg to pdf'],
    path: '/tools/jpg-to-pdf',
});

export default function JpgToPdfLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'JPG to PDF Converter - Combine JPGs into One PDF Free Instantly',
    description: 'Combine multiple JPG images into a single, easy-to-share PDF file for free. Reorder images and convert them in seconds, right in your browser. No uploads required.',
    url: `${SITE_CONFIG.url}/tools/jpg-to-pdf`,
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
