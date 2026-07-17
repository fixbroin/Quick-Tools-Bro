import { Metadata } from 'next';
import { tools } from './tools';

export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'UseBro',
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'UseBro - Free Online Web Tools: PDF to JPG, Gold Price Today, Passport Photo Maker, Image Compressor',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'UseBro.in is a free all-in-one hub for online tools. Convert PDF to JPG (perfect for Aadhar cards), check live Gold prices today in India, crop passport size photos, and compress images online for free with 100% privacy.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://usebro.in',
  image: process.env.NEXT_PUBLIC_SITE_IMAGE || '/android-chrome-512x512.png',
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@UseBro',
  themeColor: process.env.NEXT_PUBLIC_THEME_COLOR || "#29ABE2",
  gscId: process.env.NEXT_PUBLIC_GSC_VERIFICATION_ID || "",
};

// Advanced SEO Engine to generate high-intent search queries that users type on Google
function getAdvancedSeoDetails(path: string, originalTitle?: string, originalDescription?: string, originalKeywords?: string[]) {
  const cleanPath = path.toLowerCase().replace(/\/$/, '');
  const slug = cleanPath.split('/').pop() || '';
  
  // Find tool in the registry
  const tool = tools.find(t => t.href.toLowerCase().replace(/\/$/, '') === cleanPath);
  const toolName = tool?.name || originalTitle || slug.replace(/-/g, ' ');
  
  let title = originalTitle || tool?.title || '';
  let description = originalDescription || tool?.description || '';
  let keywords = originalKeywords || [];

  // If the title is already customized and detailed (e.g. contains custom symbols or long phrases), preserve it
  const isCustomSpec = originalTitle && (originalTitle.includes(':') || originalTitle.includes('&') || originalTitle.split(' ').length > 4);
  if (isCustomSpec) {
    return {
      title,
      description,
      keywords: keywords.length > 0 ? keywords : [slug.replace(/-/g, ' '), 'free online tools', 'usebro']
    };
  }

  const nameLower = toolName.toLowerCase();

  if (nameLower.includes('video') || nameLower.includes('audio') || nameLower.includes('mp3') || nameLower.includes('gif')) {
    if (nameLower.includes('compress')) {
      title = `Free Online ${toolName} - Compress Video Size without Quality Loss`;
      description = `Reduce video file sizes (MP4, WebM, MOV) online for free. Compress to specific megabytes instantly inside your browser with 100% privacy.`;
      keywords = ['video compressor', 'compress video online', 'reduce mp4 size', 'compress video size', 'free online video compressor'];
    } else if (nameLower.includes('to mp3')) {
      title = `Video to MP3 Converter - Free Online Audio Extractor`;
      description = `Extract high-quality MP3 audio from any video file (MP4, WebM, MOV) online for free. 100% private, browser-based conversion.`;
      keywords = ['video to mp3', 'convert video to mp3', 'extract audio from video', 'mp4 to mp3 converter'];
    } else if (nameLower.includes('to gif')) {
      title = `Video to GIF Converter - Create Animated GIFs Online`;
      description = `Convert MP4, WebM, and MOV video clips into high-quality animated GIFs online for free. 100% private, browser-based maker.`;
      keywords = ['video to gif', 'convert video to gif', 'gif maker online', 'mp4 to gif converter'];
    } else if (nameLower.includes('cutter') || nameLower.includes('trim')) {
      title = `Audio Cutter & Ringtone Maker - Cut MP3 Online`;
      description = `Trim your songs, cut MP3/WAV files, and create custom ringtones online for free. 100% private, browser-based audio editor.`;
      keywords = ['audio cutter', 'mp3 cutter online', 'ringtone maker', 'trim song online', 'audio trimmer'];
    } else if (nameLower.includes('converter')) {
      title = `Audio Converter - Convert MP3, WAV, AAC, M4A Online`;
      description = `Convert audio files between MP3, WAV, AAC, M4A, OGG, and FLAC formats online for free. 100% private, browser-based conversion.`;
      keywords = ['audio converter', 'convert audio online', 'mp3 converter', 'wav to mp3', 'audio format changer'];
    } else if (nameLower.includes('editor')) {
      title = `Basic Video Editor - Trim, Crop & Mute Videos Online`;
      description = `Edit your video clips online. Trim length, crop to square or vertical aspect ratios, and mute audio. 100% private, browser-based video editor.`;
      keywords = ['video editor online', 'trim video online', 'crop video online', 'mute video', 'free basic video editor'];
    } else {
      title = `Free Online ${toolName} - Browser-Based Media Tool`;
      description = `Process and edit your video and audio files online for free. Fast, secure, and 100% local processing inside your browser.`;
      keywords = [nameLower, 'online media tool', 'free media converter', 'browser editor'];
    }
  }
  else if (nameLower.includes('compress')) {
    const isImg = nameLower.includes('image') || nameLower.includes('jpg') || nameLower.includes('png');
    const target = isImg ? 'images (JPG, PNG, WebP)' : nameLower.includes('pdf') ? 'PDF documents' : 'files';
    title = `Free Online ${toolName} - Reduce ${isImg ? 'Image' : 'PDF'} Size without Quality Loss`;
    description = `Compress ${target} online for free. Reduce file size to 20kb, 50kb, 100kb, or 200kb instantly without losing original quality. No registration or installation required.`;
    keywords = [
      `compress ${isImg ? 'image' : 'pdf'}`,
      `reduce ${isImg ? 'image' : 'pdf'} size`,
      `online ${nameLower}`,
      `free ${nameLower}`,
      `compress to 100kb`,
      `compress to 50kb`,
      `compress file size`
    ];
  } 
  else if (nameLower.includes('to') && (nameLower.includes('converter') || nameLower.includes('pdf') || nameLower.includes('word') || nameLower.includes('jpg') || nameLower.includes('excel') || nameLower.includes('ppt'))) {
    const parts = nameLower.split(' to ');
    const from = parts[0]?.toUpperCase() || 'File';
    const to = parts[1]?.replace(' converter', '').toUpperCase() || 'PDF';
    title = `Free Online ${from} to ${to} Converter - Convert ${from} to ${to} File`;
    description = `Convert ${from} to ${to} online for free. Fast, high-quality, and secure ${from} to ${to} document converter. No software installation or registration needed.`;
    keywords = [
      `${from.toLowerCase()} to ${to.toLowerCase()}`,
      `convert ${from.toLowerCase()} to ${to.toLowerCase()}`,
      `online ${from.toLowerCase()} to ${to.toLowerCase()}`,
      `free ${from.toLowerCase()} to ${to.toLowerCase()} converter`,
      `best online file converter`
    ];
  }
  else if (nameLower.includes('converter') || nameLower.includes('generator') || nameLower.includes('maker') || nameLower.includes('builder')) {
    if (nameLower.includes('qr code')) {
      title = `Free QR Code Generator Online - Create Custom QR Codes (WiFi, Text, URL)`;
      description = `Create custom QR codes online for free. Generate high-quality QR codes for URLs, WiFi passwords, text, and contact details with customized styles.`;
      keywords = ['qr code generator', 'create qr code', 'free qr generator', 'wifi qr code generator', 'custom qr code generator', 'scan qr code online'];
    } else if (nameLower.includes('passport')) {
      title = `Passport Photo Maker: Free Online Passport Size Photo Editor`;
      description = `Create official passport size photos online for free. Crop, resize, and align photos to standard passport and visa specifications for India, USA, and other countries.`;
      keywords = ['passport photo maker', 'passport size photo creator', 'passport size photo editor', 'crop passport photo online', 'free passport size photo maker'];
    } else if (nameLower.includes('invoice') || nameLower.includes('receipt') || nameLower.includes('quotation')) {
      title = `Free Online ${toolName} - Create PDF ${toolName.replace('Maker', 's').replace('Generator', 's')} Instantly`;
      description = `Create professional invoices, quotes, and receipts online for free. Customize layouts, add GST taxes, and download print-ready PDF files instantly.`;
      keywords = [nameLower, `create ${nameLower.replace(' maker', '')} online`, `free ${nameLower}`, `gst invoice maker`, `professional invoice generator`];
    } else if (nameLower.includes('policy') || nameLower.includes('terms') || nameLower.includes('refund')) {
      title = `Free ${toolName} - Generate Legal Document for Website`;
      description = `Generate custom ${toolName} document for your website or app. Completely free, compliant with GDPR, CCPA, and Google Adsense requirements in minutes.`;
      keywords = [nameLower, `generate ${nameLower}`, `free website legal generator`, `privacy policy generator`, `terms and conditions creator`];
    } else {
      title = `Free Online ${toolName} - Generate ${toolName.replace(' Generator', 's').replace(' Maker', 's')} Instantly`;
      description = `Generate custom ${toolName.replace(' Generator', 's').replace(' Maker', 's')} online for free. Easy to use, fast, secure, and optimized for instant downloads.`;
      keywords = [nameLower, `generate ${nameLower.replace(' generator', '')} online`, `free ${nameLower}`, `best ${nameLower}`];
    }
  }
  else if (nameLower.includes('calculator')) {
    if (nameLower.includes('gst')) {
      title = `GST Calculator India - Add or Remove GST (3%, 5%, 12%, 18%, 28%)`;
      description = `Calculate Goods and Services Tax (GST) online for free. Compute CGST, SGST, and IGST components or calculate GST inclusive/exclusive rates easily.`;
      keywords = ['gst calculator', 'gst calculator india', 'add gst', 'remove gst', 'gst inclusive exclusive calculator', 'calculate gst online'];
    } else if (nameLower.includes('emi') || nameLower.includes('loan')) {
      title = `Loan EMI Calculator - Calculate Home, Car & Personal Loan EMIs`;
      description = `Calculate your monthly loan EMIs (Equated Monthly Installments) online. Get a detailed amortization schedule table and interest breakdown for home, car, and personal loans.`;
      keywords = ['loan emi calculator', 'calculate emi online', 'home loan emi calculator', 'car loan calculator', 'personal loan emi calculator'];
    } else if (nameLower.includes('bmi')) {
      title = `Free BMI Calculator - Check Body Mass Index & Weight Status`;
      description = `Calculate your Body Mass Index (BMI) online. Support metric (kg/cm) and imperial (lbs/ft) inputs with instant WHO and Indian weight classification reports.`;
      keywords = ['bmi calculator', 'calculate body mass index', 'free bmi checker', 'weight classification calculator'];
    } else if (nameLower.includes('income tax') || nameLower.includes('salary')) {
      title = `Income Tax Calculator India - Calculate New & Old Tax Regime Liabilities`;
      description = `Calculate your income tax liability and compare old vs new tax regimes online for free. Enter salary details, deductions, and investments for instant breakdowns.`;
      keywords = ['income tax calculator', 'tax regime calculator', 'salary tax calculator', 'calculate income tax online', 'old vs new tax regime'];
    } else {
      title = `Free Online ${toolName} - Fast & Accurate Calculations`;
      description = `Calculate ${toolName.replace(' Calculator', '')} online for free. Get instant, accurate results based on official mathematical formulas and guidelines.`;
      keywords = [nameLower, `calculate ${nameLower.replace(' calculator', '')} online`, `free ${nameLower}`, `best ${nameLower}`];
    }
  }
  else if (nameLower.includes('timer') || nameLower.includes('stopwatch') || nameLower.includes('countdown')) {
    title = `Online ${toolName} - Free Full Screen Clock & Timer`;
    description = `Use our free full screen online ${nameLower}. Clean design, highly accurate, and optimized for study, work, or sports workouts.`;
    keywords = [nameLower, `online ${nameLower}`, `timer online`, `full screen stopwatch`];
  }
  else if (nameLower.includes('writer') || nameLower.includes('bio') || nameLower.includes('prompt') || nameLower.includes('resume') || nameLower.includes('caption')) {
    title = `AI ${toolName} - Free Online Writer & Generator`;
    description = `Generate high-quality ${toolName.replace(' Generator', 's').replace(' Writer', 's')} online for free. AI-powered tool to write optimized copy, captions, and bio descriptions in seconds.`;
    keywords = [nameLower, `ai ${nameLower}`, `free ${nameLower} online`, `generate copy with ai`];
  }
  else {
    title = `Free Online ${toolName} - Browser-Based Utility Tool`;
    description = `Use our free online ${nameLower} in your browser. Fast, secure, and 100% local processing without signups or installation.`;
    keywords = [nameLower, `online ${nameLower}`, `free ${nameLower}`, `browser tool ${nameLower}`];
  }

  if (keywords.length < 5) {
    keywords = [...keywords, 'free online tools', 'browser utilities', 'quick tools', 'usebro tools'];
  }

  return { title, description, keywords };
}

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
  // Apply advanced SEO query patterns for tool sub-pages dynamically
  let seoTitle = title;
  let seoDescription = description;
  let seoKeywords = keywords;

  if (path && path.startsWith('/tools/')) {
    const adv = getAdvancedSeoDetails(path, title, description, keywords);
    seoTitle = adv.title;
    seoDescription = adv.description;
    seoKeywords = adv.keywords;
  }

  const fullTitle = seoTitle ? `${seoTitle} | ${SITE_CONFIG.name}` : SITE_CONFIG.title;
  const fullDescription = seoDescription || SITE_CONFIG.description;
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: seoKeywords || [
      'free online tools',
      'pdf to jpg converter',
      'aadhar card pdf to jpg',
      'gold price today',
      'passport photo maker',
      'image compressor',
      'compress image online',
      'pdf to jpg free',
      'today gold rate',
      'passport size photo editor',
      'image compression',
      'quick tools',
      'online utilities',
      'gst calculator',
      'bmi calculator',
      'usebro tools'
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
        "name": "UseBro",
        "url": "https://usebro.in"
    }
  };
}
