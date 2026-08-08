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
  },
  '/tools/text-to-speech': {
    title: 'Text-to-Speech Converter - Free Online TTS Read Aloud',
    description: 'Convert text to spoken audio online for free. Adjust speech rate, pitch, and choose from multiple voices. 100% private browser-based tool.',
    guideTitle: 'How to Convert Text to Speech Online',
    steps: [
      'Type or paste your text into the input field.',
      'Select your preferred voice language from the dropdown menu.',
      'Adjust the Speech Speed (Rate) and Voice Pitch using the sliders.',
      'Click Play Speech to start reading aloud. Use Pause or Stop to control playback.'
    ],
    faqs: [
      {
        question: 'Are there character limits for the Text-to-Speech tool?',
        answer: 'There are no strict limits! Because the speech synthesis is processed entirely locally inside your browser, it can handle very long texts without crashing or timed timeouts.'
      },
      {
        question: 'Does this text-to-speech converter store my typed texts?',
        answer: 'No. The conversion runs entirely client-side using the browser SpeechSynthesis engine. No texts are sent to any database, preserving 100% user confidentiality.'
      }
    ]
  },
  '/tools/diff-checker': {
    title: 'Free Online Diff Checker - Compare Text & Code Side-by-Side',
    description: 'Compare two text files, documents, or code blocks side-by-side. Highlight line differences, edits, additions, and deletions instantly in your browser. 100% private.',
    guideTitle: 'How to Compare Text & Find Differences Online',
    steps: [
      'Paste your original text in the left panel and the modified text in the right panel.',
      'Click Find Differences to see highlighted edits, additions, and deletions instantly.',
      'Use the floating merge panel to merge changes or edit lines in real-time.',
      'Copy the original or merged results to your clipboard with a single click.'
    ],
    faqs: [
      {
        question: 'Is my text secure when using this Diff Checker online?',
        answer: 'Yes, completely. Our tool processes all differences client-side inside your web browser. No data is ever sent to our servers, ensuring absolute privacy for code, configs, and text.'
      },
      {
        question: 'Can I compare programming code like HTML, CSS, or JSON?',
        answer: 'Yes, you can paste and compare any code snippets or text formats. The diff engine parses and highlights programming files accurately.'
      },
      {
        question: 'How do I merge changes between the two texts?',
        answer: 'Click on any highlighted difference line to reveal the floating merge toolbar. You can click the left or right merge buttons to reconcile differences dynamically.'
      }
    ]
  },
  '/tools/html-preview': {
    title: 'Live HTML Preview - Free Online HTML, CSS & JS Code Editor',
    description: 'Write, edit, and preview HTML, CSS, and Javascript code online in real-time. Test responsive designs, load presets, and pop out live preview tabs instantly.',
    guideTitle: 'How to Preview and Edit HTML Code Online',
    steps: [
      'Enter your HTML, CSS, or JS code directly in the code editor panel.',
      'The sandboxed live preview panel renders the output in real-time as you type.',
      'Use the preset buttons to quickly load template layouts or sample forms.',
      'Click Pop-out Preview to open your rendering in a clean, full-screen browser tab.'
    ],
    faqs: [
      {
        question: 'Does the HTML live preview support external frameworks like Tailwind CSS?',
        answer: 'Yes. You can import CDN links for Tailwind CSS, Bootstrap, font libraries (like Google Fonts), or icons, and they will render perfectly.'
      },
      {
        question: 'Is the online code editor secure for testing scripts?',
        answer: 'Yes. The live preview runs in a sandboxed iframe wrapper with security restrictions, preventing scripts from accessing parent page contexts.'
      },
      {
        question: 'Can I download the code I write inside the HTML Preview?',
        answer: 'Yes. Simply click the Download button in the toolbar to save your complete code as a standard .html file locally.'
      }
    ]
  },
  '/tools/quotation-maker': {
    title: 'Free Online Quotation Maker - Generate Professional PDF Quotes',
    description: 'Create and download professional business quotes and estimates online for free. Add company logo, client details, items, taxes, discounts, and download print-ready PDFs.',
    guideTitle: 'How to Generate Business Quotes Online',
    steps: [
      'Enter your company name, address, and client contact details.',
      'Add quote number, issue date, currency, and customized notes.',
      'Input your products or services with unit rates, quantities, and optional tax rates.',
      'Click Generate PDF to preview and download your quote instantly.'
    ],
    faqs: [
      {
        question: 'Can I save my business profile details to avoid typing them every time?',
        answer: 'Yes. Click the Settings button in the Your Details section. Fill in your business details once, and they will automatically pre-fill for all quotes, invoices, and receipts.'
      },
      {
        question: 'How do I add a logo to my quotations?',
        answer: 'Simply click the Logo file selector and upload a PNG or JPEG logo. Our tool automatically compresses and fits it into your PDF.'
      }
    ]
  },
  '/tools/invoice-maker': {
    title: 'Free Online Invoice Maker - Professional PDF Invoice Generator',
    description: 'Create professional invoices online for free. Custom tax structures, company logo, client details, items, and automated calculation of discounts and totals. Download PDF.',
    guideTitle: 'How to Create PDF Invoices Online',
    steps: [
      'Fill in your company details, GSTIN/Tax ID, and client info.',
      'Enter invoice details, issue date, due date, and select your currency.',
      'Add items with descriptions, HSN codes, quantity, rate, and select tax.',
      'Review totals and click the Generate button to download a print-ready PDF.'
    ],
    faqs: [
      {
        question: 'Does this invoice maker support GST, VAT, and custom tax rates?',
        answer: 'Yes. You can configure custom tax names (like GST, VAT) and specify custom tax rates, which will be automatically calculated on item subtotals.'
      },
      {
        question: 'Are my invoices stored on your server?',
        answer: 'No. Invoices are generated locally in your browser and saved only to your device. No financial records are ever sent to our servers.'
      }
    ]
  },
  '/tools/receipt-generator': {
    title: 'Free Online Receipt Generator - Create PDF Cash Receipts',
    description: 'Create sales receipts, cash receipts, and rent receipts online for free. Add company details, logo, customer details, payment methods, and download printable PDFs.',
    guideTitle: 'How to Generate Cash Receipts Online',
    steps: [
      'Enter your company name, receipt number, date, and payment method.',
      'Input customer name, details, and the items or services paid for.',
      'Configure tax and discount details if applicable.',
      'Click Download PDF to instantly receive your formatted printable cash receipt.'
    ],
    faqs: [
      {
        question: 'Can I generate rent receipts with this generator?',
        answer: 'Yes. You can customize the receipt description, total amounts, and payment method to generate fully formatted rent receipts.'
      }
    ]
  },
  '/tools/gst-invoice': {
    title: 'GST Invoice Maker: Free Online Indian Tax Invoice Generator',
    description: 'Create GST compliant tax invoices online for free. Automatic split of CGST, SGST, and IGST tax components per item based on Indian tax rules. Download PDF.',
    guideTitle: 'How to Generate GST Compliant Tax Invoices',
    steps: [
      'Enter your company name, address, and your 15-digit GSTIN.',
      'Fill in client details and their GSTIN (optional for unregistered business).',
      'Add items with HSN codes and select the correct GST slab (5%, 12%, 18%, 28%).',
      'Select invoice currency and click Generate GST Invoice to download.'
    ],
    faqs: [
      {
        question: 'How does the GST invoice maker determine CGST, SGST, and IGST?',
        answer: 'If your business state matches the client\'s state, CGST and SGST are applied (split equally). If states differ, IGST is automatically calculated.'
      },
      {
        question: 'Is this invoice compliant with Indian GST rules?',
        answer: 'Yes, it is formatted to include HSN codes, supplier GSTIN, recipient GSTIN, proper tax splitting columns, and totals.'
      }
    ]
  },
  '/tools/passport-photo-maker': {
    title: 'Passport Photo Maker: Free Online Passport Size Photo Editor',
    description: 'Resize, crop, and generate official passport size photos online for free. Standardized dimensions for India, USA, and UK visa and passport guidelines.',
    guideTitle: 'How to Crop Passport Photos Online',
    steps: [
      'Upload a clear portrait photo from your computer or phone.',
      'Select your country to apply official passport specifications (e.g. India 3.5x4.5cm).',
      'Position your face within the guidelines and crop.',
      'Download your photo as a single file or a sheet ready for printing.'
    ],
    faqs: [
      {
        question: 'What is the official size of Indian passport photos?',
        answer: 'The official size is 35mm wide by 45mm high (3.5 x 4.5 cm) with the head centering covering 70-80% of the photo.'
      },
      {
        question: 'Can I use this tool for visa applications?',
        answer: 'Yes, select the specific country visa specifications (such as USA Visa 2x2 inches) to match requirements exactly.'
      }
    ]
  },
  '/tools/pdf-to-jpg': {
    title: 'PDF to JPG Converter - Convert PDF Pages to Images Online',
    description: 'Convert PDF document pages into high-quality JPG images online for free. 100% client-side rendering ensures absolute privacy for Aadhar cards and bank statements.',
    guideTitle: 'How to Convert PDF to JPG Online',
    steps: [
      'Select or drop the PDF file you wish to convert.',
      'Wait for our browser engine to render the PDF pages as image thumbnails.',
      'Click the Convert to JPG button to download all pages inside a ZIP archive.'
    ],
    faqs: [
      {
        question: 'Is it safe to convert private documents like Aadhaar cards?',
        answer: 'Yes, completely safe. Unlike other converters that upload your PDFs to cloud servers, UseBro renders everything locally in your browser. Your document never leaves your machine.'
      }
    ]
  },
  '/tools/jpg-to-pdf': {
    title: 'JPG to PDF Converter - Convert Images to PDF Document',
    description: 'Combine multiple JPG, PNG, and WebP images into a single PDF document. Drag to reorder, adjust page margins, and compile online for free.',
    guideTitle: 'How to Convert Images to PDF Online',
    steps: [
      'Upload one or more JPEG, PNG, or WebP images.',
      'Drag and drop thumbnails to reorder pages in the desired sequence.',
      'Adjust page sizes, orientation (portrait/landscape), and margin width.',
      'Click Convert to PDF to download your compiled PDF file.'
    ],
    faqs: [
      {
        question: 'Can I combine multiple screenshots into a single PDF document?',
        answer: 'Yes! Simply upload all your screenshot images, arrange them in order, and compile them into one PDF.'
      }
    ]
  }
};

export function getSeoEntry(pathname: string | null | undefined, toolTitle?: string, toolDesc?: string): SeoEntry {
  const normalizedPath = (pathname || '').replace(/\/$/, ''); // Remove trailing slash
  if (SEO_MAP[normalizedPath]) {
    return SEO_MAP[normalizedPath];
  }

  // Generate automated high-quality SEO fallbacks dynamically for all other tools
  const name = toolTitle || 'Web Utility';
  const desc = toolDesc || 'Calculate, convert, format, or process data instantly in your browser.';
  const nameLower = name.toLowerCase();

  // Simple deterministic hash based on pathname to vary synonyms
  let hash = 0;
  for (let i = 0; i < normalizedPath.length; i++) {
    hash = normalizedPath.charCodeAt(i) + ((hash << 5) - hash);
  }
  const variantIdx = Math.abs(hash) % 3;

  // Classify tools into 10 distinct categories
  const isPdf = nameLower.includes('pdf') || nameLower.includes('word') || nameLower.includes('excel') || nameLower.includes('ppt') || nameLower.includes('ocr');
  const isImage = nameLower.includes('image') || nameLower.includes('jpg') || nameLower.includes('png') || nameLower.includes('webp') || nameLower.includes('cropper') || nameLower.includes('resizer') || nameLower.includes('remover') || nameLower.includes('favicon') || nameLower.includes('graphic') || nameLower.includes('watermark') || nameLower.includes('rotate') || nameLower.includes('blur') || nameLower.includes('photo') || nameLower.includes('signature');
  const isVideoAudio = nameLower.includes('video') || nameLower.includes('audio') || nameLower.includes('mp3') || nameLower.includes('gif') || nameLower.includes('speech') || nameLower.includes('cutter') || nameLower.includes('trim') || nameLower.includes('ringtone') || nameLower.includes('editor');
  const isBusiness = nameLower.includes('invoice') || nameLower.includes('receipt') || nameLower.includes('quotation') || nameLower.includes('gst');
  const isFinancial = nameLower.includes('loan') || nameLower.includes('emi') || nameLower.includes('sip') || nameLower.includes('salary') || nameLower.includes('tax') || nameLower.includes('ppf') || nameLower.includes('epf') || nameLower.includes('gratuity') || nameLower.includes('yojana') || nameLower.includes('ssy');
  const isHealthLifestyle = nameLower.includes('bmi') || nameLower.includes('calorie') || nameLower.includes('age') || nameLower.includes('love') || nameLower.includes('nutrition');
  const isDeveloper = nameLower.includes('diff') || nameLower.includes('preview') || nameLower.includes('json') || nameLower.includes('base64') || nameLower.includes('encode') || nameLower.includes('decode') || nameLower.includes('regex') || nameLower.includes('css') || nameLower.includes('color') || nameLower.includes('html') || nameLower.includes('code');
  const isLegal = nameLower.includes('policy') || nameLower.includes('terms') || nameLower.includes('conditions') || nameLower.includes('refund') || nameLower.includes('return');
  const isContent = nameLower.includes('writer') || nameLower.includes('bio') || nameLower.includes('prompt') || nameLower.includes('resume') || nameLower.includes('builder') || nameLower.includes('letter') || nameLower.includes('tag') || nameLower.includes('thumbnail') || nameLower.includes('title');
  const isStudent = nameLower.includes('gpa') || nameLower.includes('percentage') || nameLower.includes('attendance') || nameLower.includes('study') || nameLower.includes('pomodoro');

  let title = `Free Online ${name} - Browser-Based Utility Tools`;
  let description = `${desc} UseBro provides this free, client-side, browser-based tool. 100% secure, no downloads, and no registration required.`;
  let guideTitle = `How to Use the Free Online ${name}`;
  let steps: string[] = [];
  let faqs: { question: string; answer: string }[] = [];

  if (isPdf) {
    const titles = [
      `Free Online ${name} - Manage PDF Files in Your Browser`,
      `${name} Online - Fast & Private PDF Document Manager`,
      `Convert & Process PDFs with ${name} - 100% Free`
    ];
    const descriptions = [
      `Convert or edit PDF documents instantly with ${name}. Process pages completely client-side for maximum confidentiality. No limits, no watermarks.`,
      `Use our free online ${name} to modify and manage documents safely. Processes files 100% locally in your web browser. No registration required.`,
      `${desc} Manage your PDF paperwork, crop pages, and compile files in seconds. Completely secure and local processing.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Step-by-Step Guide: How to Use ${name}`;
    steps = [
      [
        `Upload your PDF or document files to the ${name} workspace.`,
        `Select or drag your target PDF files into the browser conversion interface.`,
        `Add your PDF documents from your computer or mobile device.`
      ][variantIdx],
      [
        `Configure your document settings, page ordering, or file properties.`,
        `Adjust layout margins, page orientations, or compression levels.`,
        `Reorder pages or select specific page ranges for processing.`
      ][variantIdx],
      [
        `Click the main processing button to initiate document adjustments.`,
        `Press the convert or compress button to process pages client-side.`,
        `Trigger the tool to apply formatting and construct your document.`
      ][variantIdx],
      [
        `Download the finalized PDF or extracted files directly to your device.`,
        `Click Download to save your compiled document files locally.`,
        `Save your processed PDF sheets securely with a single click.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Is my confidential PDF data safe on UseBro?`,
        answer: `Yes, 100% secure. All document conversions and modifications are processed locally in your browser. Your files are never uploaded to any cloud servers.`
      },
      {
        question: `Does this ${name} tool have file size limits?`,
        answer: `Because the processing occurs entirely inside your local browser memory, it can handle standard documents smoothly. There are no artificial limits or restrictions.`
      }
    ];
  } else if (isImage) {
    const titles = [
      `Free Online ${name} - Edit & Compress Images Instantly`,
      `${name} Online - Crop, Resize & Process Photos for Free`,
      `Optimize Images with ${name} - 100% Private Browser Tool`
    ];
    const descriptions = [
      `Crop, compress, or resize images with our free ${name}. Fits photos to government specs (SBI, job portals) locally in the browser.`,
      `Use our online ${name} to modify image files. Complete client-side rendering preserves your personal photos. 100% private.`,
      `${desc} Optimize photo dimensions, compress file sizes to 20kb/50kb, and edit images instantly. No server uploads required.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Visual Guide: How to Use ${name}`;
    steps = [
      [
        `Choose your JPG, PNG, or WebP photo files from your local storage.`,
        `Drag and drop your image file into the upload zone.`,
        `Click to select a photo from your phone gallery or desktop.`
      ][variantIdx],
      [
        `Configure crop overlays, resolution values, or quality metrics.`,
        `Adjust size sliders, target file dimensions, or visual aspect ratios.`,
        `Select country guidelines or set custom parameters for your image.`
      ][variantIdx],
      [
        `The browser processes your changes locally using HTML5 canvas.`,
        `Our client-side engine resizes and optimizes your photo instantly.`,
        `The tool applies edits, updates previews, and computes file sizes.`
      ][variantIdx],
      [
        `Click Download to save your formatted image file.`,
        `Save your high-quality cropped photo to your camera roll or downloads folder.`,
        `Download your optimized image instantly for online submissions.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Can I compress photos to a specific size like 50kb or 20kb?`,
        answer: `Yes. You can customize target file sizes or dimensions before downloading. This is ideal for job applications and document portals.`
      },
      {
        question: `Are my private photos uploaded to a database?`,
        answer: `Never. To ensure complete privacy, all photo processing is executed locally in your browser. Your pictures remain secure on your device.`
      }
    ];
  } else if (isVideoAudio) {
    const titles = [
      `Free Online ${name} - Convert & Trim Media Files`,
      `${name} Online - Compress & Edit Video/Audio locally`,
      `Process Video & Audio with ${name} - 100% Private`
    ];
    const descriptions = [
      `Cut, convert, or compress audio and video files online. Process files locally in your web browser with maximum speed and security.`,
      `Modify and convert media files with our free online ${name}. Fast browser-based conversion with no watermarks or registrations.`,
      `${desc} Trim tracks, extract MP3 audio, and compress video file sizes inside your browser. No files are uploaded to any server.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Step-by-Step Media Guide: How to Use ${name}`;
    steps = [
      [
        `Select your audio or video file from your device libraries.`,
        `Drag and drop your media track into the converter timeline.`,
        `Upload your file (MP4, MP3, WAV, WebM) to the local editor.`
      ][variantIdx],
      [
        `Set trim boundaries, output formats, or audio bitrate.`,
        `Adjust compression settings, volumes, or sound frequencies.`,
        `Choose your target formats like MP3, GIF, WAV, or MP4.`
      ][variantIdx],
      [
        `The tool processes the timeline and runs conversion client-side.`,
        `Our browser converter extracts audio or trims tracks locally.`,
        `Click process and let the local engine compile your files.`
      ][variantIdx],
      [
        `Save the compiled media file directly to your system downloads.`,
        `Download your converted audio or edited video clip instantly.`,
        `Click Download to receive your watermark-free file.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Is my media content uploaded during editing?`,
        answer: `No. All conversions and trims execute locally inside your browser window. No video or audio records are ever uploaded to any database.`
      },
      {
        question: `Does this media tool add watermarks?`,
        answer: `No. All exports from UseBro tools are 100% watermark-free, high-quality, and completely free for public and private use.`
      }
    ];
  } else if (isBusiness) {
    const titles = [
      `${name} - Free Online PDF Generator for Businesses`,
      `Free Online ${name} - Create Business Documents Instantly`,
      `Generate Professional invoices & quotes with ${name}`
    ];
    const descriptions = [
      `Create professional GST invoices, receipts, and quotations online. Save your business profiles to autofill fields automatically. Download PDF.`,
      `Use our free ${name} to generate printable receipts and quotes. Local storage pre-fills details to save you time. 100% secure.`,
      `${desc} Generate invoice details, manage business tax rates, calculate discounts, and print PDF papers client-side.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Business Workflow: How to Use ${name}`;
    steps = [
      [
        `Configure your default business profile inside the Settings modal.`,
        `Click the Settings button to pre-fill GSTIN, business name, and address.`,
        `Enter your company billing details, contact numbers, and upload logo.`
      ][variantIdx],
      [
        `Input client details and specify the invoice, quote, or receipt number.`,
        `Fill client details, document IDs, and select your currency.`,
        `Add client billing addresses and configure document dates.`
      ][variantIdx],
      [
        `Add line items with descriptions, HSN codes, quantity, and rates.`,
        `List your services or products with quantities, rates, and tax slates.`,
        `Enter unit prices, quantities, and adjust discount percentages.`
      ][variantIdx],
      [
        `Click Generate to compile and download your formatted PDF document.`,
        `Save your print-ready invoice or receipt PDF directly to your device.`,
        `Download your professional quote or bill instantly for client sharing.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Can I save my company logo and GSTIN for future bills?`,
        answer: `Yes. Click the Settings button in the Your Details section. Fill in your details once, and they will automatically populate for all documents.`
      },
      {
        question: `Is my business financial data kept private?`,
        answer: `Yes. All invoice calculations and PDF compilations are done locally in your browser. No financial data is sent to our servers.`
      }
    ];
  } else if (isFinancial) {
    const titles = [
      `${name} - Free Online Financial & Investment Calculator`,
      `Free Online ${name} - Calculate Loan EMIs & SIP Growth`,
      `Compare Investments & Loans with ${name} - 100% Free`
    ];
    const descriptions = [
      `Calculate EMI schedules, SIP compounding growth, salary structures, or tax liabilities online. View amortization graphs and payment tables.`,
      `Use our free ${name} to plan loans, investments, and retirement savings. Get detailed summaries instantly in your browser.`,
      `${desc} Compute compound interest, compare old vs new tax regimes, and plan investment values with our browser tool.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Financial Planning Guide: How to Use ${name}`;
    steps = [
      [
        `Input your financial amounts, rates, or monthly contributions.`,
        `Enter principal amount, interest rate, and target duration.`,
        `Type in your salary details, investments, or compounding inputs.`
      ][variantIdx],
      [
        `Adjust compounding frequencies, loan tenure, or tax deductions.`,
        `Use sliders to change tenures or adjust monthly investment rates.`,
        `Select custom regimes or apply specific exemptions.`
      ][variantIdx],
      [
        `The tool generates amortization schedules or wealth projections.`,
        `Our local engine calculates compounding tables and graphical breakdowns.`,
        `View monthly EMIs or projected investment yields instantly.`
      ][variantIdx],
      [
        `Copy the calculation summary or print the breakdown report.`,
        `Save details to your clipboard or print the page for future reference.`,
        `Copy results and summaries to share with your advisor.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `How does this tool calculate compounding or EMI tables?`,
        answer: `Our calculators use standard formulas (such as the EMI formula or the SIP compound interest formula) to compute schedules accurately.`
      },
      {
        question: `Are my financial calculations saved on your servers?`,
        answer: `No. UseBro prioritizes privacy. All calculations are executed locally inside your web browser and are never uploaded anywhere.`
      }
    ];
  } else if (isHealthLifestyle) {
    const titles = [
      `${name} - Free Online Health & Weight Calculator`,
      `Free Online ${name} - Track Body Mass Index & Nutrition`,
      `Check Fitness Metrics with ${name} - 100% Private`
    ];
    const descriptions = [
      `Calculate Body Mass Index (BMI), daily calorie counts, or age targets online. Get instant classification reports based on medical guidelines.`,
      `Use our free online ${name} to track weight status, age parameters, or calorie counts. Highly secure, clean interface.`,
      `${desc} Compute fitness indicators, check weight status, and log parameters inside your browser for local reports.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Wellness Guide: How to Use ${name}`;
    steps = [
      [
        `Enter your weight, height, age, or activity stats in the inputs.`,
        `Select your metrics (cm/kg or lbs/ft) and fill in your details.`,
        `Provide dates or nutritional values inside the form fields.`
      ][variantIdx],
      [
        `Select the target standards or formulas (e.g. WHO classification).`,
        `Select gender options, activity levels, or calculations guidelines.`,
        `Confirm parameters and check calculations ranges.`
      ][variantIdx],
      [
        `The calculator checks metrics and outputs classifications in real-time.`,
        `Our local algorithm processes indexes and outputs report cards.`,
        `View health indicators and weight status labels instantly.`
      ][variantIdx],
      [
        `Review recommendations, copy logs, or save details locally.`,
        `Copy summary metrics to save in your fitness notebook.`,
        `Download report breakdowns or note index numbers.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Are these health metric calculations accurate?`,
        answer: `Yes, they are based on official formulas (like the WHO BMI metrics). However, they are for planning purposes and do not replace medical advice.`
      },
      {
        question: `Does the website track my age or weight details?`,
        answer: `No. All calculations run entirely in your web browser. No logs, search histories, or metrics are saved on our servers.`
      }
    ];
  } else if (isDeveloper) {
    const titles = [
      `Free Online ${name} - Developer Coding Utility`,
      `Online ${name} - Format, Parse & Debug Code Snippets`,
      `Format & Clean Scripts with ${name} - 100% secure`
    ];
    const descriptions = [
      `Format JSON strings, compare text diffs, preview HTML files, or decode Base64 strings online. 100% client-side tool for developers.`,
      `Use our free online ${name} to debug, format, and parse code blocks. Complete browser-based execution ensures total confidentiality.`,
      `${desc} Inspect code deltas, check syntax rules, encode URLs, and preview HTML frames. Absolute privacy for your codebase.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Developer Guide: How to Use ${name}`;
    steps = [
      [
        `Paste your raw code block, text content, or files in the editor.`,
        `Enter your string, scripts, or syntax lines inside the text fields.`,
        `Load sample codes or paste variables into the compiler panels.`
      ][variantIdx],
      [
        `Configure indentation, parse rules, or target formatting styles.`,
        `Select configurations (minify, format, escape, or test options).`,
        `Adjust output tabs, select comparison columns, or choose themes.`
      ][variantIdx],
      [
        `The parser compiles and renders your results instantly.`,
        `Our browser-based engine formats, decodes, or highlights code blocks.`,
        `View colorized outputs, live iframe renders, or delta reports.`
      ][variantIdx],
      [
        `Copy the formatted output, download code files, or sync configurations.`,
        `Click Copy to capture clean syntax or save code to your desktop.`,
        `Download raw formatted assets directly with one click.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Is my codebase safe from leakage when debugging online?`,
        answer: `Yes. All decoding, formatting, and previews execute locally in your browser memory. No code fragments are ever uploaded online.`
      },
      {
        question: `Can I format compressed programming structures?`,
        answer: `Yes, our parser can clean minified scripts, XML blocks, or JSON configurations into highly legible tree layouts.`
      }
    ];
  } else if (isLegal) {
    const titles = [
      `Free Online ${name} - Generate Custom Legal Docs`,
      `Free ${name} - Create Legal Agreement Templates`,
      `Generate Privacy Documents with ${name} - CCPA & GDPR`
    ];
    const descriptions = [
      `Generate compliant privacy policies, terms, refund rules, and terms of service for your website or mobile application. Completely free.`,
      `Use our free ${name} to create legal agreement documents. Compliant with GDPR, COPPA, CCPA, and Google Adsense guidelines.`,
      `${desc} Build compliant terms pages, generate refund policies, and download legal files inside your browser.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Legal Setup Guide: How to Use ${name}`;
    steps = [
      [
        `Enter your business details, website URL, and contact email.`,
        `Type in your app name, company details, and tracking policies.`,
        `Fill in the questionnaire details about data collection and cookies.`
      ][variantIdx],
      [
        `Select compliant checkboxes (GDPR, Adsense, or Refund slabs).`,
        `Choose specific clauses about payment processing, emails, and ads.`,
        `Select optional cookie disclosure clauses or liability limits.`
      ][variantIdx],
      [
        `The legal builder compiles standard terms clauses client-side.`,
        `Our program parses legal terms and constructs a template draft.`,
        `Click build and let the local compiler format your documents.`
      ][variantIdx],
      [
        `Copy the HTML/Markdown legal text or download the text document.`,
        `Download the legal page directly to link to your app.`,
        `Save your policy document files in HTML format instantly.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Are these legal agreements compliant with Google Adsense?`,
        answer: `Yes. The generated text templates are structured to include standard cookie disclosures, third-party advertising clauses, and user privacy terms required by Adsense.`
      },
      {
        question: `Are the policies generated legally binding?`,
        answer: `They provide standard compliance templates. We recommend having a legal professional review them to fit your specific business liabilities.`
      }
    ];
  } else if (isContent) {
    const titles = [
      `Free Online ${name} - AI Content Generator & Writer`,
      `Free ${name} - Create Bio, Prompts & Copy Online`,
      `AI Writing Tool: ${name} - 100% Free Browser Utility`
    ];
    const descriptions = [
      `Generate optimized social bios, email messages, cover letters, and video metadata online. AI writing assistants for copywriting.`,
      `Use our free online ${name} to write captions, prompts, and business profiles. Instant output with simple configurations.`,
      `${desc} Create creative texts, plan prompts, write bios, and draft resumes in seconds with our browser content tool.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Creative Writing Guide: How to Use ${name}`;
    steps = [
      [
        `Enter your target keywords, job titles, or topic descriptions.`,
        `Type in prompts details, main points, or business summaries.`,
        `Upload or write draft contents into the editor workspace.`
      ][variantIdx],
      [
        `Select writing tones, styling templates, or platform layouts.`,
        `Choose copy lengths, adjust keywords, or set visual styles.`,
        `Pick desired templates (Instagram bio, formal email, etc.).`
      ][variantIdx],
      [
        `The AI generator builds high-converting copy in real-time.`,
        `Our local text compiler templates paragraphs and formats structures.`,
        `View generated tag suggestions, resume pages, or bios instantly.`
      ][variantIdx],
      [
        `Copy the generated text copy or download files immediately.`,
        `Click Copy to capture results or save text files to your desktop.`,
        `Export your finished creative drafts with a single click.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Can I use the output of the content generator commercially?`,
        answer: `Yes. All outputs generated are royalty-free and yours to copy, modify, and utilize across your website, videos, or social handles.`
      },
      {
        question: `Do I need to sign up to write content on UseBro?`,
        answer: `No. Unlike other writing assistants, there are no subscriptions or signups. The utility is completely free and browser-based.`
      }
    ];
  } else if (isStudent) {
    const titles = [
      `${name} - Free Online Student Calculator & Tool`,
      `Free Online ${name} - Compute GPA & Percentage Grades`,
      `Track Classes and Study with ${name} - 100% Free`
    ];
    const descriptions = [
      `Compute GPA scores, calculate percentages, track attendance ratios, or set study pomodoro timers. Clean, free student tools.`,
      `Use our online ${name} to log grades and calculate study times. Get detailed reports dynamically in your browser.`,
      `${desc} Calculate academic marks, check passing indexes, track classes, and study with our student helper tool.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Academic Guide: How to Use ${name}`;
    steps = [
      [
        `Input your grades, classes count, or study target intervals.`,
        `Enter your current course credits, points, or target percentages.`,
        `Fill in attendance histories or subject marks inside the rows.`
      ][variantIdx],
      [
        `Select grading scales (e.g. 4.0 or 10.0 GPA standards).`,
        `Select target thresholds, percentages criteria, or timers.`,
        `Adjust values to test different grade scenarios.`
      ][variantIdx],
      [
        `The tool processes indexes and maps results in real-time.`,
        `Our local student engine computes grade averages instantly.`,
        `View GPA tallies, progress indicators, or class ratios.`
      ][variantIdx],
      [
        `Save your report card metrics or copy study summaries.`,
        `Copy results to your clipboard or print the page for future reference.`,
        `Bookmark scores and logs for tracking your semesters.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Does the GPA calculator support standard university scales?`,
        answer: `Yes, it supports standard weighted and unweighted scales (including 4.0 scale) commonly used in schools and colleges.`
      },
      {
        question: `Are my academic inputs saved?`,
        answer: `No. UseBro is completely client-side. No grades, attendance logs, or study histories are stored on our servers.`
      }
    ];
  } else {
    // Default dynamic fallbacks
    const titles = [
      `Free Online ${name} - Easy Browser-Based Utility Tool`,
      `${name} Online - Fast & Private Web Helper Utility`,
      `Use Free ${name} Online - Secure Browser Web Tool`
    ];
    const descriptions = [
      `Process data, generate structures, or check inputs with our free online ${name}. Fast, secure, and 100% browser-based utility.`,
      `Access the free online ${name} utility. Instant processing completely locally in your browser. No files are uploaded online.`,
      `${desc} 100% client-side execution ensures absolute privacy. Easy configuration, no downloads, and no registration.`
    ];
    title = titles[variantIdx];
    description = descriptions[variantIdx];
    guideTitle = `Step-by-Step Guide: How to Use ${name}`;
    steps = [
      [
        `Open the ${name} utility page inside your web browser.`,
        `Navigate to the ${name} tool on UseBro on any device.`,
        `Access our free online ${name} workspace.`
      ][variantIdx],
      [
        `Input your details, upload files, or choose custom settings.`,
        `Fill in variables, paste raw text, or select options.`,
        `Add parameters or select specifications inside the dashboard.`
      ][variantIdx],
      [
        `Our client-side engine executes the tool logic in real-time.`,
        `The tool processes parameters and displays results instantly.`,
        `The utility computes parameters locally on your local device.`
      ][variantIdx],
      [
        `Copy output details or download your generated files.`,
        `Click Copy or print the page to export results.`,
        `Save your finalized results with a single click.`
      ][variantIdx]
    ];
    faqs = [
      {
        question: `Is this ${name} free to use?`,
        answer: `Yes! All tools on UseBro are 100% free with no hidden charges, daily usage limits, or signup requirements.`
      },
      {
        question: `Does the ${name} upload my data?`,
        answer: `No. We value confidentiality. All calculation and formatting code executes locally on your device, ensuring total privacy.`
      }
    ];
  }

  return { title, description, guideTitle, steps, faqs };
}
