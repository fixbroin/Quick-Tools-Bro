import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Refund Policy Generator - Create a Free Refund Policy',
    description: 'Create a clear and professional refund policy for your business. Answer a few questions to generate a custom policy in seconds for your products or services.',
    keywords: ['refund policy generator', 'legal document generator', 'free refund policy', 'ecommerce policy', 'return policy', 'business policy'],
    path: '/tools/refund-policy-generator',
});

export default function RefundPolicyGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Refund Policy Generator - Create a Free Refund Policy',
    description: 'Create a clear and professional refund policy for your business. Answer a few questions to generate a custom policy in seconds for your products or services.',
    url: `${SITE_CONFIG.url}/tools/refund-policy-generator`,
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
