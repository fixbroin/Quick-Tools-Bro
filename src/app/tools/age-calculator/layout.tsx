import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Accurate Online Age Calculator - Find Your Exact Age',
  description: 'Calculate your exact age in years, months, days, hours, and minutes. Our free online age calculator is fast, accurate, and easy to use.',
  keywords: ['age calculator', 'calculate age', 'how old am I', 'date of birth calculator', 'exact age calculator', 'birthday calculator'],
  path: '/tools/age-calculator',
});

export default function AgeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Accurate Online Age Calculator - Find Your Exact Age',
    description: 'Calculate your exact age in years, months, days, hours, and minutes. Our free online age calculator is fast, accurate, and easy to use.',
    url: `${SITE_CONFIG.url}/tools/age-calculator`,
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
