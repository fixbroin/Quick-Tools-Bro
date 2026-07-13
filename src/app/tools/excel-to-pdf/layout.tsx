import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Excel / CSV to PDF Converter',
    description: 'Convert Excel tables or CSV files into formatted PDF tables client-side. Completely free, secure, and instant.',
    keywords: ['excel to pdf', 'csv to pdf', 'convert spreadsheet to pdf', 'table to pdf', 'pdf grid creator'],
    path: '/tools/excel-to-pdf',
});

export default function ExcelToPDFLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Excel / CSV to PDF Converter',
    description: 'Convert Excel tables or CSV files into formatted PDF tables client-side. Completely free, secure, and instant.',
    url: `${SITE_CONFIG.url}/tools/excel-to-pdf`,
  });
  return (
    <>
      <Script
        id="excel-to-pdf-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
