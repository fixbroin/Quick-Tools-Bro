import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Video to MP3 Converter - Free Online Audio Extractor',
    description: 'Extract high-quality MP3 audio from any video file (MP4, MOV, WebM) online. 100% private, browser-based conversion.',
    keywords: [
        'video to mp3 converter', 'convert video to mp3 online', 'extract audio from video', 'mp4 to mp3 converter',
        'convert video to audio', 'free online audio extractor'
    ],
    path: '/tools/video-to-mp3',
});

export default function VideoToMP3Layout({ children }: { children: React.ReactNode }) {
  return children;
}
