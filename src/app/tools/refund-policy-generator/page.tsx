'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateRefundPolicy } from '@/ai/flows/refund-policy-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Download } from 'lucide-react';
import { saveAs } from 'file-saver';

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  websiteUrl: z.string().url('Please enter a valid URL.'),
  country: z.string().min(1, 'Country is required.'),
  state: z.string().min(1, 'State/Province is required.'),
  supportContact: z.string().min(1, 'Support contact is required.'),
  offerRefunds: z.enum(['Yes', 'No']),
  refundTimeframe: z.string().optional(),
  eligiblePurchases: z.string().optional(),
  refundMethod: z.string().optional(),
  nonRefundableConditions: z.string().optional(),
  refundRequestProcess: z.string().optional(),
});

export type RefundPolicyInput = z.infer<typeof formSchema>;
export type RefundPolicyOutput = { policy: string };

export default function RefundPolicyGeneratorPage() {
  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RefundPolicyInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      websiteUrl: '',
      country: '',
      state: '',
      supportContact: '',
      offerRefunds: 'No',
      refundTimeframe: '30 days',
      eligiblePurchases: 'All products',
      refundMethod: 'Original payment method',
      nonRefundableConditions: 'Used products, digital downloads, customized items',
      refundRequestProcess: 'Contact us via email or our support form',
    },
  });

  const watchOfferRefunds = form.watch('offerRefunds');

  const handleSubmit = async (values: RefundPolicyInput) => {
    setIsLoading(true);
    setGeneratedPolicy('');
    try {
      const result = await generateRefundPolicy(values);
      setGeneratedPolicy(result.policy);
      toast({ title: 'Success!', description: 'Your refund policy has been generated.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate refund policy.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPolicy);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleDownloadTxt = () => {
    const blob = new Blob([generatedPolicy], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'refund-policy.txt');
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Refund Policy Generator</CardTitle>
            <CardDescription>Answer the questions below to generate your policy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="font-semibold text-lg border-b pb-2">Common Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Company / Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="websiteUrl" render={({ field }) => (<FormItem><FormLabel>Website URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country of Operation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State/Province of Operation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="supportContact" render={({ field }) => (<FormItem><FormLabel>Customer Support Email / Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField control={form.control} name="offerRefunds" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Do you offer refunds?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            
            {watchOfferRefunds === 'Yes' && (
              <div className="space-y-4 p-4 border rounded-md">
                 <FormField control={form.control} name="refundTimeframe" render={({ field }) => (<FormItem><FormLabel>Timeframe for refunds (e.g., 7 days, 14 days, 30 days)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="eligiblePurchases" render={({ field }) => (<FormItem><FormLabel>Eligible purchases for refunds</FormLabel><FormControl><Input {...field} placeholder="e.g., all products, only defective items" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="refundMethod" render={({ field }) => (<FormItem><FormLabel>Refund method</FormLabel><FormControl><Input {...field} placeholder="e.g., original payment method, store credit" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="nonRefundableConditions" render={({ field }) => (<FormItem><FormLabel>Conditions where refund will NOT be provided</FormLabel><FormControl><Textarea {...field} placeholder="e.g., used products, digital downloads" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="refundRequestProcess" render={({ field }) => (<FormItem><FormLabel>How should customers request a refund?</FormLabel><FormControl><Input {...field} placeholder="e.g., email support@, use our contact form" /></FormControl><FormMessage /></FormItem>)} />
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Policy
            </Button>
          </CardContent>
        </form>
      </Form>
      {generatedPolicy && (
        <CardFooter className="flex-col items-start gap-4">
          <h3 className="font-semibold text-lg">Your Generated Refund Policy</h3>
           <div className="w-full space-y-2">
                <Textarea value={generatedPolicy} readOnly rows={20} className="bg-muted" />
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                    <Button variant="outline" onClick={handleDownloadTxt}><Download className="mr-2 h-4 w-4" /> Download .txt</Button>
                </div>
            </div>
            <p className="text-xs text-destructive mt-4">
                Disclaimer: This is a standard auto-generated Refund Policy. Please review with a legal professional for compliance with your region.
            </p>
        </CardFooter>
      )}
    </Card>
  );
}
