import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const width = searchParams.get('width') || '1280';
  const height = searchParams.get('height') || '720';
  const isMobile = searchParams.get('isMobile') === 'true';
  const colorScheme = searchParams.get('colorScheme') || 'light';

  const scale = searchParams.get('scale') || '1';

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Basic URL normalization
  let normalizedUrl = url;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    // Construct Microlink screenshot URL
    const targetApiUrl = new URL('https://api.microlink.io');
    targetApiUrl.searchParams.append('url', normalizedUrl);
    targetApiUrl.searchParams.append('screenshot', 'true');
    targetApiUrl.searchParams.append('embed', 'screenshot.url');
    targetApiUrl.searchParams.append('viewport.width', width);
    targetApiUrl.searchParams.append('viewport.height', height);
    targetApiUrl.searchParams.append('viewport.deviceScaleFactor', scale);
    targetApiUrl.searchParams.append('viewport.isMobile', String(isMobile));
    targetApiUrl.searchParams.append('viewport.hasTouch', String(isMobile));
    targetApiUrl.searchParams.append('colorScheme', colorScheme);

    const res = await fetch(targetApiUrl.toString());
    if (!res.ok) {
      throw new Error(`Headless renderer returned status ${res.status}`);
    }

    const imageBuffer = await res.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24h
      },
    });
  } catch (error: any) {
    console.error('Screenshot proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to capture website screenshot' },
      { status: 500 }
    );
  }
}
