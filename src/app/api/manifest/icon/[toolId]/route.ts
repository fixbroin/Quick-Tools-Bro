import { NextResponse } from 'next/server';
import { tools } from '@/lib/tools';

// Premium preset gradients
const GRADIENTS = [
  { from: '#2563eb', to: '#4f46e5' }, // Blue to Indigo (Developer)
  { from: '#059669', to: '#0d9488' }, // Emerald to Teal (Productivity)
  { from: '#ea580c', to: '#dc2626' }, // Orange to Red (PDF/Docs)
  { from: '#7c3aed', to: '#9333ea' }, // Violet to Purple (Image)
  { from: '#d97706', to: '#ea580c' }, // Amber to Orange (Finance)
  { from: '#e11d48', to: '#db2777' }, // Rose to Pink (Social)
];

// Helper to hash string to a stable index
function getGradientIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % GRADIENTS.length;
}

// Helper to extract tool initials
function getInitials(title: string): string {
  const words = title
    .replace(/to/i, '') // Remove helper prepositions
    .split(/\s+/)
    .filter(Boolean);
    
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  // Take first letter of first word and first letter of second word
  const first = words[0]?.[0] || '';
  const second = words[1]?.[0] || '';
  return (first + second).toUpperCase();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const { toolId } = await params;
  
  // Parse search params for maskable icon settings
  const { searchParams } = new URL(request.url);
  const isMaskable = searchParams.get('maskable') === 'true';

  // Find the tool
  const tool = tools.find(t => t.href === `/tools/${toolId}`);
  const title = tool?.title || 'UseBro';
  
  // Get stable colors and initials
  const gradient = GRADIENTS[getGradientIndex(title)];
  const initials = getInitials(title);

  // Responsive sizing for maskable launcher safe zones
  const fontSize = isMaskable ? '120' : '160';
  const strokeWidth = isMaskable ? '6' : '8';
  const innerCardOffset = isMaskable ? '80' : '64';
  const innerCardSize = isMaskable ? '352' : '384';
  const innerCardRx = isMaskable ? '80' : '96';

  // Render high-end dynamic SVG icon
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${gradient.from};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${gradient.to};stop-opacity:1" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.25"/>
      </filter>
    </defs>
    
    <!-- Icon Rounded Base -->
    <rect width="512" height="512" rx="128" fill="url(#grad)" />
    
    <!-- Inner border styling -->
    <rect x="${innerCardOffset}" y="${innerCardOffset}" width="${innerCardSize}" height="${innerCardSize}" rx="${innerCardRx}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="${strokeWidth}" />
    
    <!-- Floating Initials Typography -->
    <text 
      x="50%" 
      y="53%" 
      font-family="system-ui, -apple-system, sans-serif" 
      font-size="${fontSize}" 
      font-weight="900" 
      fill="#FFFFFF" 
      text-anchor="middle" 
      dominant-baseline="middle" 
      filter="url(#shadow)"
    >${initials}</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
