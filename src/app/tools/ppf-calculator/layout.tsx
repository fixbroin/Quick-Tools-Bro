import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'PPF Calculator - Public Provident Fund Maturity Calculator',
    description: 'Calculate Public Provident Fund (PPF) interest, maturity amount, and yearly projections online for free.',
    keywords: [
        'ppf calculator', 'public provident fund calculator', 'ppf interest calculator', 'ppf maturity calculator',
        'ppf interest rate today', 'ppf investment calculator', 'ppf returns calculator'
    ],
    path: '/tools/ppf-calculator',
});

export default function PPFCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
