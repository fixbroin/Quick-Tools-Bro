
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ProgressBar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { BottomNavBar } from '@/components/BottomNavBar';
import { InstallPWAButton } from '@/components/InstallPWAButton';
import { SITE_CONFIG, getMetadata } from '@/lib/config';
import { AD_CONFIG } from '@/lib/ad-config';
import { DownloadGateProvider } from '@/context/DownloadGateContext';

export const metadata: Metadata = {
  ...getMetadata(),
  applicationName: SITE_CONFIG.name,
  manifest: "/manifest.json",
  authors: [{ name: 'FixBro', url: 'https://fixbro.in' }],
  creator: 'FixBro',
  publisher: 'FixBro',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_CONFIG.name,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url,
    "description": SITE_CONFIG.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_CONFIG.url}/?s={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        {AD_CONFIG.enabled && AD_CONFIG.provider === 'adsense' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.adsensePubId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
            id="adsense-init"
          />
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `,
            }}
          />
        )}
      </head>
      <body className={cn('font-body antialiased')}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
          <DownloadGateProvider>
            <ProgressBar />
            <div className="flex min-h-screen flex-col pb-16 md:pb-0">
              <Header />
              <div className="container mx-auto flex justify-center py-1">
                  <InstallPWAButton />
              </div>
              <main className="flex-1">{children}</main>
              {/* Mobile-only premium signature attribution */}
              <div className="block md:hidden py-6 text-center text-xs text-muted-foreground border-t border-border/40 bg-card/50 backdrop-blur-sm">
                <p className="font-semibold">&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
                <p className="mt-1 flex items-center justify-center gap-1 font-medium">
                  <span>Made in India with</span>
                  <span className="text-red-500 animate-pulse">❤️</span>
                  <span>• A product of</span>
                  <a 
                    href="https://fixbro.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-bold text-primary hover:underline"
                  >
                    FixBro.in
                  </a>
                </p>
              </div>
              <div className="hidden md:block">
                <Footer />
              </div>
            </div>
            <BottomNavBar />
            <Toaster />
          </DownloadGateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
