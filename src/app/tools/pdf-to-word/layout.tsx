import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online PDF to Word Converter - Extract PDF Text',
    description: 'Convert PDF to Word document client-side. Extract editable text content from your PDF documents easily and completely free.',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to text', 'extract text from pdf', 'free online pdf tools'],
    path: '/tools/pdf-to-word',
});

export default function PDFToWordLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online PDF to Word Converter - Extract PDF Text',
    description: 'Convert PDF to Word document client-side. Extract editable text content from your PDF documents easily and completely free.',
    url: `${SITE_CONFIG.url}/tools/pdf-to-word`,
  });
  return (
    <>
      <Script
        id="pdf-to-word-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
