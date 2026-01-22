
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Download } from 'lucide-react';
import { saveAs } from 'file-saver';

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  websiteUrl: z.string().url('Please enter a valid URL.'),
  country: z.string().min(1, 'Country is required.'),
  state: z.string().min(1, 'State/Province is required.'),
  supportContact: z.string().min(1, 'Support contact is required.'),
  acceptsReturns: z.enum(['Yes', 'No']),
  returnTimeframe: z.string().optional(),
  shippingResponsibility: z.string().optional(),
  itemCondition: z.string().optional(),
  returnExceptions: z.string().optional(),
  offersExchanges: z.enum(['Yes', 'No']).optional(),
});

export type ReturnPolicyInput = z.infer<typeof formSchema>;
export type ReturnPolicyOutput = { policy: string };

const generateClientSideReturnPolicy = (data: ReturnPolicyInput): string => {
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let policy = `Return Policy for ${data.companyName}\n`;
    policy += `Effective Date: ${currentDate}\n\n`;

    policy += `1. Introduction\n`;
    policy += `We want you to be completely satisfied with your purchase. This policy outlines the conditions under which returns are accepted.\n\n`;
    
    if (data.acceptsReturns === 'Yes') {
        policy += `2. Conditions for Returns\n`;
        policy += `We accept returns within ${data.returnTimeframe || 'N/A'} of the original purchase date. To be eligible for a return, items must be ${data.itemCondition || 'in their original condition'}. Responsibility for return shipping costs will be as follows: ${data.shippingResponsibility || 'not specified'}.\n\n`;
        
        if (data.returnExceptions) {
            policy += `3. Exceptions\n`;
            policy += `The following items are not eligible for return: ${data.returnExceptions}.\n\n`;
        }

        policy += `4. Exchanges\n`;
        if (data.offersExchanges === 'Yes') {
            policy += `We offer exchanges for eligible items. Please contact our support team to arrange an exchange.\n\n`;
        } else {
            policy += `We do not offer exchanges at this time.\n\n`;
        }
        
        policy += `5. How to Initiate a Return\n`;
        policy += `To initiate a return, please contact our customer support at ${data.supportContact} with your order details.\n\n`;

    } else {
        policy += `2. No Returns\n`;
        policy += `We do not accept returns or exchanges unless the item you purchased is defective. If you receive a defective item, please contact us at ${data.supportContact} with details of the product and the defect.\n\n`;
    }
    
    policy += `6. Contact Information\n`;
    policy += `If you have any questions about our Return Policy, please contact us at ${data.supportContact}.\n\n`;
    
    policy += `Disclaimer: This is a standard auto-generated Return Policy. Please review with a legal professional for compliance with your region.`;
    
    return policy;
};

export default function ReturnPolicyGeneratorPage() {
  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReturnPolicyInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      websiteUrl: '',
      country: '',
      state: '',
      supportContact: '',
      acceptsReturns: 'No',
      returnTimeframe: '30 days',
      shippingResponsibility: 'Customer pays for return shipping',
      itemCondition: 'Unused, in original packaging',
      returnExceptions: 'Sale items, digital goods, personalized products',
      offersExchanges: 'Yes',
    },
  });

  const watchAcceptsReturns = form.watch('acceptsReturns');

  const handleSubmit = (values: ReturnPolicyInput) => {
    setIsLoading(true);
    setGeneratedPolicy('');
    try {
      const result = generateClientSideReturnPolicy(values);
      setGeneratedPolicy(result);
      toast({ title: 'Success!', description: 'Your return policy has been generated.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate return policy.', variant: 'destructive' });
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
    saveAs(blob, 'return-policy.txt');
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Return Policy Generator</CardTitle>
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

            <FormField control={form.control} name="acceptsReturns" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Do you accept returns?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            
            {watchAcceptsReturns === 'Yes' && (
              <div className="space-y-4 p-4 border rounded-md">
                 <FormField control={form.control} name="returnTimeframe" render={({ field }) => (<FormItem><FormLabel>Timeframe for returns (e.g., 7, 30 days)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="shippingResponsibility" render={({ field }) => (<FormItem><FormLabel>Return shipping responsibility</FormLabel><FormControl><Input {...field} placeholder="e.g., Customer pays / Company pays" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="itemCondition" render={({ field }) => (<FormItem><FormLabel>Condition of items eligible for return</FormLabel><FormControl><Input {...field} placeholder="e.g., unused, with original packaging" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="returnExceptions" render={({ field }) => (<FormItem><FormLabel>Exceptions to returns (items that cannot be returned)</FormLabel><FormControl><Textarea {...field} placeholder="e.g., perishable items, digital goods, sale items" /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="offersExchanges" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Do you provide exchanges instead of returns?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
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
          <h3 className="font-semibold text-lg">Your Generated Return Policy</h3>
           <div className="w-full space-y-2">
                <Textarea value={generatedPolicy} readOnly rows={20} className="bg-muted" />
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                    <Button variant="outline" onClick={handleDownloadTxt}><Download className="mr-2 h-4 w-4" /> Download .txt</Button>
                </div>
            </div>
            <p className="text-xs text-destructive mt-4">
                Disclaimer: This is a standard auto-generated Return Policy. Please review with a legal professional for compliance with your region.
            </p>
        </CardFooter>
      )}
    </Card>
  );
}
