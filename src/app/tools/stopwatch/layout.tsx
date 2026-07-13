import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Stopwatch - Precision Lap Timer',
    description: 'Track time with millisecond precision online client-side. Set laps, view differentials, and analyze time splits completely in your browser.',
    keywords: ['stopwatch online', 'precision lap timer', 'split timer', 'millisecond stopwatch', 'free daily tool'],
    path: '/tools/stopwatch',
});

export default function StopwatchLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Stopwatch - Precision Lap Timer',
    description: 'Track time with millisecond precision online client-side. Set laps, view differentials, and analyze time splits completely in your browser.',
    url: `${SITE_CONFIG.url}/tools/stopwatch`,
  });
  return (
    <>
      <Script
        id="stopwatch-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
