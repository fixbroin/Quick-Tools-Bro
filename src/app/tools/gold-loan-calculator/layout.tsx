import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Gold Loan Calculator - Estimate Your Loan Amount',
    description: 'Estimate the eligible loan amount you can get for your gold. Enter the weight, purity (karat), and current gold price to get an instant calculation with our free tool.',
    keywords: ['gold loan calculator', 'loan against gold', 'gold loan amount', 'finance calculator', 'gold price', 'ltv calculator', 'emi calculator'],
    alternates: {
        canonical: '/tools/gold-loan-calculator',
    }
}

export default function GoldLoanCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
