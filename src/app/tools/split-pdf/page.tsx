'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, X, ShieldCheck, Zap } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [pageRange, setPageRange] = useState<string>('');
  const [generatedUrls, setGeneratedUrls] = useState<{ name: string; url: string; blob: Blob }[]>([]);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast({ title: "Invalid file type", description: "Only PDF files are allowed.", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
      setFile(selectedFile);
      setGeneratedUrls([]);
    } catch (error) {
      console.error(error);
      toast({ title: "Error loading PDF", description: "Failed to read the PDF structure.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const parseRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, maxPages));
          const e = Math.max(1, Math.min(end, maxPages));
          const min = Math.min(s, e);
          const max = Math.max(s, e);
          for (let i = min; i <= max; i++) {
            pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const val = parseInt(trimmed, 10);
        if (!isNaN(val) && val >= 1 && val <= maxPages) {
          pages.add(val - 1);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || pageCount === 0) return;

    setIsLoading(true);
    try {
      const fileArrayBuffer = await file.arrayBuffer();
      const results: { name: string; url: string; blob: Blob }[] = [];

      if (splitMode === 'all') {
        // Split each page into its own PDF
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const sourcePdf = await PDFDocument.load(fileArrayBuffer, { ignoreEncryption: true });
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(copiedPage);

          const bytes = await newPdf.save();
          const blob = new Blob([bytes], { type: 'application/pdf' });
          results.push({
            name: `${file.name.replace(/\.pdf$/i, '')}-page-${i + 1}.pdf`,
            url: URL.createObjectURL(blob),
            blob: blob,
          });
        }
      } else {
        // Split specific page range
        const pageIndices = parseRange(pageRange, pageCount);
        if (pageIndices.length === 0) {
          toast({ title: "Invalid Range", description: "Please specify valid pages or ranges (e.g. 1-3, 5).", variant: "destructive" });
          setIsLoading(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const sourcePdf = await PDFDocument.load(fileArrayBuffer, { ignoreEncryption: true });
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        results.push({
          name: `${file.name.replace(/\.pdf$/i, '')}-extracted-pages.pdf`,
          url: URL.createObjectURL(blob),
          blob: blob,
        });
      }

      setGeneratedUrls(results);
      toast({ title: "PDF Split Successful!" });
      scrollToDownload();
    } catch (error) {
      console.error(error);
      toast({ title: "Split Failed", description: "An error occurred during PDF processing.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAllAsZip = async () => {
    if (generatedUrls.length === 0) return;
    const zip = new JSZip();
    
    generatedUrls.forEach((item) => {
      zip.file(item.name, item.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${file?.name.replace(/\.pdf$/i, '')}-split-pages.zip`);
  };

  return (<>
      <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <FileText className="h-6 w-6 text-primary" /> PDF SPLITTER
              </CardTitle>
              <CardDescription>Upload a PDF file and specify how you want to split or extract pages.</CardDescription>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 border rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm font-bold truncate max-w-xs">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{pageCount} Pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => { setFile(null); setGeneratedUrls([]); }} className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></Button>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-wider">Split Strategy</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setSplitMode('all')}
                        className={`p-4 border rounded-2xl text-left transition-all ${splitMode === 'all' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                      >
                        <p className="font-bold text-sm">Split all pages</p>
                        <p className="text-xs text-muted-foreground">Extracts every single page into separate files.</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSplitMode('range')}
                        className={`p-4 border rounded-2xl text-left transition-all ${splitMode === 'range' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                      >
                        <p className="font-bold text-sm">Custom Ranges</p>
                        <p className="text-xs text-muted-foreground">Specify exact pages or page intervals to extract.</p>
                      </button>
                    </div>
                  </div>

                  {splitMode === 'range' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider">Page Ranges</Label>
                      <Input
                        placeholder="e.g. 1-3, 5, 8-10"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                        className="rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">Use commas to separate pages/ranges, and hyphens for range intervals. Max pages: {pageCount}.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {file && (
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleSplit} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                  SPLIT DOCUMENT
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
              {generatedUrls.length > 0 ? (
                <div id="download-section" className="space-y-6 w-full animate-in fade-in zoom-in duration-500">
                  <div className="text-center">
                    <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                      <ShieldCheck className="h-10 w-10 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tight">SPLIT COMPLETE</h3>
                    <p className="text-xs text-muted-foreground mt-1">Generated {generatedUrls.length} new PDF document(s).</p>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border rounded-xl p-4 bg-muted/10">
                    {generatedUrls.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-xl bg-card">
                        <span className="text-xs font-semibold truncate max-w-[200px]">{item.name}</span>
                        <a href={item.url} download={item.name} className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline">
                          <Download className="h-3 w-3" /> Download
                        </a>
                      </div>
                    ))}
                  </div>

                  {generatedUrls.length > 1 && (
                    <Button onClick={downloadAllAsZip} className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD ALL AS ZIP
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <FileText className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting PDF Split</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Split PDF?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Split PDF is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Extract specific pages or split PDF into pages.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Split PDF tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Split PDF tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Split PDF upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Split PDF on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
