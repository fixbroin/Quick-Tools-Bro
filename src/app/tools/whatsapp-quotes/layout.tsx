import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'WhatsApp Quotes - Find and Share Quotes',
    description: 'Find the perfect quote for your WhatsApp status. Browse through categories like motivational, funny, love, and more.',
    keywords: ['WhatsApp quotes', 'status quotes', 'inspirational quotes', 'love quotes', 'funny quotes', 'daily quotes'],
    path: '/tools/whatsapp-quotes',
});

export default function WhatsAppQuotesLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'WhatsApp Quotes - Find and Share Quotes',
    description: 'Find the perfect quote for your WhatsApp status. Browse through categories like motivational, funny, love, and more.',
    url: `${SITE_CONFIG.url}/tools/whatsapp-quotes`,
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
