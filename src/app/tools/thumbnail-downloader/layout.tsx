import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online YouTube Thumbnail Downloader',
    description: 'Download high-quality YouTube thumbnails in HD, HQ, or SD resolution online client-side. Fast, safe, and completely free.',
    keywords: ['youtube thumbnail downloader', 'download youtube thumbnail', 'extract video thumbnail', 'youtube image grabber', 'free social tool'],
    path: '/tools/thumbnail-downloader',
});

export default function ThumbnailDownloaderLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online YouTube Thumbnail Downloader',
    description: 'Download high-quality YouTube thumbnails in HD, HQ, or SD resolution online client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/thumbnail-downloader`,
  });
  return (
    <>
      <Script
        id="thumbnail-downloader-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
