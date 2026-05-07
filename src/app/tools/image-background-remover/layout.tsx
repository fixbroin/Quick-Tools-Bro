import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Background Remover | Quick Tools Bro',
  description: 'Remove background from images (JPG, PNG, GIF) automatically and for free using our client-side AI tool. No upload to server, 100% private.',
  keywords: 'remove background, background remover, transparent image, png maker, ai background removal, client-side, free tool',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
