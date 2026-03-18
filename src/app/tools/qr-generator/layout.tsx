import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free QR Code Generator - Create QR Codes for URLs, Text, UPI',
    description: 'Create custom QR codes for URLs, text, UPI payments, and more with our free online tool. Generate a downloadable and scannable QR code in seconds.',
    keywords: ['qr code generator', 'create qr code', 'free qr code', 'upi qr code generator', 'url to qr code', 'text to qr code', 'online tool'],
    path: '/tools/qr-generator',
});

export default function QrGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free QR Code Generator - Create QR Codes for URLs, Text, UPI',
    description: 'Create custom QR codes for URLs, text, UPI payments, and more with our free online tool. Generate a downloadable and scannable QR code in seconds.',
    url: `${SITE_CONFIG.url}/tools/qr-generator`,
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
