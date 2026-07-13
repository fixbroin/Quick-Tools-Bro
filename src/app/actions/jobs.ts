'use server';

interface JobAlert {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

function parseRssFeed(xml: string): JobAlert[] {
  const items: JobAlert[] = [];
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

export async function fetchLiveJobAlerts() {
  try {
    // 1. Fetch live jobs alerts
    const jobsRes = await fetch(
      'https://news.google.com/rss/search?q=sarkari+naukri+recruitment+job&hl=en-IN&gl=IN&ceid=IN:en',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    const jobsXml = await jobsRes.text();
    const jobs = parseRssFeed(jobsXml).slice(0, 5);

    // 2. Fetch live board results alerts
    const examsRes = await fetch(
      'https://news.google.com/rss/search?q=board+exam+results+india&hl=en-IN&gl=IN&ceid=IN:en',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    const examsXml = await examsRes.text();
    const exams = parseRssFeed(examsXml).slice(0, 5);

    return {
      jobs,
      exams
    };
  } catch (err) {
    console.error('Error fetching live job/exam alerts:', err);
    return {
      jobs: [
        { title: 'RRB NTPC Recruitment 2026', link: 'https://news.google.com', source: 'Indian Railways', pubDate: '' },
        { title: 'SBI Probationary Officers (PO) Openings', link: 'https://news.google.com', source: 'State Bank of India', pubDate: '' }
      ],
      exams: [
        { title: 'CBSE Class 12th Board Results Live', link: 'https://news.google.com', source: 'CBSE News', pubDate: '' },
        { title: 'UGC NET June Exam Evaluation', link: 'https://news.google.com', source: 'UGC News', pubDate: '' }
      ]
    };
  }
}
