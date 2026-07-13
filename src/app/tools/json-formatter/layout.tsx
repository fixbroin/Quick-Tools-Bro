import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online JSON Formatter & Validator',
    description: 'Format, pretty-print, minify, and validate JSON data online client-side. Fix lint issues and syntax errors instantly in your browser.',
    keywords: ['json formatter', 'json validator', 'format json online', 'minify json', 'free developer tool'],
    path: '/tools/json-formatter',
});

export default function JSONFormatterLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online JSON Formatter & Validator',
    description: 'Format, pretty-print, minify, and validate JSON data online client-side. Fix lint issues and syntax errors instantly in your browser.',
    url: `${SITE_CONFIG.url}/tools/json-formatter`,
  });
  return (
    <>
      <Script
        id="json-formatter-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
