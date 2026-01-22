
import { ToolCard } from '@/components/ToolCard';
import { tools } from '@/lib/tools';

const toolCategories = [
  {
    name: 'QR Code Tools',
    tools: tools.filter(t => ['QR Code Generator', 'QR Code Scanner'].includes(t.name)),
    color: 'bg-green-500/10 text-green-500'
  },
    {
    name: 'PDF Tools',
    tools: tools.filter(t => ['JPG to PDF Converter', 'PDF to JPG Converter'].includes(t.name)),
    color: 'bg-red-500/10 text-red-500'
  },
  {
    name: 'Image Tools',
    tools: tools.filter(t => ['Image Compressor', 'Image Converter', 'Image Resizer', 'Image Cropper', 'Favicon Converter', 'Feature Graphic Generator'].includes(t.name)),
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    name: 'Video Tools',
    tools: tools.filter(t => ['Video Compressor'].includes(t.name)),
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    name: 'Business Tools',
    tools: tools.filter(t => ['Quotation Maker', 'Invoice Maker'].includes(t.name)),
    color: 'bg-orange-500/10 text-orange-500'
  },
  {
    name: 'Web & Utility Tools',
    tools: tools.filter(t => ['Short Link Maker', 'Unit Converter', 'Currency Converter'].includes(t.name)),
    color: 'bg-indigo-500/10 text-indigo-500'
  },
  {
    name: 'Health & Lifestyle Calculators',
    tools: tools.filter(t => ['BMI Calculator', 'Calorie Calculator', 'Food Calorie & Nutrition Calculator', 'Love Calculator', 'Age Calculator'].includes(t.name)),
    color: 'bg-pink-500/10 text-pink-500'
  },
  {
    name: 'Financial Calculators',
    tools: tools.filter(t => ['Loan EMI Calculator', 'Gold Loan Calculator'].includes(t.name)),
    color: 'bg-yellow-500/10 text-yellow-500'
  },
  {
    name: 'Legal Document Generators',
    tools: tools.filter(t => ['Privacy Policy Generator', 'Terms & Conditions Generator', 'Refund Policy Generator', 'Return Policy Generator'].includes(t.name)),
    color: 'bg-gray-500/10 text-gray-500'
  },
  {
    name: 'WhatsApp Quotes',
    tools: tools.filter(t => ['WhatsApp Quotes'].includes(t.name)),
    color: 'bg-teal-500/10 text-teal-500'
  }
];


export default function Home() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          {siteName}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Your all-in-one hub for quick file conversions and tool utilities, running entirely in your browser.
        </p>
      </header>

      <div className="space-y-12">
        {toolCategories.map(category => (
          <section key={category.name}>
            <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl mb-6">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.tools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  title={tool.title}
                  description={tool.description}
                  href={tool.href}
                  Icon={tool.Icon}
                  color={category.color}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
