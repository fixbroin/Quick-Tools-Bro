
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

const generateClientSideTerms = (data: TermsAndConditionsInput): string => {
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let terms = `Terms and Conditions for ${data.companyName}\n`;
    terms += `Effective Date: ${currentDate}\n\n`;

    terms += `1. Introduction/Agreement to Terms\n`;
    terms += `Welcome to ${data.companyName}. These Terms and Conditions ("Terms") govern your use of our website located at ${data.websiteUrl} (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.\n\n`;

    if (data.userAccounts === 'Yes') {
        terms += `2. User Accounts\n`;
        terms += `When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.\n\n`;
    }

    if (data.sellProducts === 'Yes' || data.offerSubscriptions === 'Yes') {
        terms += `3. Products, Services & Subscriptions\n`;
        if (data.sellProducts === 'Yes') {
            terms += `We may sell products or services on our Site. We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order, or other reasons.\n`;
        }
        if (data.offerSubscriptions === 'Yes') {
            terms += `Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle").\n`;
        }
        terms += `\n`;
    }

    if (data.userContent === 'Yes') {
        terms += `4. User-Generated Content\n`;
        terms += `Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.\n\n`;
    }

    terms += `5. Prohibited Activities\n`;
    terms += `You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, the services, or the general business of ${data.companyName}. Prohibited activities include, but are not limited to: ${data.userRestrictions}\n\n`;

    terms += `6. Intellectual Property Rights\n`;
    terms += `The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of ${data.companyName} and its licensors. The Service is protected by copyright, trademark, and other laws of both the ${data.country} and foreign countries.\n\n`;

    terms += `7. Refunds/Returns Policy\n`;
    if (data.allowRefunds === 'Yes') {
        terms += `If you are not completely satisfied with your purchase, you may be eligible for a refund or return within ${data.refundWindow || 'a specified period'}. Please review our full Refund Policy for detailed information.\n\n`;
    } else {
        terms += `All sales are final and no refunds will be issued.\n\n`;
    }

    terms += `8. Governing Law\n`;
    terms += `These Terms shall be governed and construed in accordance with the laws of ${data.state}, ${data.country}, without regard to its conflict of law provisions.\n\n`;

    terms += `9. Disclaimer of Warranties & Limitation of Liability\n`;
    terms += `The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied. In no event shall ${data.companyName}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.\n\n`;

    terms += `10. Contact Information\n`;
    terms += `If you have any questions about these Terms, please contact us at ${data.email}.\n`;

    return terms;
};


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

  const handleSubmit = (values: TermsAndConditionsInput) => {
    setIsLoading(true);
    setGeneratedTerms('');
    try {
      const result = generateClientSideTerms(values);
      setGeneratedTerms(result);
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
