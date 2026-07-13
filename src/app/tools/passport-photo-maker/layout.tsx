import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Passport Photo Maker - Crop & Edit Photos',
    description: 'Create professional passport and visa photos online client-side. Adjust backgrounds, crop to official sizes (2x2 inch, 3.5x4.5cm), and download printing grids.',
    keywords: ['passport photo maker', 'visa photo online', 'crop passport photo', '2x2 photo generator', 'free image tool'],
    path: '/tools/passport-photo-maker',
});

export default function PassportPhotoLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Passport Photo Maker - Crop & Edit Photos',
    description: 'Create professional passport and visa photos online client-side. Adjust backgrounds, crop to official sizes (2x2 inch, 3.5x4.5cm), and download printing grids.',
    url: `${SITE_CONFIG.url}/tools/passport-photo-maker`,
  });
  return (
    <>
      <Script
        id="passport-photo-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
