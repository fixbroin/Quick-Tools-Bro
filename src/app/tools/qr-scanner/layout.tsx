import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Online QR Code Scanner - Scan QR Codes with Your Camera',
    description: 'Scan QR codes instantly using your device\'s camera. A fast, reliable, and easy-to-use online QR code reader that works directly in your browser.',
    keywords: ['qr code scanner', 'scan qr code', 'qr reader', 'online scanner', 'camera scanner', 'qr code tool', 'free scanner'],
    path: '/tools/qr-scanner',
});

export default function QrScannerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Online QR Code Scanner - Scan QR Codes with Your Camera',
    description: 'Scan QR codes instantly using your device\'s camera. A fast, reliable, and easy-to-use online QR code reader that works directly in your browser.',
    url: `${SITE_CONFIG.url}/tools/qr-scanner`,
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
