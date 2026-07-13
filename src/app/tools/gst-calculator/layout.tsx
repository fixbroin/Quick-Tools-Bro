import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online GST Calculator - Add/Remove GST Tax',
    description: 'Calculate GST (Goods & Services Tax) online client-side. Add GST to prices, or calculate GST inclusive values with CGST, SGST & IGST breakdowns.',
    keywords: ['gst calculator', 'add gst online', 'remove gst calculator', 'cgst sgst calculator', 'free tax tool'],
    path: '/tools/gst-calculator',
});

export default function GSTCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online GST Calculator - Add/Remove GST Tax',
    description: 'Calculate GST (Goods & Services Tax) online client-side. Add GST to prices, or calculate GST inclusive values with CGST, SGST & IGST breakdowns.',
    url: `${SITE_CONFIG.url}/tools/gst-calculator`,
  });
  return (
    <>
      <Script
        id="gst-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
