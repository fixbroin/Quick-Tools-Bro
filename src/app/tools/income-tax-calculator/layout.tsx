import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Income Tax Calculator - Old vs New Regime',
    description: 'Calculate and compare your income tax liability under the Old and New tax regimes client-side. Fast, safe, and completely free.',
    keywords: ['income tax calculator', 'old vs new tax regime', 'tax slab calculator', 'compare tax regime', 'free financial tool'],
    path: '/tools/income-tax-calculator',
});

export default function IncomeTaxCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Income Tax Calculator - Old vs New Regime',
    description: 'Calculate and compare your income tax liability under the Old and New tax regimes client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/income-tax-calculator`,
  });
  return (
    <>
      <Script
        id="income-tax-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
