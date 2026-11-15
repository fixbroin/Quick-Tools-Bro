import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'AI Video Watermark Remover - Remove Logos, Veo & Sora Watermarks Online',
    description: 'Erase unwanted watermarks, AI stamps (Google Veo, Sora), channel logos, and timestamps from video clips online. 100% private, in-browser processing without server upload.',
    keywords: [
        'video watermark remover', 'remove watermark from video', 'ai watermark remover',
        'google veo watermark remover', 'sora watermark remover', 'delogo video online',
        'remove logo from video free', 'video cleaner online', 'remove tiktok watermark'
    ],
    path: '/tools/video-watermark-remover',
});

export default function VideoWatermarkRemoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
