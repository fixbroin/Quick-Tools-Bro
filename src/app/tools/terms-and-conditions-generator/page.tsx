
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
import { generateTermsAndConditions } from '@/ai/flows/terms-and-conditions-flow';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Download } from 'lucide-react';
import { saveAs } from 'file-saver';

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  websiteUrl: z.string().url('Please enter a valid URL.'),
  country: z.string().min(1, 'Country is required.'),
  state: z.string().min(1, 'State/Province is required.'),
  email: z.string().email('Please enter a valid email.'),
  collectData: z.enum(['Yes', 'No']),
  useCookies: z.enum(['Yes', 'No']),
  useThirdParty: z.enum(['Yes', 'No']),
  targetAudience: z.string().min(1, 'Target audience is required.'),
  sellProducts: z.enum(['Yes', 'No']),
  offerSubscriptions: z.enum(['Yes', 'No']),
  userAccounts: z.enum(['Yes', 'No']),
  userContent: z.enum(['Yes', 'No']),
  allowRefunds: z.enum(['Yes', 'No']),
  refundWindow: z.string().optional(),
  userRestrictions: z.string().min(1, 'Please specify some user restrictions.'),
});

export type TermsAndConditionsInput = z.infer<typeof formSchema>;
export type TermsAndConditionsOutput = { terms: string };

export default function TermsAndConditionsGeneratorPage() {
  const [generatedTerms, setGeneratedTerms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<TermsAndConditionsInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      websiteUrl: '',
      country: '',
      state: '',
      email: '',
      collectData: 'No',
      useCookies: 'No',
      useThirdParty: 'No',
      targetAudience: 'General Public',
      sellProducts: 'No',
      offerSubscriptions: 'No',
      userAccounts: 'No',
      userContent: 'No',
      allowRefunds: 'No',
      refundWindow: '30 days',
      userRestrictions: 'No spamming, no illegal activities, no harassment.',
    },
  });

  const watchAllowRefunds = form.watch('allowRefunds');

  const handleSubmit = async (values: TermsAndConditionsInput) => {
    setIsLoading(true);
    setGeneratedTerms('');
    try {
      const result = await generateTermsAndConditions(values);
      setGeneratedTerms(result.terms);
      toast({ title: 'Success!', description: 'Your Terms & Conditions have been generated.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate document.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTerms);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleDownloadTxt = () => {
    const blob = new Blob([generatedTerms], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'terms-and-conditions.txt');
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Terms & Conditions Generator</CardTitle>
            <CardDescription>Answer the questions to generate your T&Cs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Common Info */}
            <h3 className="font-semibold text-lg border-b pb-2">Common Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Company / Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="websiteUrl" render={({ field }) => (<FormItem><FormLabel>Website URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country of Operation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State/Province of Operation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="targetAudience" render={({ field }) => (<FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input {...field} placeholder="e.g., General Public, Kids under 13" /></FormControl><FormMessage /></FormItem>)} />
            </div>

            {/* Data Questions */}
            <h3 className="font-semibold text-lg border-b pb-2">Data & Privacy</h3>
            <div className="space-y-4">
                <FormField control={form.control} name="collectData" render={({ field }) => (<FormItem><FormLabel>Does your website/app collect personal data?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
                <FormField control={form.control} name="useCookies" render={({ field }) => (<FormItem><FormLabel>Do you use cookies or tracking technologies?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
                <FormField control={form.control} name="useThirdParty" render={({ field }) => (<FormItem><FormLabel>Do you use third-party tools (e.g., Google Analytics, etc.)?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
            </div>
            
            {/* T&C Specifics */}
            <h3 className="font-semibold text-lg border-b pb-2">Terms & Conditions Specifics</h3>
            <div className="space-y-4">
                 <FormField control={form.control} name="sellProducts" render={({ field }) => (<FormItem><FormLabel>Do you sell products/services on your site?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
                 <FormField control={form.control} name="offerSubscriptions" render={({ field }) => (<FormItem><FormLabel>Do you offer subscriptions?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
                 <FormField control={form.control} name="userAccounts" render={({ field }) => (<FormItem><FormLabel>Do users need to create accounts?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
                 <FormField control={form.control} name="userContent" render={({ field }) => (<FormItem><FormLabel>Is user-generated content allowed?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
                 <FormField control={form.control} name="allowRefunds" render={({ field }) => (<FormItem><FormLabel>Do you offer refunds or returns?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl></FormItem>)} />
                {watchAllowRefunds === 'Yes' && (
                    <FormField control={form.control} name="refundWindow" render={({ field }) => (<FormItem><FormLabel>Return/Refund Window</FormLabel><FormControl><Input {...field} placeholder="e.g., 30 days, 14 days" /></FormControl><FormMessage /></FormItem>)} />
                )}
                 <FormField control={form.control} name="userRestrictions" render={({ field }) => (<FormItem><FormLabel>Are there any restrictions on user behavior?</FormLabel><FormControl><Textarea {...field} placeholder="e.g., no spamming, no illegal use, etc." /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Document
            </Button>
          </CardContent>
        </form>
      </Form>
      {generatedTerms && (
        <CardFooter className="flex-col items-start gap-4">
          <h3 className="font-semibold text-lg">Your Generated Terms & Conditions</h3>
          <div className="w-full space-y-2">
            <Textarea value={generatedTerms} readOnly rows={20} className="bg-muted" />
             <div className="flex gap-2">
                <Button variant="outline" onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                <Button variant="outline" onClick={handleDownloadTxt}><Download className="mr-2 h-4 w-4" /> Download .txt</Button>
            </div>
          </div>
          <p className="text-xs text-destructive mt-4">
            Disclaimer: This is a generic auto-generated legal document. Please consult with a legal professional for full compliance based on your jurisdiction.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
