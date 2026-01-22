import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Privacy Policy Generator - Create a Free Privacy Policy',
    description: 'Create a legally compliant privacy policy for your website, app, or business. Answer a few questions to generate a custom policy in seconds.',
    keywords: ['privacy policy generator', 'legal document generator', 'free privacy policy', 'gdpr generator', 'ccpa generator', 'website policy'],
    alternates: {
        canonical: '/tools/privacy-policy-generator',
    }
}

export default function PrivacyPolicyGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
