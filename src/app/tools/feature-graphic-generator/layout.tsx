import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Google Play Feature Graphic Generator - 1024x500',
    description: 'Design a custom 1024x500 feature graphic for your Google Play Store app listing. Easily customize text, logos, backgrounds, and more to create a professional banner.',
    keywords: ['feature graphic generator', 'google play store', 'app promotion', '1024x500 graphic', 'app marketing', 'play store banner', 'android developer tools'],
    alternates: {
        canonical: '/tools/feature-graphic-generator',
    }
}

export default function FeatureGraphicGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
