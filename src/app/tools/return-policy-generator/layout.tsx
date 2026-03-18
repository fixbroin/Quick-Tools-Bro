import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Return Policy Generator - Create a Free Return Policy',
    description: 'Generate a transparent return policy to protect your business and build customer trust. Essential for eCommerce and retail businesses.',
    keywords: ['return policy generator', 'legal document generator', 'free return policy', 'ecommerce policy', 'refund policy', 'business policy'],
    path: '/tools/return-policy-generator',
});

export default function ReturnPolicyGeneratorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Return Policy Generator - Create a Free Return Policy',
    description: 'Generate a transparent return policy to protect your business and build customer trust. Essential for eCommerce and retail businesses.',
    url: `${SITE_CONFIG.url}/tools/return-policy-generator`,
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
