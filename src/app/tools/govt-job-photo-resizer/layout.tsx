import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Govt Job Photo & Signature Resizer - Compress to 20KB & 50KB Online',
    description: 'Resize and compress passport size photos and signatures online to exactly 20KB, 50KB, or 100KB for Indian Government job portals like UPSC, SSC, IBPS, and State PSCs.',
    keywords: [
        'resize photo to 20kb', 'compress signature to 10kb', 'ssc photo resizer', 'upsc photo resizer',
        'govt job photo resizer', 'compress image to 50kb', 'ibps photo resize online', 'passport photo compressor to 20kb'
    ],
    path: '/tools/govt-job-photo-resizer',
});

export default function GovtJobPhotoResizerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
