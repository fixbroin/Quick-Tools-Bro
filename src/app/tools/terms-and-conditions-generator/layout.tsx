import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Terms and Conditions Generator - Create Free T&Cs',
    description: 'Generate professional terms and conditions tailored for your website or app. Create a custom T&C document by answering a few simple questions.',
    keywords: ['terms and conditions generator', 'legal document generator', 'free terms and conditions', 't&c generator', 'website terms', 'app policy'],
    path: '/tools/terms-and-conditions-generator',
});

export default function TermsAndConditionsGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Terms and Conditions Generator - Create Free T&Cs',
    description: 'Generate professional terms and conditions tailored for your website or app. Create a custom T&C document by answering a few simple questions.',
    url: `${SITE_CONFIG.url}/tools/terms-and-conditions-generator`,
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
