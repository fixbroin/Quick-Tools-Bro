
import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Merge PDF Files Online - Combine PDF for Free',
  description: 'Easily combine multiple PDF files into a single document. Safe, fast, and runs entirely in your browser without uploading your files.',
  keywords: ['merge pdf', 'combine pdf', 'join pdf', 'pdf merger online', 'free pdf tools', 'browser based pdf merger'],
  path: '/tools/merge-pdf',
});

export default function MergePDFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Merge PDF Online',
    description: 'A professional tool to combine multiple PDF documents into one single file.',
    url: `${SITE_CONFIG.url}/tools/merge-pdf`,
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
