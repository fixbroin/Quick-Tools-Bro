
import { Metadata } from 'next';

export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro',
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Quick Tools Bro - All-in-One Free Online Web Tools',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A comprehensive collection of free, high-performance, browser-based tools for image compression, PDF conversion, calculators, and more. No registration required.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://q.fixbro.in',
  image: process.env.NEXT_PUBLIC_SITE_IMAGE || '/android-chrome-512x512.png',
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@QuickToolsBro',
  themeColor: process.env.NEXT_PUBLIC_THEME_COLOR || "#29ABE2",
  gscId: process.env.NEXT_PUBLIC_GSC_VERIFICATION_ID || "",
};

export function getMetadata({
  title,
  description,
  keywords,
  path = '',
  image = SITE_CONFIG.image,
  type = 'website',
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: 'website' | 'article';
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.title;
  const fullDescription = description || SITE_CONFIG.description;
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: keywords || [
      'free online tools',
      'image compressor',
      'pdf converter',
      'bmi calculator',
      'qr code generator',
      'unit converter',
      'privacy policy generator',
      'whatsapp quotes',
      'quick tools',
      'browser based tools'
    ],
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: path || '/',
    },
    verification: {
        google: SITE_CONFIG.gscId,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      creator: SITE_CONFIG.twitterHandle,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
  };
}

export function getToolJsonLd({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "image": image || SITE_CONFIG.image,
    "applicationCategory": "Utility",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
        "@type": "Organization",
        "name": "FixBro",
        "url": "https://fixbro.in"
    }
  };
}
