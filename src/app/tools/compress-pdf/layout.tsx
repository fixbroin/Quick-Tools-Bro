import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Compress PDF - Reduce PDF File Size',
    description: 'Compress your PDF files client-side without uploading them to any server. Shrink your PDF files while maintaining optimal quality.',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor', 'free pdf tools'],
    path: '/tools/compress-pdf',
});

export default function CompressPDFLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Compress PDF - Reduce PDF File Size',
    description: 'Compress your PDF files client-side without uploading them to any server. Shrink your PDF files while maintaining optimal quality.',
    url: `${SITE_CONFIG.url}/tools/compress-pdf`,
  });
  return (
    <>
      <Script
        id="compress-pdf-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
