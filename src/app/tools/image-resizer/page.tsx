
'use client';
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Download, Loader2 } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

export default function ImageResizerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [lastChanged, setLastChanged] = useState<'width' | 'height' | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please upload an image file.', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(String(img.width));
          setHeight(String(img.height));
          setLastChanged(null);
        };
        img.src = e.target?.result as string;
        setOriginalUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setOriginalFile(file);
      setResizedUrl(null);
    }
  };

  useEffect(() => {
    if (!lockAspectRatio || !originalDimensions || !lastChanged) return;

    const newWidth = parseInt(width, 10);
    const newHeight = parseInt(height, 10);
    const aspectRatio = originalDimensions.width / originalDimensions.height;

    if (lastChanged === 'width' && !isNaN(newWidth)) {
      setHeight(String(Math.round(newWidth / aspectRatio)));
    } else if (lastChanged === 'height' && !isNaN(newHeight)) {
      setWidth(String(Math.round(newHeight * aspectRatio)));
    }
  }, [width, height, lockAspectRatio, originalDimensions, lastChanged]);


  const handleResize = useCallback(() => {
    if (!originalFile || !originalUrl) return;
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);

    if (isNaN(numericWidth) || isNaN(numericHeight) || numericWidth <= 0 || numericHeight <= 0) {
        toast({ title: 'Invalid dimensions', description: 'Width and height must be positive numbers.', variant: 'destructive' });
        return;
    }

    setIsLoading(true);
    setResizedUrl(null);

    new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.src = originalUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = numericWidth;
            canvas.height = numericHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, numericWidth, numericHeight);
                const dataUrl = canvas.toDataURL(originalFile.type);
                resolve(dataUrl);
            } else {
                reject(new Error('Could not get canvas context.'));
            }
        };
        img.onerror = () => {
            reject(new Error('Error loading image'));
        };
    }).then(dataUrl => {
        setResizedUrl(dataUrl);
        scrollToDownload();
    }).catch(error => {
        toast({ title: error.message, variant: 'destructive' });
    }).finally(() => {
        setIsLoading(false);
    });
  }, [originalFile, originalUrl, width, height, toast]);

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Image Resizer</CardTitle>
        <CardDescription>Change the dimensions of your images. Adjust width and height as needed.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                {originalUrl && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input id="width" type="number" value={width} onChange={(e) => { setWidth(e.target.value); setLastChanged('width'); }} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input id="height" type="number" value={height} onChange={(e) => { setHeight(e.target.value); setLastChanged('height'); }} />
                    </div>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Checkbox id="aspect-ratio" checked={lockAspectRatio} onCheckedChange={(checked) => setLockAspectRatio(Boolean(checked))} />
                    <Label htmlFor="aspect-ratio">Lock aspect ratio</Label>
                    </div>
                    <Button onClick={handleResize} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Resize Image
                    </Button>
                </div>
                )}
            </div>
            <div className="space-y-4">
                 {originalUrl && (
                    <div className="space-y-2">
                    <Label>Original Preview</Label>
                    <div className="rounded-md border p-2 aspect-video flex items-center justify-center bg-muted">
                        <Image src={originalUrl} alt="Original Preview" width={originalDimensions?.width || 300} height={originalDimensions?.height || 300} className="max-w-full max-h-full h-auto w-auto rounded-md object-contain" />
                    </div>
                    </div>
                )}
                {resizedUrl && (
                    <div className="space-y-2">
                    <Label>Resized Preview</Label>
                    <div className="rounded-md border p-2 aspect-video flex items-center justify-center bg-muted">
                        {isLoading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                        <Image src={resizedUrl} alt="Resized Preview" width={parseInt(width) || 300} height={parseInt(height) || 300} className="max-w-full max-h-full h-auto w-auto rounded-md object-contain" />
                        )}
                    </div>
                    </div>
                )}
            </div>
        </div>
      </CardContent>
      {resizedUrl && !isLoading && originalFile && (
        <CardFooter id="download-section">
          <Button asChild>
            <a href={resizedUrl} download={`resized-${originalFile.name}`}>
              <Download className="mr-2 h-4 w-4" />
              Download Resized Image
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>

    <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Image Resizer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                    <h3 className="text-xl font-bold mb-3">Maintain Quality</h3>
                    <p>Our tool uses advanced browser-side canvas rendering to ensure that your images remain as sharp as possible after resizing. Whether you're scaling down for the web or adjusting for social media, quality is our priority.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Aspect Ratio Lock</h3>
                    <p>Never worry about stretching or squishing your photos. With the "Lock Aspect Ratio" feature, your image's proportions are automatically preserved, so scaling the width will perfectly adjust the height.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Local Processing</h3>
                    <p>Privacy is key. Your images are processed entirely in your browser, meaning they never touch our servers. This also makes the process incredibly fast, regardless of your internet connection speed.</p>
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Is this tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Absolutely! Our image resizer is completely free with no registration or subscription required. Resize as many images as you need.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">What image formats are supported?</h4>
                    <p className="text-muted-foreground text-sm">We support all standard web formats, including JPG, PNG, WebP, and BMP. The resized image will be exported in the same format as your original.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Can I resize to a specific file size?</h4>
                    <p className="text-muted-foreground text-sm">This tool focuses on pixel dimensions. If you need to reduce the file size (MB/KB), we recommend using our Image Compressor tool after resizing.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Will my original image be changed?</h4>
                    <p className="text-muted-foreground text-sm">No, the resizing happens in memory and a new file is created for you to download. Your original file remains untouched on your device.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
