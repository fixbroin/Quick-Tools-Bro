import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Instant Currency Converter - Live Exchange Rates',
  description: 'Convert between major world currencies with our free currency converter. Get quick and simple exchange rate calculations for USD, EUR, INR, GBP, and more.',
  keywords: ['currency converter', 'exchange rates', 'money converter', 'forex calculator', 'USD to INR', 'EUR to USD', 'online converter', 'currency exchange'],
  path: '/tools/currency-converter',
});

export default function CurrencyConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Instant Currency Converter - Live Exchange Rates',
    description: 'Convert between major world currencies with our free currency converter. Get quick and simple exchange rate calculations for USD, EUR, INR, GBP, and more.',
    url: `${SITE_CONFIG.url}/tools/currency-converter`,
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
