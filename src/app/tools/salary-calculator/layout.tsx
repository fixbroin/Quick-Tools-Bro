import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Salary Calculator - Take-Home Pay Estimator',
    description: 'Calculate gross salary, net salary, HRA, PF deductions, and monthly/annual take-home pay client-side. Fast, safe, and completely free.',
    keywords: ['salary calculator', 'take home pay calculator', 'net salary estimator', 'gross salary calculator', 'free financial calculator'],
    path: '/tools/salary-calculator',
});

export default function SalaryCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Salary Calculator - Take-Home Pay Estimator',
    description: 'Calculate gross salary, net salary, HRA, PF deductions, and monthly/annual take-home pay client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/salary-calculator`,
  });
  return (
    <>
      <Script
        id="salary-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
