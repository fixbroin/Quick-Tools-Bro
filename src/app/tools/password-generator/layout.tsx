import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Password Generator - Create Secure Passwords',
    description: 'Generate secure, random passwords client-side. Customize length, symbols, numbers, and test strength. 100% private, runs in-browser.',
    keywords: ['password generator', 'random password creator', 'secure password generator', 'strong password maker', 'free security tool'],
    path: '/tools/password-generator',
});

export default function PasswordGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Password Generator - Create Secure Passwords',
    description: 'Generate secure, random passwords client-side. Customize length, symbols, numbers, and test strength. 100% private, runs in-browser.',
    url: `${SITE_CONFIG.url}/tools/password-generator`,
  });
  return (
    <>
      <Script
        id="password-generator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
