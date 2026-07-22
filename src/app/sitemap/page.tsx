import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { tools } from '@/lib/tools';
import { SITE_CONFIG, getMetadata } from '@/lib/config';
import { Metadata } from 'next';
import { 
  FileText, Minimize, Replace, Expand, ImageIcon, Music, Video, Scissors, 
  RefreshCw, Landmark, Banknote, Scale, Percent, Calculator, GraduationCap 
} from 'lucide-react';

export const metadata: Metadata = getMetadata({
  title: 'HTML Sitemap - All Free Online Tools Catalog',
  description: 'Explore the full list of free browser-based online tools available on UseBro. PDF converters, image resizers, financial calculators, student tools, and developer utilities.',
  path: '/sitemap',
});

// We map category lists matching the categories on our homepage for crawl uniformity
const sitemapCategories = [
  {
    name: 'Gold Price & Daily Finance',
    tools: ['Gold Price and Weather', 'Currency Converter', 'Gold Loan Calculator', 'GST Calculator']
  },
  {
    name: 'WhatsApp Quotes & Social Tools',
    tools: ['WhatsApp Quotes', 'Social Caption Generator', 'Social Bio Generator', 'Hashtag Generator']
  },
  {
    name: 'PDF Tools',
    tools: ['JPG to PDF Converter', 'PDF to JPG Converter', 'Merge PDF', 'Split PDF', 'Compress PDF', 'PDF to Word Converter', 'Word to PDF Converter', 'Excel to PDF Converter', 'Presentation to PDF', 'OCR Text Extractor', 'eSign PDF', 'PDF Password Unlocker']
  },
  {
    name: 'QR Code Tools',
    tools: ['QR Code Generator', 'QR Code Scanner', 'WiFi QR Code Generator']
  },
  {
    name: 'Image Tools',
    tools: ['Image Compressor', 'Image Converter', 'Image Resizer', 'Image Background Remover', 'Image Cropper', 'Favicon Converter', 'Feature Graphic Generator', 'Passport Photo Maker', 'Blur Image', 'Watermark Maker', 'Rotate Image', 'Govt Job Photo & Signature Resizer']
  },
  {
    name: 'Video & Audio Tools',
    tools: ['Video Compressor', 'Video to MP3 Converter', 'Video to GIF Converter', 'Audio Cutter & Ringtone Maker', 'Audio Converter', 'Basic Video Editor', 'Text-to-Speech Converter']
  },
  {
    name: 'Business Tools',
    tools: ['Quotation Maker', 'Invoice Maker', 'Receipt Generator', 'GST Invoice Maker']
  },
  {
    name: 'Web & Utility Tools',
    tools: ['Short Link Maker', 'Unit Converter']
  },
  {
    name: 'Health & Lifestyle Calculators',
    tools: ['BMI Calculator', 'Calorie Calculator', 'Food Calorie & Nutrition Calculator', 'Love Calculator', 'Age Calculator']
  },
  {
    name: 'Financial Calculators',
    tools: ['Loan EMI Calculator', 'SIP Calculator', 'Salary Calculator', 'Income Tax Calculator', 'Sukanya Samriddhi Yojana (SSY) Calculator', 'PPF Calculator', 'EPF Calculator', 'Gratuity Calculator']
  },
  {
    name: 'Legal Document Generators',
    tools: ['Privacy Policy Generator', 'Terms & Conditions Generator', 'Refund Policy Generator', 'Return Policy Generator']
  },
  {
    name: 'Daily & Productivity',
    tools: ['Barcode Generator', 'Password Generator', 'Username Generator', 'UUID Generator', 'Random Number Generator', 'Countdown Timer', 'Stopwatch', 'Notes Notepad']
  },
  {
    name: 'Content & Marketing',
    tools: ['Email Writer', 'Resume Builder', 'Cover Letter Generator', 'AI Prompt Generator', 'Business Name Generator', 'Video Title Generator', 'YouTube Tag Generator', 'YouTube Thumbnail Downloader']
  },
  {
    name: 'Student Tools',
    tools: ['GPA Calculator', 'Percentage Calculator', 'Attendance Calculator', 'Study Pomodoro Timer']
  },
  {
    name: 'Developer Tools',
    tools: ['JSON Formatter', 'Base64 Converter', 'URL Encoder & Decoder', 'Regex Tester', 'Color Picker', 'CSS Generator', 'HTML Formatter']
  }
];

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 space-y-10 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight uppercase italic text-primary flex items-center justify-center gap-2">
          <FileText className="h-9 w-9 text-primary" /> UseBro HTML Sitemap
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          The complete inventory of all free client-side tools hosted on UseBro. Fully browse and access everything from conversion scripts to calculators directly below.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sitemapCategories.map((category) => {
          // Resolve actual tool models from tools list
          const resolvedTools = category.tools
            .map(name => tools.find(t => t.name === name))
            .filter((t): t is typeof tools[number] => !!t);

          return (
            <Card key={category.name} className="shadow-md hover:shadow-lg hover:border-primary/20 transition-all">
              <CardHeader className="bg-primary/5 border-b p-5">
                <CardTitle className="text-base font-extrabold tracking-wide text-foreground uppercase italic flex items-center gap-2">
                  {category.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {resolvedTools.length} tools available
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <ul className="space-y-2.5">
                  {resolvedTools.map((tool) => {
                    const Icon = tool.Icon || FileText;
                    return (
                      <li key={tool.href}>
                        <Link 
                          href={tool.href}
                          className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <div className="p-1.5 rounded bg-muted group-hover:bg-primary/10 transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-semibold leading-tight group-hover:underline underline-offset-2">
                            {tool.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Extra links mapping remaining orphan/static pages */}
      <Card className="shadow-md">
        <CardHeader className="bg-muted/40 border-b p-5">
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Website Pages</CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wide">
          <Link href="/" className="hover:text-primary transition-colors">Home Page</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
        </CardContent>
      </Card>

    </div>
  );
}
