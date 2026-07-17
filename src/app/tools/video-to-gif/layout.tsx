import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Video to GIF Converter - Create Animated GIFs Online',
    description: 'Convert MP4, WebM, and MOV video clips into high-quality animated GIFs online. 100% private, browser-based conversion.',
    keywords: [
        'video to gif converter', 'convert video to gif online', 'mp4 to gif', 'create animated gif',
        'free online gif maker', 'browser-based gif converter'
    ],
    path: '/tools/video-to-gif',
});

export default function VideoToGIFLayout({ children }: { children: React.ReactNode }) {
  return children;
}
