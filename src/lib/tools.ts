import {
  QrCode, ScanLine, Minimize, Replace, Expand, Smile, Image as ImageIcon,
  FileText, FileImage, Scale, Landmark, HeartPulse, PersonStanding, Banknote,
  Heart, Gem, Link as LinkIcon, Soup, Shield, FileType, LucideIcon, Video,
  RefreshCw, Undo, Youtube, Receipt, Quote, Crop, Cake, Wifi, Combine,
  Split, EyeOff, Droplet, RotateCw, Percent, Braces, Timer, StopCircle,
  FileEdit, Mail, Instagram, FileCode, Code, Palette, Calendar, GraduationCap,
  CloudSun, UserCheck, Hash, Link, Play, Key, Unlock, Music, Scissors, Sliders, Volume2
} from 'lucide-react';

export interface Tool {
    title: string;
    description: string;
    href: string;
    Icon: LucideIcon;
    name: string;
}

export const tools: Tool[] = [
  // Image Tools
  {
    title: 'Image Compressor',
    name: 'Image Compressor',
    description: 'Reduce the file size of your images.',
    href: '/tools/image-compressor',
    Icon: Minimize,
  },
  {
    title: 'Image Converter',
    name: 'Image Converter',
    description: 'Convert between various image formats.',
    href: '/tools/image-converter',
    Icon: Replace,
  },
  {
    title: 'Passport Photo Maker',
    name: 'Passport Photo Maker',
    description: 'Crop and resize photos to official passport sizes.',
    href: '/tools/passport-photo-maker',
    Icon: UserCheck,
  },
  {
    title: 'Image Resizer',
    name: 'Image Resizer',
    description: 'Change the dimensions of your images.',
    href: '/tools/image-resizer',
    Icon: Expand,
  },
  {
    title: 'Image Background Remover',
    name: 'Image Background Remover',
    description: 'Remove the background from any image automatically.',
    href: '/tools/image-background-remover',
    Icon: ImageIcon,
  },
  {
    title: 'Image Cropper',
    name: 'Image Cropper',
    description: 'Crop images to your desired dimensions.',
    href: '/tools/image-cropper',
    Icon: Crop,
  },
  {
    title: 'Favicon Converter',
    name: 'Favicon Converter',
    description: 'Create a favicon from an image, text, or emoji.',
    href: '/tools/favicon-generator',
    Icon: Smile,
  },
  {
    title: 'Feature Graphic Generator',
    name: 'Feature Graphic Generator',
    description: 'Create a Play Store feature graphic.',
    href: '/tools/feature-graphic-generator',
    Icon: ImageIcon,
  },

  {
    title: 'Blur Image',
    name: 'Blur Image',
    description: 'Blur sections or all of your images online.',
    href: '/tools/blur-image',
    Icon: EyeOff,
  },
  {
    title: 'Watermark Maker',
    name: 'Watermark Maker',
    description: 'Protect your creative images with custom overlays.',
    href: '/tools/watermark',
    Icon: Droplet,
  },
  {
    title: 'Rotate Image',
    name: 'Rotate Image',
    description: 'Rotate 90deg or flip your images horizontally.',
    href: '/tools/rotate-image',
    Icon: RotateCw,
  },

  // PDF Tools
  {
    title: 'JPG to PDF Converter',
    name: 'JPG to PDF Converter',
    description: 'Combine multiple JPG images into one PDF.',
    href: '/tools/jpg-to-pdf',
    Icon: FileImage,
  },
  {
    title: 'PDF to JPG Converter',
    name: 'PDF to JPG Converter',
    description: 'Convert each page of a PDF to JPG images.',
    href: '/tools/pdf-to-jpg',
    Icon: FileText,
  },
  {
    title: 'PDF Password Unlocker',
    name: 'PDF Password Unlocker',
    description: 'Remove password security from your encrypted PDF documents.',
    href: '/tools/password-unlocker',
    Icon: Unlock,
  },
  {
    title: 'Merge PDF',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one.',
    href: '/tools/merge-pdf',
    Icon: Combine,
  },
  {
    title: 'Split PDF',
    name: 'Split PDF',
    description: 'Extract specific pages or split PDF into pages.',
    href: '/tools/split-pdf',
    Icon: Split,
  },
  {
    title: 'Compress PDF',
    name: 'Compress PDF',
    description: 'Optimize and shrink the file size of PDFs.',
    href: '/tools/compress-pdf',
    Icon: Minimize,
  },
  {
    title: 'PDF to Word Converter',
    name: 'PDF to Word Converter',
    description: 'Extract editable text from PDFs as a Word doc.',
    href: '/tools/pdf-to-word',
    Icon: FileText,
  },
  {
    title: 'Word to PDF Converter',
    name: 'Word to PDF Converter',
    description: 'Convert text documents or docx into PDF files.',
    href: '/tools/word-to-pdf',
    Icon: FileText,
  },
  {
    title: 'Excel to PDF Converter',
    name: 'Excel to PDF Converter',
    description: 'Convert spreadsheet grids or CSVs into PDF tables.',
    href: '/tools/excel-to-pdf',
    Icon: Table,
  },
  {
    title: 'Presentation to PDF',
    name: 'Presentation to PDF',
    description: 'Compile slideshow images/docs into slide deck PDFs.',
    href: '/tools/ppt-to-pdf',
    Icon: FileImage,
  },
  {
    title: 'OCR Text Extractor',
    name: 'OCR Text Extractor',
    description: 'Extract editable text from screenshots or images.',
    href: '/tools/ocr',
    Icon: FileText,
  },
  {
    title: 'eSign PDF',
    name: 'eSign PDF',
    description: 'Draw signatures and stamp them onto PDF documents.',
    href: '/tools/esign-pdf',
    Icon: Edit3,
  },


  // Video Tools
  {
    title: 'Video Compressor',
    name: 'Video Compressor',
    description: 'Reduce the file size of your videos.',
    href: '/tools/video-compressor',
    Icon: Video,
  },

  // QR Code Tools
  {
    title: 'QR Code Generator',
    name: 'QR Code Generator',
    description: 'Create QR codes for text, URLs, and more.',
    href: '/tools/qr-generator',
    Icon: QrCode,
  },
  {
    title: 'QR Code Scanner',
    name: 'QR Code Scanner',
    description: 'Scan QR codes using your device camera.',
    href: '/tools/qr-scanner',
    Icon: ScanLine,
  },
  {
    title: 'WiFi QR Code Generator',
    name: 'WiFi QR Code Generator',
    description: 'Create a QR code to share your WiFi network easily.',
    href: '/tools/wifi-qr-generator',
    Icon: Wifi,
  },

  // Web & Utility Tools
  {
    title: 'Short Link Maker',
    name: 'Short Link Maker',
    description: 'Create a short, shareable URL from a long link.',
    href: '/tools/short-link-maker',
    Icon: LinkIcon,
  },
  {
    title: 'Unit Converter',
    name: 'Unit Converter',
    description: 'Convert between various units of measurement.',
    href: '/tools/unit-converter',
    Icon: Scale,
  },
  {
    title: 'Currency Converter',
    name: 'Currency Converter',
    description: 'Live exchange rates for all currencies.',
    href: '/tools/currency-converter',
    Icon: Landmark,
  },

  // Health & Lifestyle Calculators
  {
    title: 'BMI Calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index.',
    href: '/tools/bmi-calculator',
    Icon: PersonStanding,
  },
  {
    title: 'Calorie Calculator',
    name: 'Calorie Calculator',
    description: 'Estimate your daily calorie needs.',
    href: '/tools/calorie-calculator',
    Icon: HeartPulse,
  },
  {
    title: 'Food Calorie & Nutrition Calculator',
    name: 'Food Calorie & Nutrition Calculator',
    description: 'Calculate nutrition for various foods.',
    href: '/tools/food-calorie-calculator',
    Icon: Soup,
  },
  {
    title: 'Love Calculator',
    name: 'Love Calculator',
    description: 'A fun tool to calculate love compatibility.',
    href: '/tools/love-calculator',
    Icon: Heart,
  },
  {
    title: 'Age Calculator',
    name: 'Age Calculator',
    description: 'Calculate your age in years, months, and days.',
    href: '/tools/age-calculator',
    Icon: Cake,
  },

  // Financial Calculators
  {
    title: 'Loan EMI Calculator',
    name: 'Loan EMI Calculator',
    description: 'Calculate your Equated Monthly Installment.',
    href: '/tools/loan-emi-calculator',
    Icon: Banknote,
  },
  {
    title: 'Gold Loan Calculator',
    name: 'Gold Loan Calculator',
    description: 'Estimate your eligible gold loan amount.',
    href: '/tools/gold-loan-calculator',
    Icon: Gem,
  },
  {
    title: 'SIP Calculator',
    name: 'SIP Calculator',
    description: 'Estimate future returns on mutual fund SIP investments.',
    href: '/tools/sip-calculator',
    Icon: Landmark,
  },
  {
    title: 'GST Calculator',
    name: 'GST Calculator',
    description: 'Calculate inclusive/exclusive GST tax amounts.',
    href: '/tools/gst-calculator',
    Icon: Percent,
  },
  {
    title: 'Salary Calculator',
    name: 'Salary Calculator',
    description: 'Estimate your gross salary, net income, and deductions.',
    href: '/tools/salary-calculator',
    Icon: Banknote,
  },
  {
    title: 'Income Tax Calculator',
    name: 'Income Tax Calculator',
    description: 'Compare tax liabilities under Old vs New Regimes.',
    href: '/tools/income-tax-calculator',
    Icon: Percent,
  },

  // Legal Document Generators
  {
    title: 'Privacy Policy Generator',
    name: 'Privacy Policy Generator',
    description: 'Create a legally compliant privacy policy.',
    href: '/tools/privacy-policy-generator',
    Icon: Shield,
  },
  {
    title: 'Terms & Conditions Generator',
    name: 'Terms & Conditions Generator',
    description: 'Generate professional terms & conditions.',
    href: '/tools/terms-and-conditions-generator',
    Icon: FileType,
  },
  {
    title: 'Refund Policy Generator',
    name: 'Refund Policy Generator',
    description: 'Create a clear refund policy for your business.',
    href: '/tools/refund-policy-generator',
    Icon: RefreshCw,
  },
  {
    title: 'Return Policy Generator',
    name: 'Return Policy Generator',
    description: 'Generate a transparent return policy.',
    href: '/tools/return-policy-generator',
    Icon: Undo,
  },

  // Business & Billing
  {
    title: 'Quotation Maker',
    name: 'Quotation Maker',
    description: 'Create and send professional quotations.',
    href: '/tools/quotation-maker',
    Icon: FileText,
  },
  {
    title: 'Invoice Maker',
    name: 'Invoice Maker',
    description: 'Generate professional invoices easily.',
    href: '/tools/invoice-maker',
    Icon: Receipt,
  },
  {
    title: 'Receipt Generator',
    name: 'Receipt Generator',
    description: 'Create sales and donation receipt PDFs client-side.',
    href: '/tools/receipt-generator',
    Icon: Receipt,
  },
  {
    title: 'GST Invoice Maker',
    name: 'GST Invoice Maker',
    description: 'Generate CGST/SGST compliant tax invoices.',
    href: '/tools/gst-invoice',
    Icon: Receipt,
  },

  // Daily Tools
  {
    title: 'Barcode Generator',
    name: 'Barcode Generator',
    description: 'Create Code 39 barcodes and download PNGs.',
    href: '/tools/barcode-generator',
    Icon: ScanLine,
  },
  {
    title: 'Password Generator',
    name: 'Password Generator',
    description: 'Generate secure, cryptographically random keys.',
    href: '/tools/password-generator',
    Icon: Key,
  },
  {
    title: 'Username Generator',
    name: 'Username Generator',
    description: 'Mix adjectives and nouns for gaming/social tags.',
    href: '/tools/username-generator',
    Icon: Smile,
  },
  {
    title: 'UUID Generator',
    name: 'UUID Generator',
    description: 'Generate secure version 4 UUID tokens in bulk.',
    href: '/tools/uuid-generator',
    Icon: Braces,
  },
  {
    title: 'Random Number Generator',
    name: 'Random Number Generator',
    description: 'Generate list of unique random numbers in range.',
    href: '/tools/random-number',
    Icon: Hash,
  },
  {
    title: 'Countdown Timer',
    name: 'Countdown Timer',
    description: 'Circular ticking countdown timer with alarm sound.',
    href: '/tools/timer',
    Icon: Timer,
  },
  {
    title: 'Stopwatch',
    name: 'Stopwatch',
    description: 'Precision split lap timer with milliseconds.',
    href: '/tools/stopwatch',
    Icon: Timer,
  },
  {
    title: 'Notes Notepad',
    name: 'Notes Notepad',
    description: 'Take private browser notes with local storage auto-saving.',
    href: '/tools/notes',
    Icon: FileEdit,
  },

  // Content Generators
  {
    title: 'Email Writer',
    name: 'Email Writer',
    description: 'Draft structured emails with custom tones.',
    href: '/tools/email-writer',
    Icon: Mail,
  },
  {
    title: 'Social Caption Generator',
    name: 'Social Caption Generator',
    description: 'Create post captions for Instagram, X, or LinkedIn.',
    href: '/tools/caption-generator',
    Icon: Instagram,
  },
  {
    title: 'Resume Builder',
    name: 'Resume Builder',
    description: 'Compile single-page styled PDF resumes.',
    href: '/tools/resume-builder',
    Icon: FileText,
  },
  {
    title: 'Cover Letter Generator',
    name: 'Cover Letter Generator',
    description: 'Draft professional job application cover letters.',
    href: '/tools/cover-letter',
    Icon: FileText,
  },
  {
    title: 'AI Prompt Generator',
    name: 'AI Prompt Generator',
    description: 'Refine concepts into structured LLM prompts.',
    href: '/tools/prompt-generator',
    Icon: FileCode,
  },
  {
    title: 'Social Bio Generator',
    name: 'Social Bio Generator',
    description: 'Generate bio lines for social profiles.',
    href: '/tools/bio-generator',
    Icon: Smile,
  },
  {
    title: 'Business Name Generator',
    name: 'Business Name Generator',
    description: 'Generate modern name ideas from seed keywords.',
    href: '/tools/business-name-generator',
    Icon: Landmark,
  },
  {
    title: 'Video Title Generator',
    name: 'Video Title Generator',
    description: 'Generate click-worthy, viral topic titles.',
    href: '/tools/video-title-generator',
    Icon: Video,
  },
  {
    title: 'Hashtag Generator',
    name: 'Hashtag Generator',
    description: 'Generate trending hashtags from keyword feeds.',
    href: '/tools/hashtag-generator',
    Icon: Hash,
  },
  {
    title: 'YouTube Tag Generator',
    name: 'YouTube Tag Generator',
    description: 'Generate SEO meta tags for video descriptions.',
    href: '/tools/youtube-tag-generator',
    Icon: Youtube,
  },
  {
    title: 'YouTube Thumbnail Downloader',
    name: 'YouTube Thumbnail Downloader',
    description: 'Retrieve YouTube video thumbnails in multiple sizes.',
    href: '/tools/thumbnail-downloader',
    Icon: Youtube,
  },

  // Student Tools
  {
    title: 'GPA Calculator',
    name: 'GPA Calculator',
    description: 'Calculate semester GPA based on grade inputs.',
    href: '/tools/gpa-calculator',
    Icon: GraduationCap,
  },
  {
    title: 'Percentage Calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentage values, ratios, and differences.',
    href: '/tools/percentage-calculator',
    Icon: Percent,
  },
  {
    title: 'Attendance Calculator',
    name: 'Attendance Calculator',
    description: 'Calculate class ratio updates to meet goals.',
    href: '/tools/attendance-calculator',
    Icon: Calendar,
  },
  {
    title: 'Study Pomodoro Timer',
    name: 'Study Pomodoro Timer',
    description: 'Boost focus using structured study-rest Pomodoros.',
    href: '/tools/study-timer',
    Icon: Timer,
  },

  // Daily Updates
  {
    title: 'Gold Price and Weather',
    name: 'Gold Price and Weather',
    description: 'Check live gold rates today (24K & 22K), silver prices, and local weather updates.',
    href: '/tools/gold-price-and-weather',
    Icon: CloudSun,
  },

  // Developer Tools
  {
    title: 'JSON Formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, or minify JSON structures.',
    href: '/tools/json-formatter',
    Icon: Braces,
  },
  {
    title: 'Base64 Converter',
    name: 'Base64 Converter',
    description: 'Encode/decode text and file data to/from Base64.',
    href: '/tools/base64',
    Icon: Code,
  },
  {
    title: 'URL Encoder & Decoder',
    name: 'URL Encoder & Decoder',
    description: 'Encode or decode URL query strings safely.',
    href: '/tools/url-encode',
    Icon: Link,
  },
  {
    title: 'Regex Tester',
    name: 'Regex Tester',
    description: 'Validate regular expressions and capture groups.',
    href: '/tools/regex-tester',
    Icon: Code,
  },
  {
    title: 'Color Picker',
    name: 'Color Picker',
    description: 'Pick colors, convert values, and check WCAG contrast.',
    href: '/tools/color-picker',
    Icon: Palette,
  },
  {
    title: 'CSS Generator',
    name: 'CSS Generator',
    description: 'Visually generate shadows, borders, and gradients.',
    href: '/tools/css-generator',
    Icon: Code,
  },
  {
    title: 'HTML Formatter',
    name: 'HTML Formatter',
    description: 'Format, validate, or minify HTML markup.',
    href: '/tools/html-formatter',
    Icon: Code,
  },

  // WhatsApp Quotes
  {
    title: 'WhatsApp Quotes',
    name: 'WhatsApp Quotes',
    description: 'Find and share quotes for WhatsApp.',
    href: '/tools/whatsapp-quotes',
    Icon: Quote,
  },
  
  // New Indian High-Traffic Tools
  {
    title: 'Govt Job Photo & Signature Resizer',
    name: 'Govt Job Photo & Signature Resizer',
    description: 'Resize and compress photos to exactly 20KB or 50KB for government job portals (SSC, UPSC, Bank, etc.).',
    href: '/tools/govt-job-photo-resizer',
    Icon: ImageIcon,
  },
  {
    title: 'Sukanya Samriddhi Yojana (SSY) Calculator',
    name: 'Sukanya Samriddhi Yojana (SSY) Calculator',
    description: 'Calculate maturity amount and interest earned for Sukanya Samriddhi account contributions.',
    href: '/tools/ssy-calculator',
    Icon: Landmark,
  },
  {
    title: 'PPF Calculator',
    name: 'PPF Calculator',
    description: 'Calculate Public Provident Fund returns, interest earned, and maturity values online.',
    href: '/tools/ppf-calculator',
    Icon: Banknote,
  },
  {
    title: 'EPF Calculator',
    name: 'EPF Calculator',
    description: 'Calculate Employee Provident Fund retirement corpus and interest earnings.',
    href: '/tools/epf-calculator',
    Icon: Scale,
  },
  {
    title: 'Gratuity Calculator',
    name: 'Gratuity Calculator',
    description: 'Calculate your tax-free gratuity payout based on monthly salary and years of service.',
    href: '/tools/gratuity-calculator',
    Icon: Landmark,
  },
  {
    title: 'Video to MP3 Converter',
    name: 'Video to MP3 Converter',
    description: 'Extract audio from any video file and save it as high-quality MP3 format.',
    href: '/tools/video-to-mp3',
    Icon: Music,
  },
  {
    title: 'Video to GIF Converter',
    name: 'Video to GIF Converter',
    description: 'Convert short video clips into lightweight, animated GIF images online.',
    href: '/tools/video-to-gif',
    Icon: Video,
  },
  {
    title: 'Audio Cutter & Ringtone Maker',
    name: 'Audio Cutter & Ringtone Maker',
    description: 'Trim your songs, cut MP3/WAV files, and create custom ringtones online.',
    href: '/tools/audio-cutter',
    Icon: Scissors,
  },
  {
    title: 'Audio Converter',
    name: 'Audio Converter',
    description: 'Convert audio files between MP3, WAV, AAC, M4A, and OGG formats.',
    href: '/tools/audio-converter',
    Icon: RefreshCw,
  },
  {
    title: 'Basic Video Editor',
    name: 'Basic Video Editor',
    description: 'Trim, crop, and mute video clips online without uploading to any server.',
    href: '/tools/video-editor',
    Icon: Sliders,
  },
  {
    title: 'Text-to-Speech Converter',
    name: 'Text-to-Speech Converter',
    description: 'Convert text into spoken audio online. Select from multiple voices, adjust speech speed, and pitch.',
    href: '/tools/text-to-speech',
    Icon: Volume2,
  },
];
import { Edit3, Table } from 'lucide-react';
