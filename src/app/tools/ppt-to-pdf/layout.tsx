import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Presentation (PPT) / Images to PDF Converter',
    description: 'Convert presentation slides, images, or files into landscape slide-deck PDF files. Private, fast, and completely free.',
    keywords: ['ppt to pdf', 'presentation to pdf', 'images to pdf slides', 'slides to pdf', 'pdf compiler'],
    path: '/tools/ppt-to-pdf',
});

export default function PPTToPDFLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Presentation (PPT) / Images to PDF Converter',
    description: 'Convert presentation slides, images, or files into landscape slide-deck PDF files. Private, fast, and completely free.',
    url: `${SITE_CONFIG.url}/tools/ppt-to-pdf`,
  });
  return (
    <>
      <Script
        id="ppt-to-pdf-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
