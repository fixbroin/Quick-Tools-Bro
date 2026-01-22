import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'JPG to PDF Converter - Combine JPGs into One PDF Free',
    description: 'Combine multiple JPG images into a single, easy-to-share PDF file for free. Reorder images and convert them in seconds, right in your browser.',
    keywords: ['jpg to pdf', 'convert jpg to pdf', 'image to pdf', 'combine jpg', 'pdf converter', 'online tool', 'free converter'],
    alternates: {
        canonical: '/tools/jpg-to-pdf',
    }
}

export default function JpgToPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
