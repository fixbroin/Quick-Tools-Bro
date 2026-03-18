import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Invoice Maker - Free Online Professional Invoice Generator',
    description: 'Create professional, GST-compliant invoices for your business for free. Customize, download as PDF, and manage your invoicing with ease. No registration required.',
    keywords: ['invoice maker', 'gst invoice generator', 'free invoice tool', 'billing software', 'business tools', 'create invoice', 'online invoice creator', 'professional invoices'],
    path: '/tools/invoice-maker',
});

export default function InvoiceMakerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Invoice Maker - Free Online Professional Invoice Generator',
    description: 'Create professional, GST-compliant invoices for your business for free. Customize, download as PDF, and manage your invoicing with ease. No registration required.',
    url: `${SITE_CONFIG.url}/tools/invoice-maker`,
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
