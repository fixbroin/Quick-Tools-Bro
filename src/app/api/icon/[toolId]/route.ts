import { NextResponse } from 'next/server';
import { tools } from '@/lib/tools';

const CATEGORIES_COLOR_MAP = [
  {
    color: '#EAB308', // Gold
    tools: ['Gold Price and Weather', 'Currency Converter', 'Gold Loan Calculator', 'GST Calculator']
  },
  {
    color: '#0EA5E9', // Sky Blue
    tools: ['WhatsApp Quotes', 'Social Caption Generator', 'Social Bio Generator', 'Hashtag Generator']
  },
  {
    color: '#EF4444', // Red
    tools: ['JPG to PDF Converter', 'PDF to JPG Converter', 'Merge PDF', 'Split PDF', 'Compress PDF', 'PDF to Word Converter', 'Word to PDF Converter', 'Excel to PDF Converter', 'Presentation to PDF', 'OCR Text Extractor', 'eSign PDF', 'PDF Password Unlocker']
  },
  {
    color: '#06B6D4', // Cyan
    tools: ['JSON Formatter', 'Base64 Converter', 'URL Encoder & Decoder', 'Regex Tester', 'Color Picker', 'CSS Generator', 'HTML Formatter', 'Text Diff Checker', 'HTML Preview']
  },
  {
    color: '#10B981', // Emerald
    tools: ['GPA Calculator', 'Percentage Calculator', 'Attendance Calculator', 'Study Pomodoro Timer']
  },
  {
    color: '#3B82F6', // Blue
    tools: ['Image Compressor', 'Image Converter', 'Resize Image', 'Crop Image', 'Rotate Image', 'Flip Image', 'Color Picker', 'Image background Remover', 'Passport Photo Maker']
  },
  {
    color: '#F43F5E', // Rose
    tools: ['Email Writer', 'Resume Builder', 'Cover Letter Generator', 'AI Prompt Generator', 'Business Name Generator', 'Video Title Generator', 'YouTube Tag Generator', 'YouTube Thumbnail Downloader']
  }
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const { toolId } = await params;
  
  // Find the tool in our master list
  const tool = tools.find(t => t.href === `/tools/${toolId}`);
  
  if (!tool) {
    return new NextResponse('Tool not found', { status: 404 });
  }

  // Determine category color based on category map
  const category = CATEGORIES_COLOR_MAP.find(cat => cat.tools.includes(tool.name));
  const bgColor = category ? category.color : '#0EA5E9'; // Fallback to sky blue

  // Safely extract raw SVG node data from the Lucide Icon component definition
  // This bypasses the need for react-dom/server (which is prohibited in Next.js 15 SSR)
  const iconNode = (tool.Icon as any).iconNode;
  let innerPaths = '';

  if (Array.isArray(iconNode)) {
    innerPaths = iconNode
      .map(([tag, attrs]: [string, Record<string, string | number>]) => {
        const attrString = Object.entries(attrs)
          .map(([key, val]) => `${key}="${val}"`)
          .join(' ');
        return `<${tag} ${attrString} />`;
      })
      .join('\n    ');
  } else {
    // Fallback vector shape if iconNode is somehow missing
    innerPaths = `<circle cx="12" cy="12" r="10" />`;
  }

  // Wrap the inner paths inside a premium 512x512 app icon container
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="${bgColor}" />
  <g transform="translate(128, 128) scale(10.666)" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    ${innerPaths}
  </g>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
