'use client';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, X, ShieldCheck, Zap } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';
import JSZip from 'jszip';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function WordToPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState<'helvetica' | 'times' | 'courier'>('helvetica');
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const { toast } = useToast();

  const parseDocx = async (docxFile: File): Promise<string> => {
    const docxToArrayBuffer = await docxFile.arrayBuffer();
    const zip = await JSZip.loadAsync(docxToArrayBuffer);
    const docXml = await zip.file("word/document.xml")?.async("string");
    if (!docXml) throw new Error("Could not find document.xml");

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(docXml, "text/xml");
    const paragraphs = xmlDoc.getElementsByTagName("w:p");
    let parsedText = "";

    for (let i = 0; i < paragraphs.length; i++) {
      const runs = paragraphs[i].getElementsByTagName("w:t");
      let paraText = "";
      for (let j = 0; j < runs.length; j++) {
        paraText += runs[j].textContent || "";
      }
      parsedText += paraText + "\n";
    }

    return parsedText.trim();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (extension !== 'txt' && extension !== 'docx') {
      toast({ title: "Invalid file format", description: "Please upload a .txt or .docx file.", variant: "destructive" });
      return;
    }

    setFile(selectedFile);
    setPdfUrl(null);
    setIsLoading(true);

    try {
      if (extension === 'txt') {
        const textContent = await selectedFile.text();
        setText(textContent);
      } else {
        const parsedText = await parseDocx(selectedFile);
        setText(parsedText);
      }
      toast({ title: "File loaded successfully!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error parsing file", description: "Failed to read text contents.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = () => {
    if (!text.trim()) {
      toast({ title: "Empty content", description: "Please paste text or load a file first.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const doc = new jsPDF({
        format: pageSize,
        unit: 'mm',
      });

      doc.setFont(fontFamily);
      doc.setFontSize(11);

      const margin = 20; // 20mm margins
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxLineWidth = pageWidth - (margin * 2);
      const maxPageHeight = pageHeight - (margin * 2);

      // Split text into lines
      const splitText = doc.splitTextToSize(text, maxLineWidth);
      let cursorY = margin;

      splitText.forEach((line: string) => {
        if (cursorY + 6 > maxPageHeight + margin) {
          doc.addPage();
          doc.setFont(fontFamily);
          doc.setFontSize(11);
          cursorY = margin;
        }
        doc.text(line, margin, cursorY);
        cursorY += 6; // line spacing
      });

      const pdfBytes = doc.output('arraybuffer');
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      toast({ title: "PDF Created successfully!" });
      scrollToDownload();
    } catch (error) {
      console.error(error);
      toast({ title: "Conversion Failed", description: "Failed to build the PDF document.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
      <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <FileText className="h-6 w-6 text-primary" /> WORD TO PDF CONVERTER
              </CardTitle>
              <CardDescription>Convert text files (.txt) or Word files (.docx) into standard PDF layouts.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Font Style</Label>
                  <Select value={fontFamily} onValueChange={(val: any) => setFontFamily(val)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="helvetica">Arial/Helvetica (Sans)</SelectItem>
                      <SelectItem value="times">Times New Roman (Serif)</SelectItem>
                      <SelectItem value="courier">Courier (Monospace)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Page Format</Label>
                  <Select value={pageSize} onValueChange={(val: any) => setPageSize(val)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4 Page Size</SelectItem>
                      <SelectItem value="letter">Letter Page Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!file ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/20 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                      <FileText className="w-8 h-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold uppercase italic">Upload .txt or .docx file</p>
                    </div>
                    <input type="file" accept=".txt,.docx" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-2xl">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="text-xs font-bold truncate max-w-xs">{file.name}</span>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => { setFile(null); setText(''); setPdfUrl(null); }} className="h-6 w-6 text-destructive"><X className="h-3 w-3" /></Button>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider">Document Text Content</Label>
                <Textarea
                  value={text}
                  onChange={(e) => { setText(e.target.value); setPdfUrl(null); }}
                  placeholder="Paste or write your document text here..."
                  className="min-h-[250px] font-mono text-sm rounded-xl p-4 bg-background border"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
              <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleConvert} disabled={isLoading || !text.trim()}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                CONVERT TO PDF
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Download Area</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-10 min-h-[300px]">
              {pdfUrl ? (
                <div id="download-section" className="space-y-6 w-full animate-in fade-in zoom-in duration-500 text-center">
                  <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                    <ShieldCheck className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight">CONVERSION COMPLETE</h3>
                  <p className="text-xs text-muted-foreground mt-1">Successfully compiled text into PDF.</p>
                  <a href={pdfUrl} download={`${file ? file.name.replace(/\.[a-z0-9]+$/i, '') : 'document'}.pdf`} className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD PDF DOCUMENT
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
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
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Word to PDF Converter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Word to PDF Converter is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Convert text documents or docx into PDF files.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Word to PDF Converter tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Word to PDF Converter tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Word to PDF Converter upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Word to PDF Converter on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
