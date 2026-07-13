'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw, Download, FileCode, Upload, ArrowRightLeft, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export default function Base64Page() {
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState('');
  const [base64ToFileString, setBase64ToFileString] = useState('');
  const [fileNameInput, setFileNameInput] = useState('download.bin');
  
  const { toast } = useToast();

  const handleTextProcess = () => {
    if (!textInput.trim()) return;
    try {
      if (mode === 'encode') {
        // UTF-8 base64 encoding helper
        const b64 = btoa(encodeURIComponent(textInput).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
        setTextOutput(b64);
        toast({ title: 'Text Encoded!' });
      } else {
        // base64 decoding helper
        const decoded = decodeURIComponent(atob(textInput).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        setTextOutput(decoded);
        toast({ title: 'Text Decoded!' });
      }
    } catch (err: any) {
      toast({ title: 'Conversion Failed', description: 'Invalid character set or base64 structure.', variant: 'destructive' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Strip data:image/png;base64, header
        const base64Data = result.split(',')[1] || result;
        setFileBase64(base64Data);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDownloadFile = () => {
    if (!base64ToFileString.trim()) return;
    try {
      // Extract data URI structure if present
      const cleanB64 = base64ToFileString.includes(',') ? base64ToFileString.split(',')[1] : base64ToFileString;
      const byteCharacters = atob(cleanB64.trim());
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });
      
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileNameInput;
      a.click();
      toast({ title: 'File downloaded successfully!' });
    } catch (err) {
      toast({ title: 'Failed to build file', description: 'Please check that you pasted a valid Base64 string.', variant: 'destructive' });
    }
  };

  const handleCopy = (val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    toast({ title: 'Copied to Clipboard!' });
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12">
            <TabsTrigger value="text" className="rounded-xl font-bold">Text Encoder / Decoder</TabsTrigger>
            <TabsTrigger value="file" className="rounded-xl font-bold">File Base64 Tool</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6 space-y-4">
                <Card className="shadow-lg border-primary/10 flex flex-col h-full">
                  <CardHeader className="bg-primary/5 border-b p-4">
                    <CardTitle className="flex items-center gap-2 italic font-black text-xl">
                      <FileCode className="h-5 w-5 text-primary" /> BASE64 TEXT INPUT
                    </CardTitle>
                    <CardDescription>Input standard text or base64 lines to parse.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <div className="flex gap-4 mb-4">
                      <Button
                        type="button"
                        variant={mode === 'encode' ? 'default' : 'outline'}
                        onClick={() => { setMode('encode'); setTextInput(''); setTextOutput(''); }}
                        className="flex-1 rounded-xl font-bold"
                      >
                        Encode
                      </Button>
                      <Button
                        type="button"
                        variant={mode === 'decode' ? 'default' : 'outline'}
                        onClick={() => { setMode('decode'); setTextInput(''); setTextOutput(''); }}
                        className="flex-1 rounded-xl font-bold"
                      >
                        Decode
                      </Button>
                    </div>
                    <Textarea
                      placeholder={mode === 'encode' ? 'Type standard text here...' : 'Paste Base64 encoded string here...'}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="min-h-[250px] font-mono text-sm rounded-xl p-4 bg-background border"
                    />
                  </CardContent>
                  <CardFooter className="bg-muted/30 p-4 border-t">
                    <Button onClick={handleTextProcess} className="w-full h-12 rounded-xl font-bold">
                      <ArrowRightLeft className="mr-2 h-4 w-4" /> CONVERT TEXT
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="md:col-span-6">
                <Card className="shadow-lg border-primary/10 h-full flex flex-col">
                  <CardHeader className="bg-muted/50 border-b flex flex-row justify-between items-center p-4">
                    <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Output Content</CardTitle>
                    {textOutput && (
                      <Button size="icon" variant="ghost" onClick={() => handleCopy(textOutput)} className="h-8 w-8 rounded-lg"><Copy className="h-4 w-4" /></Button>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 p-4 flex flex-col min-h-[300px]">
                    {textOutput ? (
                      <Textarea
                        readOnly
                        value={textOutput}
                        className="flex-1 min-h-[250px] font-mono text-sm rounded-xl p-4 bg-muted/10 border resize-none"
                      />
                    ) : (
                      <div className="text-center space-y-3 opacity-40 my-auto">
                        <FileCode className="h-16 w-16 mx-auto stroke-[1.5]" />
                        <p className="text-sm font-bold uppercase tracking-widest">Awaiting Conversion</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="file" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* File to Base64 */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-primary/5 border-b p-4">
                  <CardTitle className="font-bold text-lg">File to Base64 String</CardTitle>
                  <CardDescription>Upload any file to encode it into a Base64 string.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {!file ? (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 border-primary/20 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-3 pb-4">
                          <Upload className="w-8 h-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                          <p className="text-sm font-bold uppercase italic">Upload file</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-2xl">
                        <span className="text-xs font-bold truncate max-w-xs">{file.name}</span>
                        <Button size="icon" variant="ghost" onClick={() => { setFile(null); setFileBase64(''); }} className="h-7 w-7 text-destructive"><X className="h-4 w-4" /></Button>
                      </div>
                      
                      {fileBase64 && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold uppercase tracking-wider">Base64 Output</Label>
                            <Button size="sm" variant="outline" onClick={() => handleCopy(fileBase64)} className="h-8"><Copy className="h-3 w-3 mr-1" /> Copy</Button>
                          </div>
                          <Textarea readOnly value={fileBase64} className="h-32 font-mono text-xs rounded-xl bg-muted/10" />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Base64 to File */}
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-primary/5 border-b p-4">
                  <CardTitle className="font-bold text-lg">Base64 to File Download</CardTitle>
                  <CardDescription>Paste Base64 content and compile it back into a downloadable file.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="filename" className="text-xs font-bold uppercase tracking-wider">Output Filename</Label>
                    <Input
                      id="filename"
                      value={fileNameInput}
                      onChange={(e) => setFileNameInput(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="b64string" className="text-xs font-bold uppercase tracking-wider">Base64 String</Label>
                    <Textarea
                      id="b64string"
                      placeholder="Paste Base64 string here..."
                      value={base64ToFileString}
                      onChange={(e) => setBase64ToFileString(e.target.value)}
                      className="h-28 font-mono text-xs rounded-xl"
                    />
                  </div>

                  <Button onClick={handleDownloadFile} disabled={!base64ToFileString.trim()} className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                    <Download className="mr-2 h-4 w-4" /> RECONSTRUCT & DOWNLOAD FILE
                  </Button>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Base64 Converter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Base64 Converter is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Encode/decode text and file data to/from Base64.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Base64 Converter tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Base64 Converter tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Base64 Converter upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Base64 Converter on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
