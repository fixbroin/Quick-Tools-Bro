'use client';
import { useState, useEffect } from 'react';
import { ToolCard } from '@/components/ToolCard';
import { tools } from '@/lib/tools';
import { Button } from '@/components/ui/button';
import { AdPlacement } from '@/components/AdPlacement';
import { HostingPromo } from '@/components/HostingPromo';

const toolCategories = [
  {
    name: 'Gold Price & Daily Finance',
    filterKey: 'finance',
    tools: ['Gold Price and Weather', 'Currency Converter', 'Gold Loan Calculator', 'GST Calculator']
      .map(name => tools.find(t => t.name === name))
      .filter((t): t is typeof tools[number] => !!t),
    color: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    name: 'WhatsApp Quotes & Social Tools',
    filterKey: 'utility',
    tools: ['WhatsApp Quotes', 'Social Caption Generator', 'Social Bio Generator', 'Hashtag Generator']
      .map(name => tools.find(t => t.name === name))
      .filter((t): t is typeof tools[number] => !!t),
    color: 'bg-sky-500/10 text-sky-500'
  },
  {
    name: 'PDF Tools',
    filterKey: 'document',
    tools: tools.filter(t => ['JPG to PDF Converter', 'PDF to JPG Converter', 'Merge PDF', 'Split PDF', 'Compress PDF', 'PDF to Word Converter', 'Word to PDF Converter', 'Excel to PDF Converter', 'Presentation to PDF', 'OCR Text Extractor', 'eSign PDF', 'PDF Password Unlocker'].includes(t.name)),
    color: 'bg-red-500/10 text-red-500'
  },
  {
    name: 'QR Code Tools',
    filterKey: 'utility',
    tools: tools.filter(t => ['QR Code Generator', 'QR Code Scanner', 'WiFi QR Code Generator'].includes(t.name)),
    color: 'bg-green-500/10 text-green-500'
  },
  {
    name: 'Image Tools',
    filterKey: 'image',
    tools: tools.filter(t => ['Image Compressor', 'Image Converter', 'Image Resizer', 'Image Background Remover', 'Image Cropper', 'Favicon Converter', 'Feature Graphic Generator', 'Passport Photo Maker', 'Blur Image', 'Watermark Maker', 'Rotate Image', 'Govt Job Photo & Signature Resizer'].includes(t.name)),
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    name: 'Video & Audio Tools',
    filterKey: 'image',
    tools: ['Video Compressor', 'Video to MP3 Converter', 'Video to GIF Converter', 'Audio Cutter & Ringtone Maker', 'Audio Converter', 'Basic Video Editor']
      .map(name => tools.find(t => t.name === name))
      .filter((t): t is typeof tools[number] => !!t),
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    name: 'Business Tools',
    filterKey: 'business',
    tools: tools.filter(t => ['Quotation Maker', 'Invoice Maker', 'Receipt Generator', 'GST Invoice Maker'].includes(t.name)),
    color: 'bg-orange-500/10 text-orange-500'
  },
  {
    name: 'Web & Utility Tools',
    filterKey: 'utility',
    tools: tools.filter(t => ['Short Link Maker', 'Unit Converter'].includes(t.name)),
    color: 'bg-indigo-500/10 text-indigo-500'
  },
  {
    name: 'Health & Lifestyle Calculators',
    filterKey: 'utility',
    tools: tools.filter(t => ['BMI Calculator', 'Calorie Calculator', 'Food Calorie & Nutrition Calculator', 'Love Calculator', 'Age Calculator'].includes(t.name)),
    color: 'bg-pink-500/10 text-pink-500'
  },
  {
    name: 'Financial Calculators',
    filterKey: 'finance',
    tools: tools.filter(t => ['Loan EMI Calculator', 'SIP Calculator', 'Salary Calculator', 'Income Tax Calculator', 'Sukanya Samriddhi Yojana (SSY) Calculator', 'PPF Calculator', 'EPF Calculator', 'Gratuity Calculator'].includes(t.name)),
    color: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    name: 'Legal Document Generators',
    filterKey: 'business',
    tools: tools.filter(t => ['Privacy Policy Generator', 'Terms & Conditions Generator', 'Refund Policy Generator', 'Return Policy Generator'].includes(t.name)),
    color: 'bg-gray-500/10 text-gray-500'
  },
  {
    name: 'Daily & Productivity',
    filterKey: 'utility',
    tools: tools.filter(t => ['Barcode Generator', 'Password Generator', 'Username Generator', 'UUID Generator', 'Random Number Generator', 'Countdown Timer', 'Stopwatch', 'Notes Notepad'].includes(t.name)),
    color: 'bg-teal-500/10 text-teal-500'
  },
  {
    name: 'Content & Marketing',
    filterKey: 'content',
    tools: tools.filter(t => ['Email Writer', 'Resume Builder', 'Cover Letter Generator', 'AI Prompt Generator', 'Business Name Generator', 'Video Title Generator', 'YouTube Tag Generator', 'YouTube Thumbnail Downloader'].includes(t.name)),
    color: 'bg-rose-500/10 text-rose-500'
  },
  {
    name: 'Student Tools',
    filterKey: 'student',
    tools: tools.filter(t => ['GPA Calculator', 'Percentage Calculator', 'Attendance Calculator', 'Study Pomodoro Timer'].includes(t.name)),
    color: 'bg-emerald-500/10 text-emerald-500'
  },
  {
    name: 'Developer Tools',
    filterKey: 'developer',
    tools: tools.filter(t => ['JSON Formatter', 'Base64 Converter', 'URL Encoder & Decoder', 'Regex Tester', 'Color Picker', 'CSS Generator', 'HTML Formatter'].includes(t.name)),
    color: 'bg-cyan-500/10 text-cyan-500'
  }
];

const FILTER_CHIPS = [
  { label: 'All Tools', value: 'all' },
  { label: '📄 PDF & Documents', value: 'document' },
  { label: '🖼 Image & Media', value: 'image' },
  { label: '💰 Finance & Taxes', value: 'finance' },
  { label: '🛠 Daily Utilities', value: 'utility' },
  { label: '🤖 Content & Writing', value: 'content' },
  { label: '👨💻 Developer Tools', value: 'developer' },
  { label: '🎓 Student Tools', value: 'student' },
  { label: '📊 Business & Legal', value: 'business' }
];

const BANNER_LINKS = [
  'https://play.google.com/store/apps/details?id=com.fixbro.invoicebro&hl=en_IN',
  'https://brobookme.com',
  'https://play.google.com/store/apps/details?id=com.fixbro.newtalent&hl=en_IN',
  'https://play.google.com/store/apps/details?id=com.fixbro.chat&hl=en_IN',
  'https://fixbro.in/referral',
  'https://fixbro.in'
];

export default function Home() {
  const [filter, setFilter] = useState('all');
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

  useEffect(() => {
    // 1. Restore scroll position
    const savedScrollY = sessionStorage.getItem('home-scroll-y');
    if (savedScrollY) {
      const scrollPos = parseInt(savedScrollY, 10);
      if (!isNaN(scrollPos) && scrollPos > 0) {
        const timer = setTimeout(() => {
          window.scrollTo({ top: scrollPos, behavior: 'instant' as ScrollBehavior });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    // 2. Track scroll position
    const handleScroll = () => {
      sessionStorage.setItem('home-scroll-y', String(window.scrollY));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const visibleCategories = toolCategories
    .map(category => ({
      ...category,
      tools: category.tools.filter(() => filter === 'all' || category.filterKey === filter)
    }))
    .filter(category => category.tools.length > 0);

  return (
    <div className="container mx-auto px-4 py-4 md:py-12">
      <header className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          {siteName}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Your all-in-one hub for quick file conversions, developer helpers, and productivity tools, running entirely in your browser.
        </p>
      </header>

      {/* Filter chips */}
      <div className="flex flex-row md:flex-wrap flex-nowrap justify-start md:justify-center gap-2 mb-10 pb-4 border-b overflow-x-auto md:overflow-x-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full px-2">
        {FILTER_CHIPS.map(chip => (
          <Button
            key={chip.value}
            variant={filter === chip.value ? 'default' : 'outline'}
            onClick={() => setFilter(chip.value)}
            className="rounded-full font-bold text-xs px-4 h-9 shrink-0"
          >
            {chip.label}
          </Button>
        ))}
      </div>

      <AdPlacement position="top" />

      <div className="space-y-12">
        {visibleCategories.map((category, index) => {
          const bannerIndex = index % BANNER_LINKS.length;
          const bannerLink = BANNER_LINKS[bannerIndex];
          return (
            <section key={category.name} className="animate-in fade-in duration-500 space-y-6">
              <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl mb-4">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => (
                  <ToolCard
                    key={tool.href}
                    title={tool.title}
                    description={tool.description}
                    href={tool.href}
                    Icon={tool.Icon}
                    color={category.color}
                  />
                ))}
              </div>
              
              {/* Category Promotion Banner */}
              {process.env.NEXT_PUBLIC_SHOW_BANNERS === 'true' && (
                <div className="relative w-full h-[180px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[450px] mt-6 rounded-2xl overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.005]">
                  {/* Ad Attribution Badge */}
                  <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[9px] font-black tracking-widest uppercase select-none pointer-events-none">
                    Ad
                  </span>
                  <a href={bannerLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    <img 
                      src={`/banners/${bannerIndex + 1}.png`} 
                      alt="FixBro Promotion" 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  </a>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <HostingPromo />

      <AdPlacement position="bottom" />
    </div>
  );
}
