import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Percentage Calculator - Quick Math Solver',
    description: 'Solve percentage problems online client-side. Calculate percentage increases, fractions, and percentage differences instantly.',
    keywords: ['percentage calculator', 'calculate percentage online', 'percentage increase calculator', 'fractions to percentage', 'free daily tool'],
    path: '/tools/percentage-calculator',
});

export default function PercentageCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Percentage Calculator - Quick Math Solver',
    description: 'Solve percentage problems online client-side. Calculate percentage increases, fractions, and percentage differences instantly.',
    url: `${SITE_CONFIG.url}/tools/percentage-calculator`,
  });
  return (
    <>
      <Script
        id="percentage-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
