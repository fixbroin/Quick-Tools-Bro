
import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Free Online Image Cropper - Crop Photos Easily',
    description: 'Crop your JPG, PNG, and other images online for free. Easily define a cropping area and download the result. Works entirely in your browser.',
    keywords: ['image cropper', 'crop image', 'photo cropper', 'online crop tool', 'free image editor', 'crop jpg', 'crop png'],
    alternates: {
        canonical: '/tools/image-cropper',
    }
}

export default function ImageCropperLayout({ children }: { children: React.ReactNode }) {
  return children;
}
