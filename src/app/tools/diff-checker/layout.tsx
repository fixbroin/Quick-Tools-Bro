import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Text Diff Checker - Compare Text & Code Online',
  description: 'Compare two pieces of text, code, or files side-by-side. Highlight additions, deletions, and differences instantly in your browser.',
  keywords: [
    'diff checker', 'text compare', 'compare text online', 'code diff', 'difference finder', 
    'file comparison', 'online diff tool', 'text difference highlight', 'side by side compare'
  ],
  path: '/tools/diff-checker',
});

export default function DiffCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Text Diff Checker - Compare Text & Code Online',
    description: 'Compare two pieces of text, code, or files side-by-side. Highlight additions, deletions, and differences instantly in your browser.',
    url: `${SITE_CONFIG.url}/tools/diff-checker`,
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
