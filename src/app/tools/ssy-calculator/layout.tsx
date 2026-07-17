import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Sukanya Samriddhi Yojana (SSY) Calculator - Free Tax Savings Tool',
    description: 'Calculate interest earned, annual contributions, and final maturity amount for Sukanya Samriddhi account deposits with yearly projections.',
    keywords: [
        'ssy calculator', 'sukanya samriddhi yojana calculator', 'ssy scheme calculator', 'sukanya calculator',
        'girl child savings scheme calculator', 'ssy compound interest calculator', 'ssy maturity value'
    ],
    path: '/tools/ssy-calculator',
});

export default function SSYCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
