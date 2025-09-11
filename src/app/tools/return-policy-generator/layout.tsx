import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Return Policy Generator - Create a Free Return Policy',
    description: 'Generate a transparent return policy to protect your business and build customer trust. Essential for eCommerce and retail businesses.',
    keywords: ['return policy generator', 'legal document generator', 'free return policy', 'ecommerce policy', 'refund policy', 'business policy'],
    alternates: {
        canonical: '/tools/return-policy-generator',
    }
}

export default function ReturnPolicyGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
