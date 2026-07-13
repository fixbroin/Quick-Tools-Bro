import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Email Writer - Custom Tone Email Maker',
    description: 'Draft professional, casual, request, or apology emails online client-side. Fast, safe, and completely free.',
    keywords: ['email writer', 'write email online', 'email templates', 'professional email maker', 'free marketing tool'],
    path: '/tools/email-writer',
});

export default function EmailWriterLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Email Writer - Custom Tone Email Maker',
    description: 'Draft professional, casual, request, or apology emails online client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/email-writer`,
  });
  return (
    <>
      <Script
        id="email-writer-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
