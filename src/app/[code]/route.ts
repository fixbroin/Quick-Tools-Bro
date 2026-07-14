import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Ensure DB table is initialized
    await initDb();

    // Extract the dynamic parameter
    const { code } = await params;

    if (!code) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Lookup original URL in the database
    const [rows]: any = await pool.query(
      'SELECT original_url, clicks FROM short_links WHERE short_code = ?',
      [code]
    );

    if (rows && rows.length > 0) {
      const originalUrl = rows[0].original_url;
      const currentClicks = rows[0].clicks || 0;

      // Asynchronously increment click count
      pool.query(
        'UPDATE short_links SET clicks = ? WHERE short_code = ?',
        [currentClicks + 1, code]
      ).catch(e => console.error('Failed to update click count:', e));

      // Handle missing protocol (e.g. google.com -> https://google.com)
      let destinationUrl = originalUrl.trim();
      if (!/^https?:\/\//i.test(destinationUrl)) {
        destinationUrl = `https://${destinationUrl}`;
      }

      // Redirect to the original URL
      try {
        return NextResponse.redirect(new URL(destinationUrl));
      } catch (err) {
        console.error('Invalid redirect URL construction:', err);
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Code not found: redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('URL Redirect Handler Error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
