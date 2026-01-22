import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Free QR Code Generator - Create QR Codes for URLs, Text, UPI',
    description: 'Create custom QR codes for URLs, text, UPI payments, and more with our free online tool. Generate a downloadable and scannable QR code in seconds.',
    keywords: ['qr code generator', 'create qr code', 'free qr code', 'upi qr code generator', 'url to qr code', 'text to qr code', 'online tool'],
    alternates: {
        canonical: '/tools/qr-generator',
    }
}

export default function QrGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
