import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Terms and Conditions Generator - Create Free T&Cs',
    description: 'Generate professional terms and conditions tailored for your website or app. Create a custom T&C document by answering a few simple questions.',
    keywords: ['terms and conditions generator', 'legal document generator', 'free terms and conditions', 't&c generator', 'website terms', 'app policy'],
    alternates: {
        canonical: '/tools/terms-and-conditions-generator',
    }
}

export default function TermsAndConditionsGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
