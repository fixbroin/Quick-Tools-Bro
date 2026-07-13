import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Username Generator - Cool Gaming & Social Tags',
    description: 'Generate catchy, random usernames for games, social networks, or forums client-side. Completely free, customizable, and instant.',
    keywords: ['username generator', 'gamer tag generator', 'cool usernames', 'random handle creator', 'free daily tool'],
    path: '/tools/username-generator',
});

export default function UsernameGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Username Generator - Cool Gaming & Social Tags',
    description: 'Generate catchy, random usernames for games, social networks, or forums client-side. Completely free, customizable, and instant.',
    url: `${SITE_CONFIG.url}/tools/username-generator`,
  });
  return (
    <>
      <Script
        id="username-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
