import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Refund Policy Generator - Create a Free Refund Policy',
    description: 'Create a clear and professional refund policy for your business. Answer a few questions to generate a custom policy in seconds for your products or services.',
    keywords: ['refund policy generator', 'legal document generator', 'free refund policy', 'ecommerce policy', 'return policy', 'business policy'],
    alternates: {
        canonical: '/tools/refund-policy-generator',
    }
}

export default function RefundPolicyGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
