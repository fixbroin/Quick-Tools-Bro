import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Instant Currency Converter - Live Exchange Rates',
    description: 'Convert between major world currencies with our free currency converter. Get quick and simple exchange rate calculations for USD, EUR, INR, JPY, GBP, and more.',
    keywords: ['currency converter', 'exchange rates', 'money converter', 'forex calculator', 'USD to INR', 'EUR to USD', 'online converter'],
    alternates: {
        canonical: '/tools/currency-converter',
    }
}

export default function CurrencyConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
