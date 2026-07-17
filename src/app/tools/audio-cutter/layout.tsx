import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Audio Cutter & Ringtone Maker - Cut MP3 Online',
    description: 'Trim your songs, cut MP3/WAV files, and create custom ringtones online for free. 100% private, browser-based editor.',
    keywords: [
        'audio cutter', 'ringtone maker', 'cut mp3 online', 'trim audio',
        'free online mp3 cutter', 'song editor online'
    ],
    path: '/tools/audio-cutter',
});

export default function AudioCutterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
