
import { QrCode, ScanLine, Minimize, Replace, Expand, Smile, Image as ImageIcon, FileText, FileImage, Scale, Landmark, HeartPulse, PersonStanding, Banknote, Heart, Gem, Link as LinkIcon, Soup, Shield, FileType, LucideIcon, Video, RefreshCw, Undo, Youtube, Receipt, Quote, Crop, Cake } from 'lucide-react';

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
    title: 'Image Resizer',
    name: 'Image Resizer',
    description: 'Change the dimensions of your images.',
    href: '/tools/image-resizer',
    Icon: Expand,
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
   // Business Tools
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
    title: 'WhatsApp Quotes',
    name: 'WhatsApp Quotes',
    description: 'Find and share quotes for WhatsApp.',
    href: '/tools/whatsapp-quotes',
    Icon: Quote,
  },
];
