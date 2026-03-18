import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Gold Loan Calculator - Estimate Your Loan Amount Instantly',
    description: 'Estimate the eligible loan amount you can get for your gold. Enter the weight, purity (karat), and current gold price to get an instant calculation with our free tool.',
    keywords: ['gold loan calculator', 'loan against gold', 'gold loan amount', 'finance calculator', 'gold price', 'ltv calculator', 'emi calculator', 'gold loan eligibility'],
    path: '/tools/gold-loan-calculator',
});

export default function GoldLoanCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Gold Loan Calculator - Estimate Your Loan Amount Instantly',
    description: 'Estimate the eligible loan amount you can get for your gold. Enter the weight, purity (karat), and current gold price to get an instant calculation with our free tool.',
    url: `${SITE_CONFIG.url}/tools/gold-loan-calculator`,
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
