import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online OCR Text Extractor - Image to Text Converter',
    description: 'Convert images to text client-side. Extract editable text content from images, screenshots, or documents completely in your browser.',
    keywords: ['ocr online', 'image to text', 'extract text from image', 'ocr text extractor', 'free ocr tool'],
    path: '/tools/ocr',
});

export default function OCRLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online OCR Text Extractor - Image to Text Converter',
    description: 'Convert images to text client-side. Extract editable text content from images, screenshots, or documents completely in your browser.',
    url: `${SITE_CONFIG.url}/tools/ocr`,
  });
  return (
    <>
      <Script
        id="ocr-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
