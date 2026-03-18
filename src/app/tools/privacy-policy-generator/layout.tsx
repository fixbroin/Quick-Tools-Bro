import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Privacy Policy Generator - Create a Free Privacy Policy',
    description: 'Create a legally compliant privacy policy for your website, app, or business. Answer a few questions to generate a custom policy in seconds.',
    keywords: ['privacy policy generator', 'legal document generator', 'free privacy policy', 'gdpr generator', 'ccpa generator', 'website policy'],
    path: '/tools/privacy-policy-generator',
});

export default function PrivacyPolicyGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Privacy Policy Generator - Create a Free Privacy Policy',
    description: 'Create a legally compliant privacy policy for your website, app, or business. Answer a few questions to generate a custom policy in seconds.',
    url: `${SITE_CONFIG.url}/tools/privacy-policy-generator`,
  });
  return (
    <>
      <Script
        id="tool-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
