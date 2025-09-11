import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Free Image Compressor - Reduce JPG & PNG Size Online',
    description: 'Reduce the file size of your images online without losing quality. Compress JPG, PNG, and WebP files to a specific size or quality percentage with our free tool.',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'image optimizer', 'compress jpg', 'compress png', 'online tool'],
    alternates: {
        canonical: '/tools/image-compressor',
    }
}

export default function ImageCompressorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
