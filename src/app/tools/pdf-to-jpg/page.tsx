
'use client';
import { useState, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Loader2, Download, Upload, File as FileIcon, Lock } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageImage {
  url: string;
  name: string;
}

export default function PdfToJpgPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageImages, setPageImages] = useState<PageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quality, setQuality] = useState(90);
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({ title: 'Invalid file type', description: 'Please upload a PDF file.', variant: 'destructive' });
        return;
      }
      setPdfFile(file);
      setPageImages([]);
      setPassword('');
      setIsPasswordRequired(false);
    }
  };

  const handleConvert = useCallback(async () => {
    if (!pdfFile) {
      toast({ title: 'No PDF selected', description: 'Please upload a PDF file first.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setPageImages([]);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      const loadingTask = pdfjs.getDocument({ 
        data: arrayBuffer, 
        password: password || undefined 
      });
      
      const pdf = await loadingTask.promise;
      
      // If successful, reset password requirement state
      setIsPasswordRequired(false);

      const numPages = pdf.numPages;
      const images: PageImage[] = [];

      // Scale from 0.5 (low) to 2.5 (high) based on quality (1-100)
      const scale = 0.5 + (quality / 100) * 2; 
      // JPG quality from 0.5 (low) to 1.0 (high)
      const jpgQuality = Math.max(0.5, quality / 100);

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          images.push({
            url: canvas.toDataURL('image/jpeg', jpgQuality),
            name: `${pdfFile.name.replace('.pdf', '')}-page-${i}.jpg`,
          });
        }
      }
      setPageImages(images);
      toast({ title: 'Conversion Successful', description: `${numPages} pages converted to JPG.` });
    } catch (error: any) {
       if (error.name === 'PasswordException') {
        setIsPasswordRequired(true);
        // code 1 = password needed, code 2 = invalid password
        if (error.code === 2) {
             toast({
                title: 'Invalid Password',
                description: 'The password you entered is incorrect. Please try again.',
                variant: 'destructive',
            });
        } else {
             toast({
                title: 'Password Required',
                description: 'This PDF is password-protected. Please enter the password to unlock it.',
                variant: 'destructive',
            });
        }
      } else {
        console.error(error);
        toast({ title: 'Conversion Failed', description: error.message || 'Could not process the PDF file.', variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [pdfFile, toast, quality, password]);
  
  const downloadAllAsZip = async () => {
    if (pageImages.length === 0) return;
    const zip = new JSZip();
    
    for(const image of pageImages) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        zip.file(image.name, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${pdfFile?.name.replace('.pdf', '')}.zip`);
  }
  
  const downloadImage = (url: string, name: string) => {
    saveAs(url, name);
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">PDF to JPG Converter</CardTitle>
        <CardDescription>Upload a PDF and convert each page into a high-quality JPG image.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pdf-upload">Upload PDF</Label>
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <FileIcon className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1">
                <Input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>
          </div>
        </div>

        {pdfFile && (
            <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor='quality-slider'>Quality ({quality}%)</Label>
                  <Slider id="quality-slider" value={[quality]} onValueChange={([v]) => setQuality(v)} min={10} max={100} step={1} />
                </div>

                {isPasswordRequired && (
                  <div className="space-y-2">
                     <Alert variant="destructive">
                      <Lock className="h-4 w-4" />
                      <AlertTitle>Password Protected</AlertTitle>
                      <AlertDescription>
                          This PDF is encrypted. Please enter the password below.
                      </AlertDescription>
                    </Alert>
                    <div className="pt-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter PDF password"/>
                    </div>
                  </div>
                )}
                
                <Button onClick={handleConvert} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Convert to JPG
                </Button>
            </div>
        )}

        {pageImages.length > 0 && !isLoading && (
            <div className="space-y-4">
                <Label>Generated Images ({pageImages.length} pages)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pageImages.map((image, index) => (
                        <div key={index} className="space-y-2">
                            <div className="border rounded-lg p-2">
                                <Image src={image.url} alt={`Page ${index + 1}`} width={200} height={280} className="w-full h-auto rounded-md object-contain aspect-[2/3]" />
                            </div>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => downloadImage(image.url, image.name)}>
                                <Download className="mr-2 h-4 w-4" /> Page {index + 1}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </CardContent>
      {pageImages.length > 0 && !isLoading && (
        <CardFooter>
            <Button onClick={downloadAllAsZip}>
                <Download className="mr-2 h-4 w-4" />
                Download All (.zip)
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
