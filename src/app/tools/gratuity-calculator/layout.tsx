import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Gratuity Calculator - Free Gratuity Payout Calculator',
    description: 'Calculate your tax-free gratuity payout online based on the Payment of Gratuity Act 1972 guidelines.',
    keywords: [
        'gratuity calculator', 'calculate gratuity online', 'gratuity eligibility calculator', 'gratuity formula private sector',
        'pf and gratuity calculator', 'gratuity exemption limit 2026', 'how to calculate gratuity'
    ],
    path: '/tools/gratuity-calculator',
});

export default function GratuityCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
