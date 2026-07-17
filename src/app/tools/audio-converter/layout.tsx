import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Audio Converter - Convert MP3, WAV, AAC, M4A Online',
    description: 'Convert audio files between MP3, WAV, AAC, M4A, OGG, and FLAC formats online. 100% private, browser-based conversion.',
    keywords: [
        'audio converter', 'convert audio online', 'wav to mp3', 'mp3 to wav converter',
        'convert aac to mp3', 'free online audio format changer'
    ],
    path: '/tools/audio-converter',
});

export default function AudioConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
