import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Random Number Generator',
    description: 'Generate lists of random numbers online client-side. Define ranges (min/max), quantity, allow/prevent duplicates, and sort numbers instantly.',
    keywords: ['random number generator', 'number picker', 'random integer generator', 'generate random numbers', 'free utility tool'],
    path: '/tools/random-number',
});

export default function RandomNumberLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Random Number Generator',
    description: 'Generate lists of random numbers online client-side. Define ranges (min/max), quantity, allow/prevent duplicates, and sort numbers instantly.',
    url: `${SITE_CONFIG.url}/tools/random-number`,
  });
  return (
    <>
      <Script
        id="random-number-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
