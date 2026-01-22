import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Online Image Resizer - Resize Photos for Free',
    description: 'Resize your images to any dimension for free. Change the width and height of your photos online, with or without maintaining the aspect ratio. Simple and fast.',
    keywords: ['image resizer', 'resize image', 'photo resizer', 'change image size', 'online resizer', 'image dimensions', 'free tool'],
    alternates: {
        canonical: '/tools/image-resizer',
    }
}

export default function ImageResizerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
