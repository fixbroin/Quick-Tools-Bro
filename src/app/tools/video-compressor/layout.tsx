import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Video Compressor - Reduce Video File Size Online',
    description: 'Reduce the file size of your MP4, MOV, and other video files for free. Our online video compressor works in your browser to make files smaller without losing quality.',
    keywords: ['video compressor', 'compress video', 'reduce video size', 'video optimizer', 'compress mp4', 'online tool', 'free video compressor'],
    path: '/tools/video-compressor',
});

export default function VideoCompressorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Video Compressor - Reduce Video File Size Online',
    description: 'Reduce the file size of your MP4, MOV, and other video files for free. Our online video compressor works in your browser to make files smaller without losing quality.',
    url: `${SITE_CONFIG.url}/tools/video-compressor`,
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
