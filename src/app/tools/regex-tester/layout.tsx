import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Regex Tester & Regex Checker',
    description: 'Test and check regular expressions online client-side. Live highlight matching expressions, capture groups, and set flags (g, i, m).',
    keywords: ['regex tester', 'regular expression checker', 'regex evaluator', 'check regex pattern', 'free developer tool'],
    path: '/tools/regex-tester',
});

export default function RegexTesterLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Regex Tester & Regex Checker',
    description: 'Test and check regular expressions online client-side. Live highlight matching expressions, capture groups, and set flags (g, i, m).',
    url: `${SITE_CONFIG.url}/tools/regex-tester`,
  });
  return (
    <>
      <Script
        id="regex-tester-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
