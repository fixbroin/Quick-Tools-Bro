'use client';
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { decryptPDF, isEncrypted as checkIsEncrypted } from '@pdfsmaller/pdf-decrypt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, X, ShieldCheck, Unlock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

export default function PasswordUnlockerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [unlockedFileName, setUnlockedFileName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast({ title: "Invalid file type", description: "Only PDF files are allowed.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setDownloadUrl(null);
    setPassword('');
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const info = await checkIsEncrypted(uint8Array);
      if (info.encrypted) {
        setIsEncrypted(true);
        toast({ title: "PDF is Encrypted", description: "This document requires a password to unlock." });
      } else {
        setIsEncrypted(false);
        toast({ title: "PDF is not encrypted", description: "This document does not require a password." });
      }
      setFile(selectedFile);
    } catch (error) {
      console.error(error);
      toast({ title: "Error loading PDF", description: "Failed to read the PDF structure.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let decryptedBytes: any = uint8Array;

      if (isEncrypted) {
        if (!password) {
          toast({ title: "Password Required", description: "Please enter the password for this PDF.", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        // Decrypt PDF using the provided password
        decryptedBytes = await decryptPDF(uint8Array, password);
      }

      // Re-load the decrypted PDF using pdf-lib to save it cleanly
      const pdfDoc = await PDFDocument.load(decryptedBytes, { ignoreEncryption: true });
      const unlockedBytes = await pdfDoc.save();
      const blob = new Blob([unlockedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setUnlockedFileName(`${file.name.replace(/\.pdf$/i, '')}-unlocked.pdf`);
      setDownloadUrl(url);
      toast({ title: "PDF Unlocked Successfully!" });
      scrollToDownload();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Unlock Failed",
        description: isEncrypted ? "Incorrect password or corrupted PDF file." : "Failed to decrypt the PDF document.",
        variant: "destructive"
      });
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
                <Unlock className="h-6 w-6 text-primary" /> PDF PASSWORD UNLOCKER
              </CardTitle>
              <CardDescription>Upload a password-protected PDF, enter its password, and save a completely unlocked version.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {!file ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/20 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-10 h-10 mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold uppercase italic">Click to upload encrypted PDF</p>
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
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB • {isEncrypted ? 'Locked 🔒' : 'Unlocked 🔓'}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => { setFile(null); setDownloadUrl(null); setPassword(''); }} className="h-8 w-8 text-destructive"><X className="h-4 w-4" /></Button>
                  </div>

                  {isEncrypted && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                      <Label className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5"><KeyRound className="h-4 w-4 text-primary" /> Enter PDF Password</Label>
                      <div className="relative mt-1">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter decryption password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-xl pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            {file && (
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleUnlock} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Unlock className="mr-2 h-5 w-5" />}
                  UNLOCK PDF DOCUMENT
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
              {downloadUrl ? (
                <div id="download-section" className="space-y-6 w-full text-center animate-in fade-in zoom-in duration-500">
                  <div>
                    <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                      <ShieldCheck className="h-10 w-10 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tight">DECRYPTION SUCCESSFUL</h3>
                    <p className="text-xs text-muted-foreground mt-1">The PDF password was removed successfully.</p>
                  </div>

                  <Button asChild className="w-full h-12 rounded-xl font-bold shadow-md shadow-primary/10">
                    <a href={downloadUrl} download={unlockedFileName}>
                      DOWNLOAD UNLOCKED PDF <Download className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Unlock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-semibold">Upload an encrypted PDF and process it to activate the download area.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our PDF Password Unlocker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">100% Free & Secure:</strong> Our PDF Password Unlocker is 100% free and processes documents completely in your web browser. Your confidential passwords and files never leave your device.
                    </p>
                    <p>
                        Easily decrypt files to copy text, print sheets, or edit contents without typing the password every time.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Upload your password-protected PDF file.</li>
                        <li>Enter the correct password in the input field.</li>
                        <li>Click "Unlock PDF Document".</li>
                        <li>Download the decrypted, password-free PDF.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is this tool free?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does it upload my file to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee complete security and privacy, all processing is performed locally inside your web browser. Your private file and password never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I unlock a PDF if I don't know the password?</h4>
                    <p className="text-muted-foreground text-sm">No. For security and legal reasons, this utility requires you to know the password to load and decrypt the PDF document.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
