
'use client';
import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, X, MoveUp, MoveDown, Trash2, ShieldCheck, Zap, Globe } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast({ title: "Invalid files detected", description: "Only PDF files are allowed.", variant: "destructive" });
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
    setMergedPdfUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
    setMergedPdfUrl(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast({ title: "Too few files", description: "Please select at least two PDF files to merge.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      setMergedPdfUrl(URL.createObjectURL(blob));
      toast({ title: "PDFs Merged Successfully!" });
      scrollToDownload();
    } catch (error) {
      console.error(error);
      toast({ title: "Merge Failed", description: "An error occurred while merging the PDFs.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMerged = () => {
    if (mergedPdfUrl) {
      const a = document.createElement('a');
      a.href = mergedPdfUrl;
      a.download = `merged-document-${Date.now()}.pdf`;
      a.click();
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 🛠 Left: File Management */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black"><FileText className="h-5 w-5 text-primary" /> PDF MANAGER</CardTitle>
              <CardDescription>Upload and arrange the order of your PDF files.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/20 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileText className="w-8 h-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                            <p className="text-sm font-bold uppercase italic tracking-tighter">Click to upload PDFs</p>
                        </div>
                        <input type="file" multiple accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 bg-card border rounded-2xl shadow-sm group animate-in slide-in-from-left-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="bg-primary/10 p-2 rounded-lg text-primary font-black text-xs">{index + 1}</div>
                                <span className="text-sm font-medium truncate italic">{file.name}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button size="icon" variant="ghost" onClick={() => moveFile(index, 'up')} disabled={index === 0} className="h-8 w-8"><MoveUp className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="h-8 w-8"><MoveDown className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" onClick={() => removeFile(index)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                    {files.length === 0 && (
                        <div className="text-center py-10 opacity-30 border-2 border-dashed rounded-2xl">
                            <p className="text-sm font-bold italic uppercase tracking-widest">No files selected yet</p>
                        </div>
                    )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6">
                <Button 
                    className="w-full h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20" 
                    onClick={mergePDFs} 
                    disabled={files.length < 2 || isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                    MERGE {files.length} DOCUMENTS
                </Button>
            </CardFooter>
          </Card>
        </div>

        {/* 🖥 Right: Result & Preview */}
        <div className="lg:col-span-5">
            <Card className="shadow-lg border-primary/10 h-full flex flex-col">
                <CardHeader className="bg-muted/50 border-b">
                    <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Download Area</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-10 min-h-[300px]">
                    {mergedPdfUrl ? (
                        <div id="download-section" className="space-y-8 animate-in fade-in zoom-in duration-500 flex flex-col items-center w-full">
                            <div className="h-48 w-40 bg-white rounded-xl shadow-2xl border-t-[12px] border-primary flex items-center justify-center relative group">
                                <FileText className="h-20 w-20 text-primary/20 group-hover:scale-110 transition-transform" />
                                <div className="absolute top-2 right-2 bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded">PDF</div>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="font-black italic text-xl uppercase tracking-tighter text-emerald-600">Document Ready</h3>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">PRO BROWSER RENDER</p>
                            </div>
                            <Button onClick={downloadMerged} variant="default" size="lg" className="w-full rounded-2xl bg-green-600 hover:bg-green-700 shadow-xl h-16 text-lg font-black italic">
                                <Download className="mr-2 h-6 w-6" /> DOWNLOAD MERGED PDF
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 opacity-30">
                            <div className="h-40 w-40 border-4 border-dashed rounded-3xl mx-auto flex items-center justify-center">
                                <Globe className="h-16 w-16" />
                            </div>
                            <p className="font-bold italic uppercase tracking-tighter">Your merged file will appear here</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>

      {/* 🚀 SEO & INFO */}
      <section className="mt-20 space-y-12">
        <div className="text-center space-y-4">
            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-primary/20">Client-Side Logic</span>
            <h2 className="text-5xl font-black italic tracking-tighter uppercase">THE FASTER WAY TO MERGE</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Stop waiting for slow cloud uploads. Merge your sensitive documents directly in your browser with 100% privacy guaranteed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-primary/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40"><ShieldCheck className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase">Privacy First</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Unlike other online converters, we never upload your files to our servers. Your documents stay on your device throughout the entire process.</p>
            </div>
            <div className="bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-orange-500/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-500/40"><Zap className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase">Instant Speed</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">By processing the files locally using your browser's power, merging is nearly instantaneous, even for large documents with hundreds of pages.</p>
            </div>
            <div className="bg-card border border-border/50 p-10 rounded-[3rem] space-y-6 hover:border-emerald-500/30 transition-all hover:shadow-2xl">
                <div className="h-16 w-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/40"><MoveUp className="h-8 w-8" /></div>
                <h3 className="text-2xl font-black italic tracking-tight uppercase">Full Control</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Easily reorder pages and files with our intuitive manager. Add as many PDFs as you need and arrange them in the perfect sequence.</p>
            </div>
        </div>
      </section>
    </div>
  );
}
