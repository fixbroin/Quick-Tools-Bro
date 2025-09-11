import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Love Calculator - Check Compatibility Between Names',
    description: 'Calculate the love compatibility between two names with this fun tool. Find out your love percentage and see what the future holds!',
    keywords: ['love calculator', 'compatibility test', 'love percentage', 'name calculator', 'relationship tool', 'fun calculator', 'love meter'],
    alternates: {
        canonical: '/tools/love-calculator',
    }
}

export default function LoveCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
