import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Split PDF - Extract Pages from PDF',
    description: 'Split your PDF files into individual pages or specific page ranges. Extract pages easily, entirely in your browser.',
    keywords: ['split pdf', 'extract pdf pages', 'pdf splitter', 'cut pdf pages', 'free online pdf tools'],
    path: '/tools/split-pdf',
});

export default function SplitPDFLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Split PDF - Extract Pages from PDF',
    description: 'Split your PDF files into individual pages or specific page ranges. Extract pages easily, entirely in your browser.',
    url: `${SITE_CONFIG.url}/tools/split-pdf`,
  });
  return (
    <>
      <Script
        id="split-pdf-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
