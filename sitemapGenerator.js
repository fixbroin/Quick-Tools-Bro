
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const pages = [
  '/',
  '/contact',
  '/privacy',
  '/terms',
  '/tools/age-calculator',
  '/tools/bmi-calculator',
  '/tools/calorie-calculator',
  '/tools/currency-converter',
  '/tools/favicon-generator',
  '/tools/feature-graphic-generator',
  '/tools/food-calorie-calculator',
  '/tools/gold-loan-calculator',
  '/tools/image-compressor',
  '/tools/image-converter',
  '/tools/image-cropper',
  '/tools/image-resizer',
  '/tools/invoice-maker',
  '/tools/jpg-to-pdf',
  '/tools/loan-emi-calculator',
  '/tools/love-calculator',
  '/tools/pdf-to-jpg',
  '/tools/privacy-policy-generator',
  '/tools/qr-generator',
  '/tools/qr-scanner',
  '/tools/quotation-maker',
  '/tools/refund-policy-generator',
  '/tools/return-policy-generator',
  '/tools/short-link-maker',
  '/tools/terms-and-conditions-generator',
  '/tools/unit-converter',
  '/tools/video-compressor',
  '/tools/whatsapp-quotes',
  '/tools/split-pdf',
  '/tools/compress-pdf',
  '/tools/pdf-to-word',
  '/tools/word-to-pdf',
  '/tools/excel-to-pdf',
  '/tools/ppt-to-pdf',
  '/tools/ocr',
  '/tools/esign-pdf',
  '/tools/passport-photo-maker',
  '/tools/blur-image',
  '/tools/watermark',
  '/tools/rotate-image',
  '/tools/sip-calculator',
  '/tools/gst-calculator',
  '/tools/salary-calculator',
  '/tools/income-tax-calculator',
  '/tools/barcode-generator',
  '/tools/password-generator',
  '/tools/username-generator',
  '/tools/uuid-generator',
  '/tools/random-number',
  '/tools/timer',
  '/tools/stopwatch',
  '/tools/notes',
  '/tools/email-writer',
  '/tools/caption-generator',
  '/tools/cover-letter',
  '/tools/prompt-generator',
  '/tools/bio-generator',
  '/tools/business-name-generator',
  '/tools/video-title-generator',
  '/tools/hashtag-generator',
  '/tools/youtube-tag-generator',
  '/tools/thumbnail-downloader',
  '/tools/receipt-generator',
  '/tools/gst-invoice',
  '/tools/gpa-calculator',
  '/tools/percentage-calculator',
  '/tools/attendance-calculator',
  '/tools/study-timer',
  '/tools/daily-features',
  '/tools/json-formatter',
  '/tools/base64',
  '/tools/url-encode',
  '/tools/regex-tester',
  '/tools/color-picker',
  '/tools/css-generator',
  '/tools/html-formatter',
  '/tools/image-background-remover',
  '/tools/merge-pdf',
  '/tools/resume-builder',
  '/tools/wifi-qr-generator',
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      const path = page === '/' ? '' : page;
      return `
    <url>
        <loc>${`${siteUrl}${path}`}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

fs.writeFileSync(path.resolve(__dirname, 'public', 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully!');
