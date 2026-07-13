import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Barcode Generator - Create Barcodes',
    description: 'Generate high-quality barcodes online client-side. Supports Code 128, EAN, UPC, and other standards. Download as SVG or PNG.',
    keywords: ['barcode generator', 'create barcode online', 'code 128 generator', 'ean barcode creator', 'free barcode tool'],
    path: '/tools/barcode-generator',
});

export default function BarcodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Barcode Generator - Create Barcodes',
    description: 'Generate high-quality barcodes online client-side. Supports Code 128, EAN, UPC, and other standards. Download as SVG or PNG.',
    url: `${SITE_CONFIG.url}/tools/barcode-generator`,
  });
  return (
    <>
      <Script
        id="barcode-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
