import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online GST Invoice Maker - Generate Business Invoices',
    description: 'Create professional business invoices supporting CGST, SGST, and IGST tax splits client-side. Completely free, secure, and private.',
    keywords: ['gst invoice maker', 'generate invoice with gst', 'cgst sgst invoice generator', 'tax invoice creator', 'free business tool'],
    path: '/tools/gst-invoice',
});

export default function GSTInvoiceLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online GST Invoice Maker - Generate Business Invoices',
    description: 'Create professional business invoices supporting CGST, SGST, and IGST tax splits client-side. Completely free, secure, and private.',
    url: `${SITE_CONFIG.url}/tools/gst-invoice`,
  });
  return (
    <>
      <Script
        id="gst-invoice-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
