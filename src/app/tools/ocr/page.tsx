'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, X, ShieldCheck, Copy, Image as ImageIcon, Zap } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

export default function OCRPage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [language, setLanguage] = useState<string>('eng');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file format', description: 'Please upload an image file (PNG/JPG/WebP).', variant: 'destructive' });
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedText('');
      setProgress(0);
      setStatusMessage('');
    }
  };

  const handleExtractText = async () => {
    if (!previewUrl) return;

    setIsLoading(true);
    setProgress(0);
    setStatusMessage('Initializing OCR engine...');

    try {
      const Tesseract = (await import('tesseract.js')).default;

      const result = await Tesseract.recognize(
        previewUrl,
        language,
        {
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.floor(m.progress * 100));
              setStatusMessage(`Extracting: ${Math.floor(m.progress * 100)}%`);
            } else {
              setStatusMessage(m.status);
            }
          }
        }
      );

      setExtractedText(result.data.text);
      toast({ title: 'OCR Extraction Complete!' });
      scrollToDownload();
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Extraction Failed', description: error.message || 'Failed to extract text from image.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast({ title: 'Copied to Clipboard!' });
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `extracted-text-${Date.now()}.txt`;
    a.click();
  };

  return (<>
      <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <ImageIcon className="h-6 w-6 text-primary" /> OCR TEXT EXTRACTOR
              </CardTitle>
              <CardDescription>Upload an image or document screenshot to extract editable text client-side.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider">Document Language</Label>
                <Select value={language} onValueChange={(val) => setLanguage(val)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng">English</SelectItem>
                    <SelectItem value="spa">Spanish (Español)</SelectItem>
                    <SelectItem value="fra">French (Français)</SelectItem>
                    <SelectItem value="deu">German (Deutsch)</SelectItem>
                    <SelectItem value="hin">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="tel">Telugu (తెలుగు)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!image ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/20 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold uppercase italic">Click to upload Image</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-2xl">
                    <span className="text-xs font-bold truncate max-w-xs">{image.name}</span>
                    <Button size="icon" variant="ghost" onClick={() => { setImage(null); setPreviewUrl(null); setExtractedText(''); }} className="h-7 w-7 text-destructive"><X className="h-4 w-4" /></Button>
                  </div>
                  {previewUrl && (
                    <div className="relative h-60 w-full rounded-2xl overflow-hidden border">
                      <Image src={previewUrl} alt="Preview" fill className="object-contain bg-muted/10" />
                    </div>
                  )}
                </div>
              )}

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase">
                    <span>{statusMessage}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 rounded-full" />
                </div>
              )}
            </CardContent>
            {image && (
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleExtractText} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                  EXTRACT TEXT FROM IMAGE
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b flex flex-row justify-between items-center px-6">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Extracted Content</CardTitle>
              {extractedText && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 rounded-lg"><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
                  <Button size="sm" variant="outline" onClick={downloadText} className="h-8 rounded-lg"><Download className="h-3.5 w-3.5 mr-1" /> Download</Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-6 min-h-[300px]">
              {extractedText ? (
                <div id="download-section" className="space-y-4 w-full flex-1 flex flex-col animate-in fade-in zoom-in duration-500">
                  <Textarea
                    readOnly
                    value={extractedText}
                    className="flex-1 min-h-[350px] font-mono text-sm rounded-xl p-4 bg-muted/10 border"
                  />
                  <div className="text-center p-2 bg-green-500/10 rounded-xl flex items-center justify-center gap-2 text-green-600 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4" /> OCR extraction completed successfully
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40 my-auto">
                  <FileText className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Extraction</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our OCR Text Extractor?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our OCR Text Extractor is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Extract editable text from screenshots or images.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the OCR Text Extractor tool on UseBro.</li>
                        <li>Input your parameters or upload the required file in the field controls.</li>
                        <li>Wait for the tool to process the details dynamically in your browser.</li>
                        <li>Click download, save, or copy the final outputs to your device.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the OCR Text Extractor tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this OCR Text Extractor upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use OCR Text Extractor on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
