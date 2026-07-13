'use client';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, X, Zap, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { scrollToDownload } from '@/lib/utils';

export default function ResumeBuilderPage() {
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [address, setAddress] = useState('New York, NY');
  const [summary, setSummary] = useState('Experienced software engineer specializing in building modern responsive web applications using React, Next.js, and Node.js.');
  const [experience, setExperience] = useState('Lead Frontend Developer at Tech Corp (2023 - Present)\n- Built responsive SaaS web dashboards.\n- Led team of 4 frontend engineers.\n\nSoftware Engineer at Startup Co (2021 - 2023)\n- Maintained primary customer-facing websites.');
  const [education, setEducation] = useState('B.S. in Computer Science\nState University (2017 - 2021)');
  const [skills, setSkills] = useState('React, Next.js, TypeScript, JavaScript, CSS, HTML, Node.js, Git, SQL');

  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    setIsLoading(true);
    try {
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm',
      });

      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let cursorY = 20;

      // 1. Header Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(fullName, margin, cursorY);
      cursorY += 8;

      // Contact details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const contactInfo = `${email} | ${phone} | ${address}`;
      doc.text(contactInfo, margin, cursorY);
      cursorY += 6;

      // Horizontal divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, cursorY, 210 - margin, cursorY);
      cursorY += 8;

      const drawSection = (title: string, content: string) => {
        if (cursorY + 30 > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }

        // Section Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(41, 171, 226); // primary blue
        doc.text(title.toUpperCase(), margin, cursorY);
        cursorY += 6;

        // Content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);

        const lines = doc.splitTextToSize(content, 170);
        lines.forEach((line: string) => {
          if (cursorY + 6 > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
          }
          doc.text(line, margin, cursorY);
          cursorY += 5.5;
        });

        cursorY += 6; // gap after section
      };

      if (summary) drawSection('Professional Summary', summary);
      if (experience) drawSection('Work Experience', experience);
      if (education) drawSection('Education', education);
      if (skills) drawSection('Skills', skills);

      const pdfBytes = doc.output('arraybuffer');
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      toast({ title: 'Resume Created Successfully!' });
      scrollToDownload();
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to build resume', description: 'Failed to generate PDF layout.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form fields */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <FileText className="h-6 w-6 text-primary" /> RESUME BUILDER
              </CardTitle>
              <CardDescription>Fill out your details to compile a clean, modern resume PDF client-side.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="addr">Address / Location</Label>
                  <Input id="addr" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="sum">Professional Summary</Label>
                  <Textarea id="sum" value={summary} onChange={(e) => setSummary(e.target.value)} className="h-20" />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="exp">Work Experience</Label>
                  <Textarea id="exp" value={experience} onChange={(e) => setExperience(e.target.value)} className="h-28" />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edu">Education</Label>
                  <Textarea id="edu" value={education} onChange={(e) => setEducation(e.target.value)} className="h-20" />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="skill">Skills (comma separated)</Label>
                  <Input id="skill" value={skills} onChange={(e) => setSkills(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
              <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                COMPILE RESUME PDF
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Download area */}
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
                  <h3 className="text-xl font-black italic tracking-tight">RESUME CREATED</h3>
                  <a href={pdfUrl} download="resume.pdf" className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD PDF RESUME
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <FileText className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Sizing & Render</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Resume Builder?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Resume Builder is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Compile single-page styled PDF resumes.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Resume Builder tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Resume Builder tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Resume Builder upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Resume Builder on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
