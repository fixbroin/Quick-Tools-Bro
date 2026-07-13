'use client';
import { useState, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, X, ShieldCheck, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { scrollToDownload } from '@/lib/utils';
import { jsPDF } from 'jspdf';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quality, setQuality] = useState(60); // Default compression quality (0-100)
  const [compressedFile, setCompressedFile] = useState<{ url: string; size: number; name: string } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({ title: 'Invalid file type', description: 'Please upload a PDF file.', variant: 'destructive' });
        return;
      }
      setFile(selectedFile);
      setCompressedFile(null);
    }
  };

  const handleCompress = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Load using pdfjs-dist
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        compress: true,
      });

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        // We use a responsive viewport scale based on quality slider to reduce dimensions if high compression is needed
        const scale = quality < 30 ? 1.0 : quality < 70 ? 1.5 : 2.0; 
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const imgData = canvas.toDataURL('image/jpeg', quality / 100);
        
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        
        if (i > 1) {
          doc.addPage();
        }
        
        doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      const compressedPdfBytes = doc.output('arraybuffer');
      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      
      // If the compressed size is actually larger than original, warn the user but let them download
      setCompressedFile({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: `${file.name.replace(/\.pdf$/i, '')}-compressed.pdf`,
      });

      toast({ title: 'PDF Compressed Successfully!' });
      scrollToDownload();
    } catch (error) {
      console.error(error);
      toast({ title: 'Compression Failed', description: 'Failed to compress PDF.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [file, quality, toast]);

  return (<>
      <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <FileText className="h-6 w-6 text-primary" /> PDF COMPRESSOR
              </CardTitle>
              <CardDescription>Upload a PDF file and adjust the compression slider to optimize file size.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {!file ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/20 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold uppercase italic">Click to upload PDF</p>
                    </div>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 border rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm font-bold truncate max-w-xs">{file.name}</p>
                        <p className="text-xs text-muted-foreground">Original size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => { setFile(null); setCompressedFile(null); }} className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-bold uppercase tracking-wider">Compression Level (Image Quality)</Label>
                      <span className="text-sm font-bold text-primary">{quality}%</span>
                    </div>
                    <Slider
                      value={[quality]}
                      onValueChange={(vals) => setQuality(vals[0])}
                      min={10}
                      max={90}
                      step={5}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>High Compression (Low Quality)</span>
                      <span>Low Compression (High Quality)</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            {file && (
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleCompress} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                  COMPRESS DOCUMENT
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Download Area</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-10 min-h-[300px]">
              {compressedFile ? (
                <div id="download-section" className="space-y-6 w-full animate-in fade-in zoom-in duration-500 text-center">
                  <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                    <ShieldCheck className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight">COMPRESSION COMPLETE</h3>
                  <div className="my-4 space-y-1 text-sm bg-muted/20 p-4 border rounded-2xl">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Original size:</span>
                      <span className="font-bold">{(file!.size / 1024 / 1024).toFixed(2)} MB</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Compressed size:</span>
                      <span className="font-bold text-green-600">{(compressedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </p>
                    <p className="flex justify-between border-t pt-2 mt-2 font-bold text-xs uppercase tracking-wider text-primary">
                      <span>Size Saved:</span>
                      <span>{Math.max(0, ((file!.size - compressedFile.size) / file!.size) * 100).toFixed(1)}%</span>
                    </p>
                  </div>
                  <a href={compressedFile.url} download={compressedFile.name} className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD COMPRESSED PDF
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <FileText className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Compression</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Compress PDF?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Compress PDF is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Optimize and shrink the file size of PDFs.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Compress PDF tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Compress PDF tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Compress PDF upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Compress PDF on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
