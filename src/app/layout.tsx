
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ProgressBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { BottomNavBar } from '@/components/BottomNavBar';
import { InstallPWAButton } from '@/components/InstallPWAButton';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';
const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE || `${siteName} - All-in-One File & Tool Hub`;
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A collection of free, browser-based tools.';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteImage = process.env.NEXT_PUBLIC_SITE_IMAGE || '/android-chrome-512x512.png';
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@Quick Tools Bro';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(','),
  applicationName: siteName,
  manifest: "/manifest.json",
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: siteName,
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    images: [
      {
        url: siteImage,
        width: 512,
        height: 512,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: twitterHandle,
    creator: twitterHandle,
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
     images: [siteImage],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: process.env.NEXT_PUBLIC_THEME_COLOR || "#29ABE2",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tb2fkr70df");
            `,
          }}
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
          <ProgressBar />
          <div className="flex min-h-screen flex-col pb-16 md:pb-0">
            <Header />
            <div className="container mx-auto flex justify-center py-4">
                <InstallPWAButton />
            </div>
            <main className="flex-1">{children}</main>
            <div className="hidden md:block">
              <Footer />
            </div>
          </div>
          <BottomNavBar />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
