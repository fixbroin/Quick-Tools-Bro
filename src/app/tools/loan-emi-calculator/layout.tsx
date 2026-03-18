import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Loan EMI Calculator - Calculate Your Monthly Payments',
    description: 'Calculate your Equated Monthly Installment (EMI) for any loan. Enter the loan amount, interest rate, and tenure to see your monthly payments, total interest, and total payment.',
    keywords: ['loan emi calculator', 'emi calculator', 'loan calculator', 'mortgage calculator', 'personal loan emi', 'finance tool', 'online calculator'],
    path: '/tools/loan-emi-calculator',
});

export default function LoanEmiCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Loan EMI Calculator - Calculate Your Monthly Payments',
    description: 'Calculate your Equated Monthly Installment (EMI) for any loan. Enter the loan amount, interest rate, and tenure to see your monthly payments, total interest, and total payment.',
    url: `${SITE_CONFIG.url}/tools/loan-emi-calculator`,
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
