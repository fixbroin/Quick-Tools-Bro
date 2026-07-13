import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Receipt Generator - Create Printable Receipts',
    description: 'Create professional business receipts and invoices online client-side. Fill out items, quantities, tax, and print or download as PDF.',
    keywords: ['receipt generator', 'create receipt online', 'printable invoice maker', 'sales receipt creator', 'free business tool'],
    path: '/tools/receipt-generator',
});

export default function ReceiptGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Receipt Generator - Create Printable Receipts',
    description: 'Create professional business receipts and invoices online client-side. Fill out items, quantities, tax, and print or download as PDF.',
    url: `${SITE_CONFIG.url}/tools/receipt-generator`,
  });
  return (
    <>
      <Script
        id="receipt-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
