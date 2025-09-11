import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Loan EMI Calculator - Calculate Your Monthly Payments',
    description: 'Calculate your Equated Monthly Installment (EMI) for any loan. Enter the loan amount, interest rate, and tenure to see your monthly payments, total interest, and total payment.',
    keywords: ['loan emi calculator', 'emi calculator', 'loan calculator', 'mortgage calculator', 'personal loan emi', 'finance tool', 'online calculator'],
    alternates: {
        canonical: '/tools/loan-emi-calculator',
    }
}

export default function LoanEmiCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
