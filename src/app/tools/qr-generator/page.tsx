
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
    defaultValues: { text: 'https://fixbro.in' },
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
        <Button onClick={downloadQRCode} disabled={!qrValue || !isFormValid}>
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </CardFooter>
    </Card>
  );
}
