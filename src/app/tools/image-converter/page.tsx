
'use client';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Upload, Download, Loader2, Sparkles } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

type Format = 'png' | 'jpeg' | 'webp' | 'gif' | 'bmp';

const formats: { id: Format, name: string }[] = [
    { id: 'png', name: 'PNG' },
    { id: 'jpeg', name: 'JPG' },
    { id: 'webp', name: 'WEBP' },
    { id: 'gif', name: 'GIF' },
    { id: 'bmp', name: 'BMP' },
];

export default function ImageConverterPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>('png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please upload a valid image file.', variant: 'destructive' });
        return;
      }
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setConvertedUrl(null);
    }
  };

  const handleConvert = useCallback(() => {
    if (!originalFile || !originalUrl) return;

    setIsLoading(true);
    setConvertedUrl(null);

    const img = new window.Image();
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (targetFormat === 'jpeg' || targetFormat === 'bmp') {
            // For formats that don't support transparency, fill with a white background.
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(`image/${targetFormat}`);
        setConvertedUrl(dataUrl);
        scrollToDownload();
      }
      setIsLoading(false);
    };
    img.onerror = () => {
      toast({ title: 'Error loading image', description: 'The selected file could not be loaded as an image.', variant: 'destructive' });
      setIsLoading(false);
    };
  }, [originalFile, originalUrl, targetFormat, toast]);
  
  const downloadExtension = targetFormat;

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Image Format Converter</CardTitle>
        <CardDescription>Convert images to JPG, PNG, WEBP, GIF, or BMP.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Image</Label>
          <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {originalUrl && (
          <>
            <div className="rounded-md border p-2">
              <Image src={originalUrl} alt="Original" width={400} height={400} className="w-full h-auto rounded-md object-contain aspect-video" />
            </div>
            <div className="space-y-2">
              <Label>Convert to:</Label>
              <RadioGroup value={targetFormat} onValueChange={(val: Format) => setTargetFormat(val)} className="flex flex-wrap gap-4">
                {formats.map(format => (
                    <div key={format.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={format.id} id={format.id} />
                        <Label htmlFor={format.id}>{format.name}</Label>
                    </div>
                ))}
              </RadioGroup>
            </div>
            <Button onClick={handleConvert} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Convert
            </Button>
          </>
        )}

        {convertedUrl && !isLoading && (
           <div className="space-y-2">
            <Label>Converted Image</Label>
            <div className="rounded-md border p-2">
                <Image src={convertedUrl} alt="Converted" width={400} height={400} className="w-full h-auto rounded-md object-contain aspect-video" />
              </div>
           </div>
        )}
      </CardContent>
      {convertedUrl && !isLoading && originalFile && (
        <CardFooter id="download-section">
          <Button asChild>
            <a href={convertedUrl} download={`${originalFile.name.split('.').slice(0, -1).join('.')}.${downloadExtension}`}>
              <Download className="mr-2 h-4 w-4" />
              Download Converted Image
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>

    <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Effortless Online Image Conversion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Fast & Free:</strong> Convert your images between all major formats in seconds. Whether you need to turn a high-res PNG into a web-friendly WebP or a JPG into a lossless BMP, our tool handles it with precision and speed.
                    </p>
                    <p>
                        We support the most popular formats used across the web and design industries, including JPG, PNG, WEBP, GIF, and BMP. This versatility makes our converter the perfect choice for developers, designers, and social media managers alike.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Why Convert with Us?</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li><strong>100% Client-Side:</strong> Your images are never uploaded to our servers.</li>
                        <li><strong>Lossless Quality:</strong> We ensure the best possible visual output.</li>
                        <li><strong>No Limits:</strong> Convert as many images as you need for free.</li>
                        <li><strong>Instant Downloads:</strong> Get your files as soon as they're ready.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is there a file size limit?</h4>
                    <p className="text-muted-foreground text-sm">Since the conversion happens on your device, the limit is based on your browser's memory. Most standard images work flawlessly.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Will I lose image quality?</h4>
                    <p className="text-muted-foreground text-sm">We use advanced canvas rendering to maintain high visual fidelity. However, converting to JPEG or GIF may involve some compression by nature.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">What happened to my transparency?</h4>
                    <p className="text-muted-foreground text-sm">Formats like JPEG and BMP do not support transparency. If you convert a transparent PNG to JPEG, we automatically add a clean white background.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is my privacy protected?</h4>
                    <p className="text-muted-foreground text-sm">Absolutely. All processing is done locally in your browser. Your private images never touch our servers.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
