import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online HTML Formatter & Minifier',
    description: 'Format, pretty-print, or minify HTML code online client-side. Make your markup clean and optimized instantly.',
    keywords: ['html formatter', 'html minifier', 'format html online', 'pretty print html', 'free developer tool'],
    path: '/tools/html-formatter',
});

export default function HTMLFormatterLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online HTML Formatter & Minifier',
    description: 'Format, pretty-print, or minify HTML code online client-side. Make your markup clean and optimized instantly.',
    url: `${SITE_CONFIG.url}/tools/html-formatter`,
  });
  return (
    <>
      <Script
        id="html-formatter-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
