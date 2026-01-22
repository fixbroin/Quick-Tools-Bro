
import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Invoice Maker - Free Online Invoice Generator',
    description: 'Create professional, GST-compliant invoices for your business for free. Customize, download as PDF, and manage your invoicing with ease.',
    keywords: ['invoice maker', 'gst invoice generator', 'free invoice tool', 'billing software', 'business tools', 'create invoice'],
    alternates: {
        canonical: '/tools/invoice-maker',
    }
}

export default function InvoiceMakerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
