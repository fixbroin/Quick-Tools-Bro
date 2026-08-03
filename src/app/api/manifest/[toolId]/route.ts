import { NextResponse } from 'next/server';
import { tools } from '@/lib/tools';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const { toolId } = await params;
  
  // Find the tool in our master tools list
  const tool = tools.find(t => t.href === `/tools/${toolId}`);
  
  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  // Generate dynamic manifest
  const manifest = {
    name: `${tool.title} App`,
    short_name: tool.title,
    description: tool.description,
    theme_color: "#29ABE2",
    background_color: "#f8fafc",
    display: "standalone",
    scope: `/tools/${toolId}`,
    start_url: `/tools/${toolId}`,
    id: `/tools/${toolId}`,
    icons: [
      {
        "src": `/api/icon/${toolId}`,
        "sizes": "192x192 512x512",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      }
    ]
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
