import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Text-to-Speech Converter - Free Online TTS Read Aloud',
    description: 'Convert text to spoken audio online for free. Adjust speech rate, pitch, and choose from multiple voices. 100% private browser-based tool.',
    keywords: [
        'text to speech online', 'tts converter', 'convert text to speech', 'read text aloud',
        'free online text to speech', 'text to voice converter'
    ],
    path: '/tools/text-to-speech',
});

export default function TextToSpeechLayout({ children }: { children: React.ReactNode }) {
  return children;
}
