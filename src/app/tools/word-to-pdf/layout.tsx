import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Word to PDF Converter - Create PDF from Text',
    description: 'Convert Word documents, text files, or pasted paragraphs into professional PDF files client-side. Fast, safe, and completely free.',
    keywords: ['word to pdf', 'convert docx to pdf', 'text to pdf', 'pdf creator', 'online pdf converter'],
    path: '/tools/word-to-pdf',
});

export default function WordToPDFLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Word to PDF Converter - Create PDF from Text',
    description: 'Convert Word documents, text files, or pasted paragraphs into professional PDF files client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/word-to-pdf`,
  });
  return (
    <>
      <Script
        id="word-to-pdf-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
