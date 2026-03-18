
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, VenetianMask } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { scrollToDownload } from '@/lib/utils';

const textSchema = z.object({
  text: z.string(),
});

const upiSchema = z.object({
  upiId: z.string().trim().min(1, 'UPI ID is required.'),
  payeeName: z.string().optional(),
  amount: z.string().optional(),
  transactionNote: z.string().optional(),
});

type TextFormValues = z.infer<typeof textSchema>;
type UpiFormValues = z.infer<typeof upiSchema>;

export default function QrGeneratorPage() {
  const [qrType, setQrType] = useState<'text' | 'upi'>('text');
  const [qrValue, setQrValue] = useState('https://fixbro.in');
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const textForm = useForm<TextFormValues>({
    resolver: zodResolver(textSchema),
    defaultValues: { text: '' },
    mode: 'onChange',
  });

  const upiForm = useForm<UpiFormValues>({
    resolver: zodResolver(upiSchema),
    defaultValues: { upiId: '', payeeName: '', amount: '', transactionNote: '' },
    mode: 'onChange',
  });
  
  const textValue = useWatch({ control: textForm.control, name: 'text' });
  const upiValues = useWatch({ control: upiForm.control });

  useEffect(() => {
    if (qrType === 'text') {
      setQrValue(textValue);
      if (textValue) scrollToDownload();
    }
  }, [qrType, textValue]);
  
  useEffect(() => {
     if (qrType === 'upi') {
      if (!upiValues.upiId) {
        setQrValue('');
        return;
      }
      const params = new URLSearchParams({
        pa: upiValues.upiId,
        pn: upiValues.payeeName || '',
      });
      if (upiValues.amount) {
        params.set('am', upiValues.amount);
      }
      if (upiValues.transactionNote) {
        params.set('tn', upiValues.transactionNote);
      }
      setQrValue(`upi://pay?${params.toString()}`);
      scrollToDownload();
    }
  }, [qrType, upiValues]);

  const downloadQRCode = useCallback(() => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  }, []);
  
  const isFormValid = qrType === 'text' ? textForm.formState.isValid : upiForm.formState.isValid;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">QR Code Generator</CardTitle>
          <CardDescription>
            Enter any text, URL, or UPI details to generate a downloadable QR code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={qrType} onValueChange={(v) => setQrType(v as 'text' | 'upi')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text / URL</TabsTrigger>
              <TabsTrigger value="upi">UPI Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="pt-4">
               <Form {...textForm}>
                  <form>
                    <FormField
                      control={textForm.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="text-input">Text or URL</Label>
                            <FormControl>
                              <Input id="text-input" placeholder="Enter text or URL" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </form>
               </Form>
            </TabsContent>
            <TabsContent value="upi" className="pt-4">
              <Form {...upiForm}>
                  <form className="space-y-4 rounded-lg border p-4">
                      <h3 className="font-medium">UPI Details</h3>
                      <FormField
                          control={upiForm.control}
                          name="upiId"
                          render={({ field }) => (
                              <FormItem>
                                  <Label>UPI ID (VPA) <span className="text-destructive">*</span></Label>
                                  <FormControl><Input placeholder="name@bank" {...field} /></FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={upiForm.control}
                          name="payeeName"
                          render={({ field }) => (
                              <FormItem>
                                  <Label>Payee Name</Label>
                                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={upiForm.control}
                          name="amount"
                          render={({ field }) => (
                              <FormItem>
                                  <Label>Amount (₹)</Label>
                                  <FormControl><Input type="number" placeholder="100.50" {...field} /></FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={upiForm.control}
                          name="transactionNote"
                          render={({ field }) => (
                              <FormItem>
                                  <Label>Transaction Note</Label>
                                  <FormControl><Input placeholder="For goods" maxLength={100} {...field} /></FormControl>
                                  <FormMessage/>
                              </FormItem>
                          )}
                      />
                  </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          {qrValue && (
            <div className="space-y-2 text-center">
              <Label>Generated QR Code</Label>
              <div
                ref={qrCodeRef}
                className="mx-auto flex justify-center rounded-lg border bg-white p-4"
                style={{ width: 'fit-content' }}
              >
                <QRCode
                  value={qrValue}
                  size={256}
                  level="H"
                  includeMargin
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button id="download-section" onClick={downloadQRCode} disabled={!qrValue || !isFormValid}>
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </CardFooter>
      </Card>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our QR Code Generator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold mb-2">Versatile Formats</h3>
              <p>Create QR codes for a wide range of uses, including website URLs, plain text, or even pre-filled UPI payment details. Our tool adapts to your specific needs instantly.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">High-Resolution Downloads</h3>
              <p>Download your generated QR codes in high-quality PNG format. They are crisp and clear, making them perfect for both digital displays and high-quality print materials.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Completely Free</h3>
              <p>Enjoy unlimited QR code generation without any hidden costs, watermarks, or account registrations. Our tool is 100% free for everyone to use.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p>We prioritize your privacy. All QR codes are generated locally within your web browser. We never store or transmit the data you use to create your codes.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I create a QR code?</h3>
              <p>Simply select the type of QR code you want to create (Text/URL or UPI), fill in the necessary information, and the QR code will appear instantly. Click the "Download" button to save it to your device.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What is a UPI QR code?</h3>
              <p>A UPI QR code is a specialized code that stores payment information. When scanned with a UPI-enabled app like Google Pay or PhonePe, it automatically fills in the payee details and amount for a quick transaction.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Will my QR code ever expire?</h3>
              <p>No, the QR codes generated by our tool are static. They contain the information directly and will continue to work as long as the information they point to (like a URL) is still active.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I use these QR codes for commercial purposes?</h3>
              <p>Yes, you are free to use the QR codes generated by our tool for any purpose, including marketing, business cards, product packaging, or commercial signage.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
