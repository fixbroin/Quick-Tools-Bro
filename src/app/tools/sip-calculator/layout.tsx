import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online SIP Calculator - Calculate Mutual Fund Returns',
    description: 'Calculate future returns on your Mutual Fund Systematic Investment Plan (SIP). Analyze wealth accumulation, total investment and interest value client-side.',
    keywords: ['sip calculator', 'mutual fund returns', 'wealth calculator', 'sip returns calculator', 'free investment tool'],
    path: '/tools/sip-calculator',
});

export default function SIPCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online SIP Calculator - Calculate Mutual Fund Returns',
    description: 'Calculate future returns on your Mutual Fund Systematic Investment Plan (SIP). Analyze wealth accumulation, total investment and interest value client-side.',
    url: `${SITE_CONFIG.url}/tools/sip-calculator`,
  });
  return (
    <>
      <Script
        id="sip-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
