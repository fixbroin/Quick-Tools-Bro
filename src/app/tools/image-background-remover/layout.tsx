import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Background Remover Online - 100% Automatic & Private',
  description: 'Remove background from images (JPG, PNG, WebP) instantly for free. Our AI-powered tool runs 100% in your browser, ensuring your photos never leave your device. No registration required.',
  keywords: 'remove background online, free background remover, transparent background maker, automatic background removal, ai image editor, png transparency, private image editor',
  openGraph: {
    title: 'Free Image Background Remover Online - Quick Tools Bro',
    description: 'Remove background from any image automatically in seconds. 100% private and runs entirely in your browser.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Background Remover Online',
    description: 'Automatic AI background removal. Private and secure - your images never leave your computer.',
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
