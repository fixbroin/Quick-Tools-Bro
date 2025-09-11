import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Free Short Link Maker - Create Short URLs Instantly',
    description: 'Create short, shareable URLs from long links with our free and easy-to-use short link maker. Shorten any URL in seconds for social media, marketing, and more.',
    keywords: ['short link maker', 'url shortener', 'link shortener', 'custom url', 'free url shortener', 'tinyurl generator', 'online tool'],
    alternates: {
        canonical: '/tools/short-link-maker',
    }
}

export default function ShortLinkMakerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
