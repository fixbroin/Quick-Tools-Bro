'use server';

interface CouponAlert {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

function parseRssFeed(xml: string): CouponAlert[] {
  const items: CouponAlert[] = [];
  const rawItems = xml.split('<item>');
  rawItems.shift(); // Remove channel header

  for (const rawItem of rawItems) {
    const titleMatch = rawItem.match(/<title>(.*?)<\/title>/);
    const linkMatch = rawItem.match(/<link>(.*?)<\/link>/);
    const sourceMatch = rawItem.match(/<source[^>]*>(.*?)<\/source>/);
    const pubDateMatch = rawItem.match(/<pubDate>(.*?)<\/pubDate>/);

    if (titleMatch && linkMatch) {
      let title = titleMatch[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');

      const source = sourceMatch 
        ? sourceMatch[1].replace(/&amp;/g, '&').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') 
        : 'News Alert';

      // Strip source from title if duplicate (e.g. "Title - Source")
      if (source && title.toLowerCase().endsWith(` - ${source.toLowerCase()}`)) {
        title = title.substring(0, title.length - (source.length + 3)).trim();
      }

      items.push({
        title,
        link: linkMatch[1],
        source,
        pubDate: pubDateMatch ? pubDateMatch[1] : ''
      });
    }
  }
  return items;
}

export async function fetchLiveCouponsAndCourses() {
  try {
    // 1. Fetch free online courses with certificate news
    const coursesRes = await fetch(
      'https://news.google.com/rss/search?q=free+online+courses+with+certificates&hl=en-IN&gl=IN&ceid=IN:en',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    const coursesXml = await coursesRes.text();
    const courses = parseRssFeed(coursesXml).slice(0, 5);

    // 2. Fetch discount coupons / shopping deals news
    const couponsRes = await fetch(
      'https://news.google.com/rss/search?q=discount+coupon+promo+code+hostinger+udemy&hl=en-IN&gl=IN&ceid=IN:en',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    const couponsXml = await couponsRes.text();
    const coupons = parseRssFeed(couponsXml).slice(0, 5);

    return {
      courses,
      coupons
    };
  } catch (err) {
    console.error('Error fetching live coupons/courses:', err);
    return {
      courses: [
        { title: 'Google Python Crash Course - Free Coursera Audit', link: 'https://www.coursera.org', source: 'Coursera', pubDate: '' },
        { title: 'Responsive Web Design Certificate - 100% Free', link: 'https://www.freecodecamp.org', source: 'freeCodeCamp', pubDate: '' }
      ],
      coupons: [
        { title: 'Hostinger Shared Hosting Coupon: 10% Off code HOSTING2026', link: 'https://www.hostinger.in', source: 'Retail News', pubDate: '' },
        { title: 'Udemy Free Coupon Codes: 100% Off Tech Courses code UDEMYFREEJULY', link: 'https://www.udemy.com', source: 'Udemy News', pubDate: '' }
      ]
    };
  }
}
