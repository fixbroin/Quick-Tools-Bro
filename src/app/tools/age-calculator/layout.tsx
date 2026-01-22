
import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: `Age Calculator - Calculate Your Age in Years, Months, and Days`,
    description: 'Find out your exact age in years, months, and days with our free online age calculator. Simply enter your date of birth for an instant and accurate calculation.',
    keywords: ['age calculator', 'date of birth calculator', 'how old am I', 'calculate age', 'birthday calculator', 'online tool'],
    alternates: {
        canonical: '/tools/age-calculator',
    }
}

export default function AgeCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
