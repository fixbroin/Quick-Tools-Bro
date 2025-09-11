import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'PDF to JPG Converter - Convert PDF to High-Quality JPGs',
    description: 'Convert each page of a PDF document into separate, high-quality JPG images for free. A fast and secure online tool for all your PDF to JPG conversion needs.',
    keywords: ['pdf to jpg', 'convert pdf to jpg', 'pdf to image', 'pdf converter', 'online tool', 'free converter', 'document conversion'],
    alternates: {
        canonical: '/tools/pdf-to-jpg',
    }
}

export default function PdfToJpgLayout({ children }: { children: React.ReactNode }) {
  return children;
}
