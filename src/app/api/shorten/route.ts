import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

// Generate a random alphanumeric string
function generateShortCode(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    // 1. Ensure DB table is initialized
    await initDb();

    // 2. Parse request body
    const body = await request.json();
    const { originalUrl, customAlias } = body;

    if (!originalUrl) {
      return NextResponse.json({ message: 'Original URL is required.' }, { status: 400 });
    }

    let shortCode = '';

    if (customAlias && customAlias.trim()) {
      const alias = customAlias.trim();
      // Validate characters to prevent injection/weird URLs
      if (!/^[a-zA-Z0-9-_]+$/.test(alias)) {
        return NextResponse.json({ message: 'Custom alias can only contain letters, numbers, hyphens, and underscores.' }, { status: 400 });
      }

      // Check if alias already exists
      const [existing]: any = await pool.query(
        'SELECT id FROM short_links WHERE short_code = ?',
        [alias]
      );

      if (existing && existing.length > 0) {
        return NextResponse.json({ message: 'Custom alias is already in use.' }, { status: 400 });
      }
      shortCode = alias;
    } else {
      // Generate a unique random code
      let isUnique = false;
      let retries = 0;
      while (!isUnique && retries < 5) {
        const code = generateShortCode();
        const [rows]: any = await pool.query(
          'SELECT id FROM short_links WHERE short_code = ?',
          [code]
        );
        if (rows.length === 0) {
          shortCode = code;
          isUnique = true;
        }
        retries++;
      }

      if (!isUnique) {
        return NextResponse.json({ message: 'Failed to generate a unique short code. Please try again.' }, { status: 500 });
      }
    }

    // 3. Insert into database
    await pool.query(
      'INSERT INTO short_links (original_url, short_code) VALUES (?, ?)',
      [originalUrl, shortCode]
    );

    // 4. Construct final shortened URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://usebro.in';
    const shortUrl = `${siteUrl}/${shortCode}`;

    return NextResponse.json({ shortUrl, shortCode }, { status: 200 });
  } catch (error: any) {
    console.error('Shorten API Error:', error);
    return NextResponse.json({ message: error.message || 'Server error occurred.' }, { status: 500 });
  }
}
