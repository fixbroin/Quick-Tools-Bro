
import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'AI YouTube Thumbnail Maker - Create Custom Thumbnails',
    description: 'Design click-worthy YouTube thumbnails in minutes with our free online thumbnail maker. Customize templates, add text, images, and branding to boost your video views.',
    keywords: ['youtube thumbnail maker', 'thumbnail generator', 'free thumbnail creator', 'youtube tools', 'video thumbnail', 'creative tools', 'ai thumbnail maker'],
    alternates: {
        canonical: '/tools/youtube-thumbnail-maker',
    }
}

export default function YouTubeThumbnailMakerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
