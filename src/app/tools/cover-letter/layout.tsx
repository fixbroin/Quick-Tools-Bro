import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Cover Letter Generator - Professional Job Letters',
    description: 'Generate customized professional cover letters client-side. Fast, safe, and completely free.',
    keywords: ['cover letter generator', 'job application letter', 'write cover letter', 'resume cover letter', 'free career tool'],
    path: '/tools/cover-letter',
});

export default function CoverLetterLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Cover Letter Generator - Professional Job Letters',
    description: 'Generate customized professional cover letters client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/cover-letter`,
  });
  return (
    <>
      <Script
        id="cover-letter-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
