import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Quotation Maker - Create Professional Quotations',
    description: 'Easily create and customize professional quotations for your clients. Add items, calculate totals, and generate a downloadable PDF in seconds.',
    keywords: ['quotation maker', 'quote generator', 'estimate maker', 'business tools', 'freelance tool', 'create quotation'],
    path: '/tools/quotation-maker',
});

export default function QuotationMakerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Quotation Maker - Create Professional Quotations',
    description: 'Easily create and customize professional quotations for your clients. Add items, calculate totals, and generate a downloadable PDF in seconds.',
    url: `${SITE_CONFIG.url}/tools/quotation-maker`,
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
