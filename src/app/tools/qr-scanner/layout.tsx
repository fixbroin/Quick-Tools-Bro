import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Online QR Code Scanner - Scan QR Codes with Your Camera',
    description: 'Scan QR codes instantly using your device\'s camera. A fast, reliable, and easy-to-use online QR code reader that works directly in your browser.',
    keywords: ['qr code scanner', 'scan qr code', 'qr reader', 'online scanner', 'camera scanner', 'qr code tool', 'free scanner'],
    alternates: {
        canonical: '/tools/qr-scanner',
    }
}

export default function QrScannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
