import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Website Screenshot Taker - Capture URL Screenshots Online',
  description: 'Capture high-resolution screenshots of any website URL online. Select desktop 16:9 or mobile portrait presets. Download clean PNGs with zero CORS blocks.',
  keywords: [
    'website screenshot taker', 'capture website online', 'url screenshot online', 
    'mobile screenshot emulator', '1280x720 screenshot', 'envato preview screenshot generator',
    'codecanyon screenshot generator', 'web screenshot tool'
  ],
  path: '/tools/website-screenshot',
});

export default function WebsiteScreenshotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Website Screenshot Taker - Capture URL Screenshots Online',
    description: 'Capture high-resolution screenshots of any website URL online. Select desktop 16:9 or mobile portrait presets. Download clean PNGs with zero CORS blocks.',
    url: `${SITE_CONFIG.url}/tools/website-screenshot`,
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
