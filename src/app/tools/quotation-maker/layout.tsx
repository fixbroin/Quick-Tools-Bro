import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Quotation Maker - Create Professional Quotations',
    description: 'Easily create and customize professional quotations for your clients. Add items, calculate totals, and generate a downloadable PDF in seconds.',
    keywords: ['quotation maker', 'quote generator', 'estimate maker', 'business tools', 'freelance tool', 'create quotation'],
    alternates: {
        canonical: '/tools/quotation-maker',
    }
}

export default function QuotationMakerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
