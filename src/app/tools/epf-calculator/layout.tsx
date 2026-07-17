import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'EPF Calculator - Employee Provident Fund Calculator',
    description: 'Calculate your EPF corpus at retirement, monthly contributions (employee & employer), and accrued interest earnings online.',
    keywords: [
        'epf calculator', 'employee provident fund calculator', 'pf interest calculator', 'epf corpus calculator',
        'pf maturity calculator', 'calculate pf balance online', 'provident fund returns'
    ],
    path: '/tools/epf-calculator',
});

export default function EPFCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
