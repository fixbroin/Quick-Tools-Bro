import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Favicon Generator - Create Favicons from Image, Text, or Emoji',
    description: 'Generate a complete set of favicons for your website instantly. Create a custom favicon from an image, text, or emoji for all platforms (iOS, Android, Desktop).',
    keywords: ['favicon generator', 'favicon creator', 'create favicon', 'ico generator', 'apple touch icon', 'favicon from image', 'favicon from text', 'emoji favicon'],
    alternates: {
        canonical: '/tools/favicon-generator',
    }
}

export default function FaviconGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
