import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Basic Video Editor - Trim, Crop & Mute Videos Online',
    description: 'Edit your video clips online. Trim length, crop to square or vertical aspect ratios, and mute audio. 100% private, browser-based video editor.',
    keywords: [
        'basic video editor', 'video editor online', 'trim video online', 'crop video online',
        'mute video', 'free browser-based video editor'
    ],
    path: '/tools/video-editor',
});

export default function VideoEditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
