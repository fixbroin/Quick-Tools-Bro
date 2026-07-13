'use client';
import { useState, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, X, ShieldCheck, Copy, Zap } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';
import { saveAs } from 'file-saver';
import { Textarea } from '@/components/ui/textarea';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({ title: 'Invalid file type', description: 'Please upload a PDF file.', variant: 'destructive' });
        return;
      }
      setFile(selectedFile);
      setExtractedText('');
    }
  };

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += `--- PAGE ${i} ---\n\n${pageText}\n\n`;
      }

      setExtractedText(fullText.trim());
      toast({ title: 'Text Extracted Successfully!' });
      scrollToDownload();
    } catch (error) {
      console.error(error);
      toast({ title: 'Extraction Failed', description: 'Could not extract text from this PDF.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [file, toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast({ title: 'Copied to Clipboard!' });
  };

  const downloadAsDoc = () => {
    // Generate a basic HTML format doc file that MS Word parses perfectly as docx/doc
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Document</title><style>body { font-family: Arial; }</style></head><body>";
    const footer = "</body></html>";
    // Replace newlines with breaks
    const formattedText = extractedText.replace(/\n/g, '<br>');
    const sourceHtml = header + formattedText + footer;
    
    const fileBuffer = new ArrayBuffer(sourceHtml.length);
    const view = new Uint8Array(fileBuffer);
    for (let i = 0; i < sourceHtml.length; i++) {
      view[i] = sourceHtml.charCodeAt(i) & 0xff;
    }
    
    const blob = new Blob([fileBuffer], { type: 'application/msword' });
    saveAs(blob, `${file?.name.replace(/\.pdf$/i, '')}.doc`);
  };

  return (<>
      <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <FileText className="h-6 w-6 text-primary" /> PDF TO WORD CONVERTER
              </CardTitle>
              <CardDescription>Extract all textual data from your PDF files and download as an editable Word document.</CardDescription>
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
                        <p className="text-xs text-muted-foreground">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => { setFile(null); setExtractedText(''); }} className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </CardContent>
            {file && (
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleConvert} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                  EXTRACT & CONVERT
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b flex flex-row justify-between items-center px-6">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Extracted Text</CardTitle>
              {extractedText && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 rounded-lg"><Copy className="h-3 w-3 mr-1" /> Copy</Button>
                  <Button size="sm" variant="outline" onClick={downloadAsDoc} className="h-8 rounded-lg bg-green-50/50 dark:bg-green-950/20 text-green-600 border-green-200"><Download className="h-3 w-3 mr-1" /> Word</Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-6 min-h-[300px]">
              {extractedText ? (
                <div id="download-section" className="space-y-4 w-full flex-1 flex flex-col animate-in fade-in zoom-in duration-500">
                  <Textarea
                    readOnly
                    value={extractedText}
                    className="flex-1 min-h-[350px] font-mono text-xs rounded-xl p-4 bg-muted/10 border"
                  />
                  <div className="text-center p-2 bg-green-500/10 rounded-xl flex items-center justify-center gap-2 text-green-600 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4" /> Ready to download as Word document (.doc)
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40 my-auto">
                  <FileText className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Conversion</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our PDF to Word Converter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our PDF to Word Converter is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Extract editable text from PDFs as a Word doc.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the PDF to Word Converter tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the PDF to Word Converter tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this PDF to Word Converter upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use PDF to Word Converter on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
