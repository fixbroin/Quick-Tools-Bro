export interface SeoEntry {
  title: string;
  description: string;
  guideTitle: string;
  steps: string[];
  faqs: { question: string; answer: string }[];
}

export const SEO_MAP: Record<string, SeoEntry> = {
  '/tools/image-compressor': {
    title: 'Free Online Image Compressor - Compress JPEG & PNG in India',
    description: 'Compress images online without losing quality. Reduce size of JPG, PNG, and WebP files instantly for free. Perfect for government forms, SBI uploads, and website speed optimization.',
    guideTitle: 'How to Compress Images Online for Free',
    steps: [
      'Click the upload area to select your JPEG, PNG, or WebP image.',
      'Choose between Quality mode (recommended) or specify a Target File Size in MB/KB.',
      'Adjust the quality slider or target size according to your requirements.',
      'Click the Compress button and download your optimized image instantly.'
    ],
    faqs: [
      {
        question: 'Does this image compressor reduce photo quality?',
        answer: 'Our tool uses smart client-side compression algorithms that reduce file size by up to 80% while retaining high visual quality.'
      },
      {
        question: 'What is the maximum file size limit for SBI or government portal uploads?',
        answer: 'Most Indian government job portals (like UPSC, SSC, SBI, Railways) require passport photos to be under 50KB or 20KB. You can use our target size option to set exactly 50KB or 20KB.'
      },
      {
        question: 'Are my uploaded photos safe on your server?',
        answer: 'Yes, 100% safe. All image compression runs locally in your web browser. Your images are never uploaded to any server or shared with anyone.'
      }
    ]
  },
  '/tools/ocr': {
    title: 'Free Online OCR Text Extractor - Convert Image to Editable Text',
    description: 'Extract text from images, scanned documents, screenshots, and PDFs online. Our free OCR tool supports English and Indian regional languages with no registration.',
    guideTitle: 'How to Extract Text from Images with OCR',
    steps: [
      'Select or drag & drop the image containing text into the file input.',
      'Wait for the OCR engine to initialize and scan the character layouts.',
      'Review the extracted text in the editable textbox below.',
      'Click the Copy button to copy the text to your clipboard instantly.'
    ],
    faqs: [
      {
        question: 'Can I extract text from scanned PDF documents?',
        answer: 'Yes, you can take a screenshot of any PDF page or upload the document page image to extract all readable text instantly.'
      },
      {
        question: 'Is there any daily limit for OCR extraction on UseBro?',
        answer: 'No, there are no limits. You can perform as many text extractions as you want, completely free.'
      },
      {
        question: 'Does this OCR text extractor work offline?',
        answer: 'Yes, once the page loads, the Tesseract engine executes locally in your browser, enabling you to extract text even without an active internet connection.'
      }
    ]
  },
  '/tools/color-picker': {
    title: 'Free Online Color Picker & Harmony Generator - HEX, RGB, HSL',
    description: 'Select colors visually with HSL sliders, convert HEX/RGB values, generate complementary and triadic color schemes, and perform WCAG contrast compliance audits.',
    guideTitle: 'How to Use the Online Color Picker Tool',
    steps: [
      'Adjust the Hue, Saturation, and Lightness sliders to select your custom color.',
      'Alternatively, click the color box to trigger your operating system native color eyedropper tool.',
      'Copy the calculated HEX, RGB, or HSL code to your clipboard with a single click.',
      'Scroll down to view harmonious color schemes and check WCAG contrast pass/fail compliance.'
    ],
    faqs: [
      {
        question: 'What is WCAG Contrast Compliance?',
        answer: 'Web Content Accessibility Guidelines (WCAG) specify that text must have a minimum contrast ratio of 4.5:1 against its background (AA rating) to be readable by visually impaired users.'
      },
      {
        question: 'How do I use the color eyedropper tool to pick a color from my screen?',
        answer: 'Click the main color preview square. This opens your browser\'s native color dialog. Select the eyedropper icon in that dialog and hover over any element on your screen to extract its exact color.'
      },
      {
        question: 'What are harmonious color schemes?',
        answer: 'Harmonious schemes are mathematically balanced color combinations (like complementary, analogous, or triadic) that look visually appealing together in web and graphic design.'
      }
    ]
  },
  '/tools/daily-features': {
    title: 'Daily Updates Dashboard - Weather, Live Gold Price, Fuel Rates India',
    description: 'Get real-time updates for weather conditions, official IBJA gold and silver prices, petrol and diesel rates, active coupons, and government jobs in India.',
    guideTitle: 'How to Use the Daily Updates Dashboard',
    steps: [
      'Select your city from the unified location selector dropdown at the top.',
      'Check the Weather tab for current temperature and wind metrics.',
      'Visit the Gold / Silver tab for real-time IBJA bullion rates.',
      'Browse the Fuel, Jobs, and Coupons tabs for active localized retail details.'
    ],
    faqs: [
      {
        question: 'Where do the live gold and silver prices come from?',
        answer: 'Our daily updates fetch official benchmark bullion rates directly from the India Bullion and Jewellers Association (IBJA) sessions.'
      },
      {
        question: 'How often are the petrol, diesel, and weather updates refreshed?',
        answer: 'All daily dashboard features are cached on an hourly basis, ensuring you see fresh, accurate updates throughout the morning, afternoon, and night.'
      },
      {
        question: 'Are the job and exam notifications on this dashboard real?',
        answer: 'Yes. The Jobs & Exams tab fetches live active notifications directly from official Indian recruitment portals and educational boards via aggregated search feeds.'
      }
    ]
  },
  '/tools/gst-calculator': {
    title: 'Free Online GST Calculator India - Add or Remove GST (3%, 5%, 12%, 18%, 28%)',
    description: 'Calculate Indian Goods and Services Tax (GST) easily. Compute CGST, SGST, and IGST values. Add GST or remove GST from net prices instantly.',
    guideTitle: 'How to Calculate GST in India Online',
    steps: [
      'Enter the base net or gross amount in the transaction field.',
      'Select the active Indian GST slab rate (3%, 5%, 12%, 18%, or 28%).',
      'Choose whether to Add GST (inclusive calculations) or Remove GST (exclusive calculations).',
      'View the detailed breakdown of CGST, SGST, and the final gross/net total.'
    ],
    faqs: [
      {
        question: 'What are CGST, SGST, and IGST?',
        answer: 'CGST (Central GST) and SGST (State GST) are levied on intrastate transactions and split equally. IGST (Integrated GST) is levied on interstate transactions.'
      },
      {
        question: 'Which GST rate applies to gold and silver purchases in India?',
        answer: 'Gold and silver ornaments are taxed at a flat rate of 3% GST on their value in India.'
      },
      {
        question: 'How do you remove GST from a total bill price?',
        answer: 'To remove GST, the exclusive formula is used: Net Price = Gross Amount / (1 + (GST% / 100)). Our GST exclusive option calculates this automatically.'
      }
    ]
  },
  '/tools/bmi-calculator': {
    title: 'Free Online BMI Calculator India - Check Body Mass Index & Weight Class',
    description: 'Calculate your Body Mass Index (BMI) online. Supports metric (kg/cm) and imperial (lbs/feet) inputs. Get instant health classifications according to WHO and Indian standards.',
    guideTitle: 'How to Calculate Your Body Mass Index',
    steps: [
      'Select your preferred measurement units (Metric or Imperial).',
      'Enter your height in centimeters or feet/inches, and your weight in kilograms or pounds.',
      'The calculator will compute your BMI value and highlight your weight class.',
      'Read the detailed health tips provided for underweight, normal, overweight, and obese ranges.'
    ],
    faqs: [
      {
        question: 'What is a healthy BMI range for Indian adults?',
        answer: 'While the WHO standard normal range is 18.5 to 24.9, health studies suggest that the ideal normal BMI range for the Indian population is 18.0 to 22.9 due to differing body fat percentages.'
      },
      {
        question: 'Is BMI calculation accurate for bodybuilders and athletes?',
        answer: 'BMI only considers total weight and height; it does not distinguish between muscle mass and fat. Therefore, muscular athletes may receive an overweight classification despite having low body fat.'
      },
      {
        question: 'How is BMI calculated mathematically?',
        answer: 'BMI is calculated using the formula: BMI = weight (kg) / height² (meters²).'
      }
    ]
  },
  '/tools/sip-calculator': {
    title: 'Free Online SIP Calculator - Calculate Mutual Fund SIP Returns in India',
    description: 'Calculate future wealth and interest returns from your Systematic Investment Plan (SIP) in mutual funds. Enter monthly investment, tenure, and expected returns.',
    guideTitle: 'How to Calculate SIP Mutual Fund Returns',
    steps: [
      'Enter the monthly amount you plan to invest in the SIP.',
      'Set the expected annual rate of return (e.g., 12% to 15% for equity mutual funds).',
      'Select the investment duration in years.',
      'View the total invested amount, estimated capital gains, and final maturity wealth value.'
    ],
    faqs: [
      {
        question: 'What is a Systematic Investment Plan (SIP)?',
        answer: 'A SIP is an investment method offered by mutual funds where you invest a fixed amount regularly (monthly/quarterly) rather than making a one-time lump sum payment.'
      },
      {
        question: 'What is the average return rate of equity mutual funds in India?',
        answer: 'Over a long tenure of 5 to 10 years, diversified equity mutual funds in India have historically generated average annual returns of 12% to 15%.'
      },
      {
        question: 'Are SIP investments subject to taxes in India?',
        answer: 'Yes, gains from equity mutual funds are subject to Capital Gains Tax: Short-Term Capital Gains (STCG) at 20% if sold within 1 year, and Long-Term Capital Gains (LTCG) at 12.5% on gains exceeding ₹1.25 lakh per year.'
      }
    ]
  }
};

export function getSeoEntry(pathname: string, toolTitle?: string, toolDesc?: string): SeoEntry {
  const normalizedPath = pathname.replace(/\/$/, ''); // Remove trailing slash
  if (SEO_MAP[normalizedPath]) {
    return SEO_MAP[normalizedPath];
  }

  // Generate automated high-quality SEO fallbacks dynamically for all other tools
  const name = toolTitle || 'Web Utility';
  const desc = toolDesc || 'Calculate, convert, format, or process data instantly in your browser.';
  
  return {
    title: `Free Online ${name} - Browser-Based Utility Tools`,
    description: `${desc} UseBro provides this free, client-side, browser-based tool. 100% secure, no downloads, and no registration required.`,
    guideTitle: `How to Use the Free Online ${name}`,
    steps: [
      `Open the ${name} tool page on UseBro.`,
      `Input your data, upload your file, or configure the parameters in the fields provided.`,
      `The tool will process your input dynamically and display results instantly on your screen.`,
      `Copy, save, or download the output with a single click.`
    ],
    faqs: [
      {
        question: `Is the ${name} tool free to use?`,
        answer: `Yes! All tools on UseBro are 100% free with no hidden charges, subscription fees, or signup requirements.`
      },
      {
        question: `Does this ${name} tool upload my data to a server?`,
        answer: 'No. To ensure absolute privacy, all processing is done locally inside your web browser. Your private data never leaves your device.'
      },
      {
        question: `Can I use the ${name} on my mobile phone?`,
        answer: `Yes! UseBro is fully responsive and works perfectly on Android, iPhones, iPads, laptops, and tablets.`
      }
    ]
  };
}
