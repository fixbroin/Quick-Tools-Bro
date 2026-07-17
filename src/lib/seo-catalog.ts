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
  '/tools/gold-price-and-weather': {
    title: 'Gold Price Today: Live 24K & 22K Gold Rate & Weather Updates',
    description: 'Check live gold price today (24K & 22K) and silver rate in Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Pune, Ahmedabad, Kolkata, Jaipur, Lucknow, and major cities in India. Get real-time weather updates & forecasts.',
    guideTitle: 'How to Track Daily Gold Rates & Live Weather',
    steps: [
      'Select your city from the location dropdown (e.g. Mumbai, Delhi, Bangalore, Chennai).',
      'Check the Gold / Silver tab to see live 24K and 22K prices per gram and per 10g.',
      'View the transparent breakdown of base price, 15% customs/GST duty, and final rate.',
      'Switch to the Weather tab for real-time local temperature and forecasts.'
    ],
    faqs: [
      {
        question: 'Where do the live gold and silver prices come from?',
        answer: 'Our dashboard calculates prices in real-time by taking global bullion spot market feeds (XAU & XAG) and converting them using the live USD to INR exchange rate.'
      },
      {
        question: 'Why is the retail gold price in India higher than the global spot rate?',
        answer: 'Indian gold retail prices include basic customs duty, agriculture infrastructure cess, local dealer premiums, and a 3% GST, which adds roughly 15% to the base international rate.'
      },
      {
        question: 'How often are the daily gold rates and weather updates refreshed?',
        answer: 'The live gold prices, exchange rates, and weather conditions are automatically updated every 5 minutes on this page.'
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
  },
  '/tools/govt-job-photo-resizer': {
    title: 'Govt Job Photo & Signature Resizer - Compress to 20KB & 50KB Online',
    description: 'Resize and compress photos and signatures online to exactly 20KB, 50KB, or 100KB for Indian Government job portals like UPSC, SSC, IBPS, and State PSCs.',
    guideTitle: 'How to Resize Photo & Signature for Govt Jobs',
    steps: [
      'Upload your passport photo or signature image.',
      'Select your target exam preset (e.g. UPSC/SSC Photo, IBPS Signature, or Custom).',
      'The tool automatically adjusts pixel dimensions and runs a quality compression loop.',
      'Verify that the final output size in KB fits the requirements, then click Download.'
    ],
    faqs: [
      {
        question: 'What are the dimensions and size requirements for SSC/UPSC photos?',
        answer: 'For SSC and UPSC, passport photos must be in JPG/JPEG format, with dimensions between 350x350 pixels and 1000x1000 pixels. The file size must be strictly between 20 KB and 50 KB.'
      },
      {
        question: 'What is the signature file size limit for government exams in India?',
        answer: 'Most portals (like UPSC, SSC, IBPS) require the signature image to be between 10 KB and 20 KB. The dimensions are typically 350x350 pixels (UPSC) or 140x60 pixels (IBPS).'
      },
      {
        question: 'Is it safe to upload my photo and signature to UseBro?',
        answer: 'Yes! UseBro operates 100% client-side. The image resizing and compression are done directly in your browser. Your photos and signatures are never uploaded to any server, ensuring total privacy.'
      }
    ]
  },
  '/tools/ssy-calculator': {
    title: 'Sukanya Samriddhi Yojana (SSY) Calculator - Free Tax Savings Tool',
    description: 'Calculate interest earned, annual contributions, and final maturity amount for Sukanya Samriddhi account deposits with yearly projections.',
    guideTitle: 'How to Calculate Sukanya Samriddhi Yojana (SSY) Returns',
    steps: [
      'Enter the annual contribution amount (from ₹250 to ₹1.5 Lakhs).',
      'Select the age of your girl child (between 0 and 10 years).',
      'View the total invested amount, total interest earned, and final maturity value.',
      'Scroll down to see the year-by-year compounding growth ledger.'
    ],
    faqs: [
      {
        question: 'What is the current interest rate for Sukanya Samriddhi Yojana (SSY)?',
        answer: 'The current interest rate for the SSY scheme is 8.2% per annum, compounded annually. The interest rate is reviewed and set by the Government of India on a quarterly basis.'
      },
      {
        question: 'How long do I need to pay deposits in an SSY account?',
        answer: 'You only need to make deposits for 15 years from the date of opening the account. The account will continue to earn interest for the next 6 years without contributions, maturing after 21 years.'
      },
      {
        question: 'What are the tax benefits of opening an SSY account?',
        answer: 'SSY carries Triple Tax Exemption (EEE) status: deposits qualify for deductions under Section 80C, interest earned is tax-free, and the final maturity amount is completely exempt from income tax.'
      }
    ]
  },
  '/tools/ppf-calculator': {
    title: 'PPF Calculator - Public Provident Fund Maturity Calculator',
    description: 'Calculate Public Provident Fund (PPF) interest, maturity amount, and yearly projections online for free.',
    guideTitle: 'How to Calculate Public Provident Fund (PPF) Returns',
    steps: [
      'Enter your yearly PPF contribution amount (from ₹500 to ₹1,50,000).',
      'Select the tenure (default maturity is 15 years, extendable in blocks of 5 years).',
      'Check the total principal invested, interest accrued, and final maturity corpus.'
    ],
    faqs: [
      {
        question: 'What is the current PPF interest rate in India?',
        answer: 'The current interest rate for the Public Provident Fund (PPF) is 7.1% per annum, compounded annually.'
      },
      {
        question: 'Can I extend my PPF account after the 15-year maturity period?',
        answer: 'Yes, you can extend your PPF account indefinitely in blocks of 5 years. You can choose to extend it with or without making additional contributions.'
      },
      {
        question: 'Are PPF withdrawals taxable?',
        answer: 'No. PPF qualifies for EEE (Exempt-Exempt-Exempt) tax status. Contributions, interest earned, and final maturity withdrawals are all completely tax-free.'
      }
    ]
  },
  '/tools/epf-calculator': {
    title: 'EPF Calculator - Employee Provident Fund Calculator',
    description: 'Calculate your EPF corpus at retirement, monthly contributions (employee & employer), and accrued interest earnings online.',
    guideTitle: 'How to Project Your EPF Retirement Corpus',
    steps: [
      'Enter your current basic monthly salary + dearness allowance (DA).',
      'Input your current age and your target retirement age (default is 58).',
      'Optionally add your current EPF balance and average yearly salary increment percentage.',
      'Check the final estimated retirement corpus and review the yearly projections ledger.'
    ],
    faqs: [
      {
        question: 'What is the current EPF interest rate for 2025-2026?',
        answer: 'The current interest rate for the Employee Provident Fund (EPF) is 8.25% per annum, credited annually.'
      },
      {
        question: 'How is the employer’s 12% contribution split in EPF?',
        answer: 'The employee’s 12% contribution goes entirely to their EPF. The employer’s 12% is split: 8.33% goes to the Employee Pension Scheme (EPS) capped at a basic salary of ₹15,000 (max ₹1,250/month), and the remaining 3.67% goes to the EPF account.'
      },
      {
        question: 'Is the interest on EPF calculated monthly or yearly?',
        answer: 'The interest is calculated monthly on the running balance, but the accumulated interest is officially credited to the employee’s account once at the end of the financial year.'
      }
    ]
  },
  '/tools/gratuity-calculator': {
    title: 'Gratuity Calculator - Free Gratuity Payout Calculator',
    description: 'Calculate your tax-free gratuity payout online based on the Payment of Gratuity Act 1972 guidelines.',
    guideTitle: 'How to Calculate Your Gratuity Payout',
    steps: [
      'Enter your monthly basic salary + dearness allowance (DA).',
      'Select your continuous years of service (minimum 5 years is required by law).',
      'Toggle whether your company is covered under the Payment of Gratuity Act 1972.',
      'Check the final gratuity amount and read the step-by-step mathematical explanation.'
    ],
    faqs: [
      {
        question: 'What is the minimum service requirement to receive gratuity in India?',
        answer: 'Under the Payment of Gratuity Act 1972, an employee must complete at least 5 years of continuous service with the same employer to become eligible for gratuity payouts.'
      },
      {
        question: 'What is the formula to calculate gratuity for covered companies?',
        answer: 'For companies covered under the Gratuity Act, the formula is: Gratuity = (15 * Basic Salary * Years of Service) / 26. Here, 26 represents working days in a month.'
      },
      {
        question: 'What is the maximum limit of tax-free gratuity in India?',
        answer: 'The maximum tax-free gratuity limit allowed by the Indian government is ₹25 Lakhs. Any amount received beyond this limit is subject to income tax.'
      }
    ]
  },
  '/tools/video-to-mp3': {
    title: 'Video to MP3 Converter - Free Online Audio Extractor',
    description: 'Extract high-quality MP3 audio from any video file (MP4, MOV, WebM) online. 100% private, browser-based conversion.',
    guideTitle: 'How to Convert Video to MP3 Audio Online',
    steps: [
      'Upload your video file (MP4, WebM, MOV, or MKV).',
      'Select your desired audio quality bitrate (128kbps, 192kbps, or 320kbps).',
      'Click the Extract MP3 Audio button to begin.',
      'Listen to the audio preview and click Download MP3 File to save it.'
    ],
    faqs: [
      {
        question: 'Is my video file uploaded to a server to extract the MP3?',
        answer: 'No! UseBro operates entirely client-side. The audio extraction is processed locally inside your browser using WebAssembly. Your video files never leave your device.'
      },
      {
        question: 'What is the best bitrate for video to MP3 extraction?',
        answer: '192kbps offers a perfect balance between file size and high-fidelity sound. For CD-quality sound, select 320kbps.'
      }
    ]
  },
  '/tools/video-to-gif': {
    title: 'Video to GIF Converter - Create Animated GIFs Online',
    description: 'Convert MP4, WebM, and MOV video clips into high-quality animated GIFs online. 100% private, browser-based conversion.',
    guideTitle: 'How to Convert Video to Animated GIF',
    steps: [
      'Select and upload the video file you want to convert.',
      'Configure the target GIF width (320px, 480px, or 640px) and frame rate (FPS).',
      'Click Convert to GIF to generate the animated file.',
      'Preview the result and click Download GIF File.'
    ],
    faqs: [
      {
        question: 'How do I keep my animated GIF file size small?',
        answer: 'To reduce the file size, choose a smaller width (e.g. 320px) and a lower frame rate (e.g. 5 FPS or 10 FPS) in the settings before converting.'
      },
      {
        question: 'Can I convert long videos to GIF?',
        answer: 'GIFs are designed for short clips. We recommend uploading short video segments (under 30 seconds) to prevent massive file sizes and long browser processing times.'
      }
    ]
  },
  '/tools/audio-cutter': {
    title: 'Audio Cutter & Ringtone Maker - Cut MP3 Online',
    description: 'Trim your songs, cut MP3/WAV files, and create custom ringtones online for free. 100% private, browser-based editor.',
    guideTitle: 'How to Trim Songs and Create Ringtones',
    steps: [
      'Upload your audio file (MP3, WAV, AAC, M4A, OGG).',
      'Listen to the preview and choose your start and end trim markers in seconds.',
      'Click Cut & Trim Audio to process the file.',
      'Listen to the trimmed preview and download the output.'
    ],
    faqs: [
      {
        question: 'How does the browser-based audio cutter trim files so fast?',
        answer: 'UseBro cuts audio files by copying the codec stream directly without re-encoding. This completes the trimming process in less than a second without losing any quality.'
      },
      {
        question: 'Can I make iPhone ringtones with this tool?',
        answer: 'Yes! Trim your song to under 30 seconds (required by iOS), download the file, and convert it to M4R format to use as an iPhone ringtone.'
      }
    ]
  },
  '/tools/audio-converter': {
    title: 'Audio Converter - Convert MP3, WAV, AAC, M4A Online',
    description: 'Convert audio files between MP3, WAV, AAC, M4A, OGG, and FLAC formats online. 100% private, browser-based conversion.',
    guideTitle: 'How to Convert Audio Format Online',
    steps: [
      'Upload your input audio track.',
      'Select your desired target format (MP3, WAV, AAC, M4A, or OGG).',
      'Click the Convert Format button to re-encode the file.',
      'Click Download to save the converted file.'
    ],
    faqs: [
      {
        question: 'Which audio format should I choose?',
        answer: 'Choose MP3 for maximum compatibility and small file sizes. Choose WAV if you need uncompressed, lossless studio-quality audio.'
      },
      {
        question: 'Is it safe to convert my audio recordings here?',
        answer: 'Absolutely. UseBro runs entirely client-side, meaning your audio tracks are processed in-memory in your browser. No files are uploaded to any server.'
      }
    ]
  },
  '/tools/video-editor': {
    title: 'Basic Video Editor - Trim, Crop & Mute Videos Online',
    description: 'Edit your video clips online. Trim length, crop to square or vertical aspect ratios, and mute audio. 100% private, browser-based video editor.',
    guideTitle: 'How to Trim, Crop, and Mute Videos Online',
    steps: [
      'Upload your MP4, WebM, or MOV video file.',
      'Set your start and end trim times using the numeric inputs.',
      'Choose a target crop aspect ratio (1:1 Square, 9:16 Vertical, or 16:9 Landscape).',
      'Toggle the Mute Audio switch if you want to remove sound, then click Export Video.'
    ],
    faqs: [
      {
        question: 'Can I crop videos for Instagram, TikTok, and YouTube?',
        answer: 'Yes! Use the 1:1 Square crop for Instagram posts, the 9:16 Vertical crop for TikTok & Reels, and the 16:9 crop for standard YouTube uploads.'
      },
      {
        question: 'Does editing videos online cost money?',
        answer: 'No! All editing tools on UseBro are 100% free, unlimited, and run directly on your device without watermarks or server subscriptions.'
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
