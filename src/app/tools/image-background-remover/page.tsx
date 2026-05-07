'use client';

import { useState, useCallback, useRef } from 'react';
import { removeBackground, Config } from '@imgly/background-removal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Download, Loader2, RefreshCw, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { scrollToDownload } from '@/lib/utils';

export default function BackgroundRemoverPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid file type", description: "Please upload an image.", variant: "destructive" });
        return;
      }
      
      // Cleanup previous URLs
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);

      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setProgress(0);
      setStatus('');
    }
  };

  const handleRemoveBackground = useCallback(async () => {
    if (!originalFile) {
      toast({ title: 'Please select an image first.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setStatus('Initializing AI model...');

    const config: Config = {
      progress: (key: string, current: number, total: number) => {
        const percent = Math.round((current / total) * 100);
        setProgress(percent);
        // Map keys to user friendly messages
        if (key.includes('model')) setStatus(`Loading AI Model... ${percent}%`);
        else if (key.includes('compute')) setStatus(`Processing Image... ${percent}%`);
        else setStatus(`Working... ${percent}%`);
      },
      output: {
          type: 'image/png',
          quality: 0.8
      }
    };

    try {
      const blob = await removeBackground(originalFile, config);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('Completed!');
      scrollToDownload();
      toast({ title: 'Background removed successfully!' });
    } catch (error: any) {
      console.error('Background removal error:', error);
      toast({ 
        title: 'Error removing background', 
        description: error.message || 'Your browser might not support the required technologies (WebAssembly/SharedArrayBuffer).', 
        variant: 'destructive' 
      });
      setStatus('Error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [originalFile, toast]);

  const handleDownload = () => {
    if (resultUrl) {
      const a = document.createElement('a');
      a.href = resultUrl;
      a.download = `removed-bg-${originalFile?.name.replace(/\.[^/.]+$/, "")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const reset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setProgress(0);
    setStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-primary" />
            Background Remover
          </CardTitle>
          <CardDescription>
            Remove backgrounds from JPG, PNG, and GIF images instantly. Everything runs 100% in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!originalFile ? (
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-1">Click or drag to upload image</h3>
              <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF</p>
              <Input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Original Image</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted/30">
                    <Image 
                      src={originalUrl!} 
                      alt="Original" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Result Preview</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden border bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] bg-repeat">
                    {resultUrl ? (
                      <Image 
                        src={resultUrl} 
                        alt="Background Removed" 
                        fill 
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic bg-muted/10">
                        {isLoading ? 'Processing...' : 'Result will appear here'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{status}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {!resultUrl && !isLoading && (
                  <Button onClick={handleRemoveBackground} className="flex-1">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Remove Background
                  </Button>
                )}
                {resultUrl && !isLoading && (
                  <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                )}
                <Button variant="outline" onClick={reset} disabled={isLoading}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/30 rounded-b-lg border-t px-6 py-4">
          <p className="text-xs text-muted-foreground text-center w-full italic">
            Note: On first use, the tool will download a ~40MB AI model to your browser. This only happens once.
          </p>
        </CardFooter>
      </Card>

      {/* SEO Content Section */}
      <section className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
          <h2 className="text-2xl font-bold font-headline mb-4">How it works?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our Background Remover uses state-of-the-art **WebAssembly (WASM)** and **Artificial Intelligence** to segment the subject of your photo from its background directly in your browser. Unlike other tools that upload your private photos to their servers, our tool processes everything locally on your device.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex flex-col gap-2">
              <span className="text-2xl">🛡️</span>
              <h4 className="font-bold">100% Private</h4>
              <p className="text-sm text-muted-foreground">Your images never touch our servers. Privacy is guaranteed.</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-2xl">💰</span>
              <h4 className="font-bold">Unlimited & Free</h4>
              <p className="text-sm text-muted-foreground">Remove backgrounds from as many images as you want without paying a cent.</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-2xl">⚡</span>
              <h4 className="font-bold">High Quality</h4>
              <p className="text-sm text-muted-foreground">Edge detection AI ensures professional-grade transparency for your graphics.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-semibold mb-2">Can I remove background from GIFs?</h4>
              <p className="text-sm text-muted-foreground">Yes! However, for animated GIFs, our tool currently processes the first frame to ensure the best performance on mobile and desktop browsers.</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h4 className="font-semibold mb-2">What is the output format?</h4>
              <p className="text-sm text-muted-foreground">All results are saved as **PNG** files because this format supports the transparency needed for a background-free image.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
