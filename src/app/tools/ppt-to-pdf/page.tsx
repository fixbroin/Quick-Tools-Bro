'use client';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Image as ImageIcon, X, MoveUp, MoveDown, Trash2, ShieldCheck, Zap } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';
import Image from 'next/image';

interface SlideImage {
  file: File;
  previewUrl: string;
}

export default function PPTToPDFPage() {
  const [slides, setSlides] = useState<SlideImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length !== selectedFiles.length) {
      toast({ title: "Invalid files", description: "Only image files (PNG/JPG) are allowed as slides.", variant: "destructive" });
    }

    const newSlides = imageFiles.map(file => ({
      file: file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSlides(prev => [...prev, ...newSlides]);
    setPdfUrl(null);
  };

  const removeSlide = (index: number) => {
    URL.revokeObjectURL(slides[index].previewUrl);
    setSlides(prev => prev.filter((_, i) => i !== index));
    setPdfUrl(null);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    
    const newSlides = [...slides];
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    setSlides(newSlides);
    setPdfUrl(null);
  };

  const handleConvert = async () => {
    if (slides.length === 0) {
      toast({ title: "No slides", description: "Please upload at least one slide image.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4', // landscape A4 slide aspect ratio
      });

      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        // Helper to load image data URL
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(slide.file);
        });

        if (i > 0) {
          doc.addPage();
        }

        // Draw image stretching to fit standard landscape viewport
        doc.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      const pdfBytes = doc.output('arraybuffer');
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      toast({ title: "Slides compiled to PDF successfully!" });
      scrollToDownload();
    } catch (error) {
      console.error(error);
      toast({ title: "Conversion Failed", description: "Could not compile slides into a PDF file.", variant: "destructive" });
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
                <ImageIcon className="h-6 w-6 text-primary" /> PRESENTATION TO PDF
              </CardTitle>
              <CardDescription>Compile image slide decks (slides saved as images) or layouts into a landscape PDF file.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/20 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-3 pb-4">
                    <ImageIcon className="w-8 h-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-bold uppercase italic">Click to upload slide images</p>
                  </div>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {slides.map((slide, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-card border rounded-2xl shadow-sm group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-primary/10 p-1.5 rounded-lg text-primary font-black text-xs">{index + 1}</div>
                      <div className="relative h-12 w-20 rounded-md overflow-hidden border">
                        <Image src={slide.previewUrl} alt={`Slide ${index + 1}`} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-semibold truncate max-w-[120px]">{slide.file.name}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="h-7 w-7"><MoveUp className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => moveSlide(index, 'down')} disabled={index === slides.length - 1} className="h-7 w-7"><MoveDown className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => removeSlide(index)} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                {slides.length === 0 && (
                  <div className="text-center py-10 opacity-30 border border-dashed rounded-2xl">
                    <p className="text-sm font-bold italic uppercase tracking-widest">No slides added yet</p>
                  </div>
                )}
              </div>
            </CardContent>
            {slides.length > 0 && (
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleConvert} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                  COMPILE {slides.length} SLIDES
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
              {pdfUrl ? (
                <div id="download-section" className="space-y-6 w-full animate-in fade-in zoom-in duration-500 text-center">
                  <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                    <ShieldCheck className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight">CONVERSION COMPLETE</h3>
                  <p className="text-xs text-muted-foreground mt-1">Successfully compiled slide deck into PDF.</p>
                  <a href={pdfUrl} download="presentation-slides.pdf" className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD PDF DECK
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <ImageIcon className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting slides compilation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Presentation to PDF?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Presentation to PDF is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Compile slideshow images/docs into slide deck PDFs.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Presentation to PDF tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Presentation to PDF tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Presentation to PDF upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Presentation to PDF on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
