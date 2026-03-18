
import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Free WiFi QR Code Generator - Share WiFi Easily',
  description: 'Generate a WiFi QR code to share your network without revealing your password. Supports WPA/WPA2, WEP, and Hidden networks.',
  keywords: ['wifi qr code', 'wifi generator', 'share wifi', 'qr code wifi password', 'wifi qr code generator', 'free online tools'],
  path: '/tools/wifi-qr-generator',
});

export default function WiFiQRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'WiFi QR Code Generator',
    description: 'A free tool to create QR codes for easy WiFi network sharing.',
    url: `${SITE_CONFIG.url}/tools/wifi-qr-generator`,
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
