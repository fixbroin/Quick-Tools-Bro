import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online eSign PDF - Sign PDF Documents',
    description: 'Sign your PDF documents online client-side. Draw, type, or upload your signature and embed it securely onto any PDF page.',
    keywords: ['esign pdf', 'sign pdf online', 'electronic signature', 'signature maker', 'free pdf signer'],
    path: '/tools/esign-pdf',
});

export default function eSignPDFLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online eSign PDF - Sign PDF Documents',
    description: 'Sign your PDF documents online client-side. Draw, type, or upload your signature and embed it securely onto any PDF page.',
    url: `${SITE_CONFIG.url}/tools/esign-pdf`,
  });
  return (
    <>
      <Script
        id="esign-pdf-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
