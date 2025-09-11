import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Image Converter - Convert JPG to PNG & PNG to JPG Free',
    description: 'Easily convert images between JPG and PNG formats online for free. A simple, client-side tool for quick image format conversion without uploading files.',
    keywords: ['image converter', 'jpg to png', 'png to jpg', 'convert image format', 'online converter', 'free tool', 'image utility'],
    alternates: {
        canonical: '/tools/image-converter',
    }
}

export default function ImageConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
