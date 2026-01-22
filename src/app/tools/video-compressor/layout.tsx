
import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Free Video Compressor - Reduce Video File Size Online',
    description: 'Reduce the file size of your MP4, MOV, and other video files for free. Our online video compressor works in your browser to make files smaller without losing quality.',
    keywords: ['video compressor', 'compress video', 'reduce video size', 'video optimizer', 'compress mp4', 'online tool', 'free video compressor'],
    alternates: {
        canonical: '/tools/video-compressor',
    }
}

export default function VideoCompressorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
