import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'HTML Preview - Live HTML, CSS & JS Code Editor',
  description: 'Write, edit, and preview HTML, CSS, and Javascript code online in real-time. Load presets, toggle fullscreen view, and download outputs.',
  keywords: [
    'html preview', 'live html editor', 'online html preview', 'html css js editor', 
    'realtime html code preview', 'web preview tool', 'html viewer', 'live code preview'
  ],
  path: '/tools/html-preview',
});

export default function HtmlPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'HTML Preview - Live HTML, CSS & JS Code Editor',
    description: 'Write, edit, and preview HTML, CSS, and Javascript code online in real-time. Load presets, toggle fullscreen view, and download outputs.',
    url: `${SITE_CONFIG.url}/tools/html-preview`,
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
