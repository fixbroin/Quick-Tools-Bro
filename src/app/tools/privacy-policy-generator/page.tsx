
'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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
  dataTypes: z.array(z.string()).optional(),
  collectionMethods: z.array(z.string()).optional(),
  dataUsage: z.array(z.string()).optional(),
  shareData: z.enum(['Yes', 'No']).optional(),
  thirdParties: z.string().optional(),
  compliance: z.array(z.string()).optional(),
});

export type PrivacyPolicyInput = z.infer<typeof formSchema>;
export type PrivacyPolicyOutput = { policy: string };

const dataTypesOptions = ["Name", "Email", "Phone Number", "Address", "IP Address", "Payment Information", "User Behavior Data"];
const collectionMethodsOptions = ["Contact Forms", "User Registrations", "Cookies", "Analytics Tools", "Direct User Input"];
const dataUsageOptions = ["Marketing", "Service Improvement", "Analytics", "Personalization", "Processing Payments"];
const complianceOptions = ["GDPR (General Data Protection Regulation)", "CCPA (California Consumer Privacy Act)", "PIPEDA (Personal Information Protection and Electronic Documents Act - Canada)", "Other"];

const generateClientSidePrivacyPolicy = (data: PrivacyPolicyInput): string => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  let policy = `Privacy Policy for ${data.companyName}\n`;
  policy += `Effective Date: ${currentDate}\n\n`;

  policy += `1. Introduction\n`;
  policy += `Welcome to ${data.companyName} ("we," "us," or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ${data.websiteUrl}. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.\n\n`;

  policy += `2. Information We Collect\n`;
  if (data.collectData === 'Yes') {
    policy += `We may collect information about you in a variety of ways. The information we may collect on the Site includes:\n\n`;
    if (data.dataTypes && data.dataTypes.length > 0) {
      policy += `Personal Data: Personally identifiable information, such as your ${data.dataTypes.join(', ')}, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.\n\n`;
    }
    if (data.collectionMethods && data.collectionMethods.length > 0) {
        policy += `We collect this information through the following methods: ${data.collectionMethods.join(', ')}.\n\n`;
    }
  } else {
      policy += `We do not collect personal information from you when you visit our website.\n\n`;
  }
  
  if (data.collectData === 'Yes' && data.dataUsage && data.dataUsage.length > 0) {
    policy += `3. How We Use Your Information\n`;
    policy += `Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:\n`;
    policy += data.dataUsage.map(use => `- ${use}`).join('\n') + '\n\n';
  }

  policy += `4. Cookies and Tracking Technologies\n`;
  if (data.useCookies === 'Yes') {
    policy += `We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience.\n\n`;
  } else {
    policy += `We do not use cookies or other tracking technologies on our Site.\n\n`;
  }

  policy += `5. Third-Party Services\n`;
  if (data.useThirdParty === 'Yes') {
    policy += `We may use third-party service providers, such as Google Analytics, to help us analyze and track users' use of the Site, determine the popularity of certain content, and better understand online activity.\n`;
    if (data.shareData === 'Yes' && data.thirdParties) {
      policy += `We may share your information with the following third parties: ${data.thirdParties}.\n\n`;
    } else {
      policy += `We do not share your personal information with any third parties for them to process.\n\n`;
    }
  } else {
    policy += `We do not use any third-party services that would collect your data.\n\n`;
  }

  policy += `6. Data Security\n`;
  policy += `We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.\n\n`;
  
  if (data.compliance && data.compliance.length > 0) {
      policy += `7. Your Data Protection Rights\n`;
      policy += `Depending on your location, you may have the following rights regarding your personal data:\n`;
      if (data.compliance.includes('GDPR (General Data Protection Regulation)')) {
          policy += `- The right to access, update or to delete the information we have on you.\n- The right of rectification.\n- The right to object.\n- The right of restriction.\n- The right to data portability.\n- The right to withdraw consent.\n`;
      }
      if (data.compliance.includes('CCPA (California Consumer Privacy Act)')) {
          policy += `- The right to know about the personal information a business collects about you and how it is used and shared.\n- The right to delete personal information collected from you.\n- The right to opt-out of the sale of your personal information.\n- The right to non-discrimination for exercising your CCPA rights.\n`;
      }
       policy += `\n`;
  }

  policy += `8. Children's Privacy\n`;
  if (data.targetAudience.toLowerCase().includes('kids') || data.targetAudience.toLowerCase().includes('children')) {
    policy += `We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.\n\n`;
  } else {
    policy += `Our services are not directed to anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.\n\n`;
  }

  policy += `9. Changes to This Privacy Policy\n`;
  policy += `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.\n\n`;

  policy += `10. Contact Us\n`;
  policy += `If you have questions or comments about this Privacy Policy, please contact us at: ${data.email}\n`;

  return policy;
}

export default function PrivacyPolicyGeneratorPage() {
  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PrivacyPolicyInput>({
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
      dataTypes: [],
      collectionMethods: [],
      dataUsage: [],
      shareData: 'No',
      thirdParties: '',
      compliance: [],
    },
  });

  const watchCollectData = form.watch('collectData');
  const watchUseThirdParty = form.watch('useThirdParty');
  const watchShareData = form.watch('shareData');

  const handleSubmit = (values: PrivacyPolicyInput) => {
    setIsLoading(true);
    setGeneratedPolicy('');
    try {
      const result = generateClientSidePrivacyPolicy(values);
      setGeneratedPolicy(result);
      toast({ title: 'Success!', description: 'Your privacy policy has been generated.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to generate privacy policy.', variant: 'destructive' });
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
    saveAs(blob, 'privacy-policy.txt');
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Privacy Policy Generator</CardTitle>
            <CardDescription>Answer the questions below to generate your policy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="font-semibold text-lg border-b pb-2">Common Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Company / Business Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="websiteUrl" render={({ field }) => (<FormItem><FormLabel>Website URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country of Operation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>State/Province of Operation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField control={form.control} name="collectData" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Do you collect personal data?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            
            {watchCollectData === 'Yes' && (
              <div className="space-y-4 p-4 border rounded-md">
                 <FormField control={form.control} name="dataTypes" render={() => ( <FormItem><div className="mb-4"><FormLabel>What type of personal data do you collect?</FormLabel></div>{dataTypesOptions.map((item) => (<FormField key={item} control={form.control} name="dataTypes" render={({ field }) => {return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))}}/></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>);}} />))}<FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="collectionMethods" render={() => ( <FormItem><div className="mb-4"><FormLabel>How do you collect personal data?</FormLabel></div>{collectionMethodsOptions.map((item) => (<FormField key={item} control={form.control} name="collectionMethods" render={({ field }) => {return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))}}/></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>);}} />))}<FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="dataUsage" render={() => ( <FormItem><div className="mb-4"><FormLabel>How do you use the collected data?</FormLabel></div>{dataUsageOptions.map((item) => (<FormField key={item} control={form.control} name="dataUsage" render={({ field }) => {return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))}}/></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>);}} />))}<FormMessage /></FormItem>)} />
              </div>
            )}

            <FormField control={form.control} name="useCookies" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Do you use cookies or tracking technologies?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="useThirdParty" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Do you use third-party tools (e.g., Google Analytics)?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
            
            {watchUseThirdParty === 'Yes' && (
                 <div className="space-y-4 p-4 border rounded-md">
                     <FormField control={form.control} name="shareData" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Do you share user data with any third parties?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="Yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem><FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="No" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                     {watchShareData === 'Yes' && (
                        <FormField control={form.control} name="thirdParties" render={({ field }) => (<FormItem><FormLabel>If yes, name them (comma-separated)</FormLabel><FormControl><Input {...field} placeholder="e.g., Google Analytics, Stripe" /></FormControl><FormMessage /></FormItem>)} />
                     )}
                 </div>
            )}
            
            <FormField control={form.control} name="targetAudience" render={({ field }) => (<FormItem><FormLabel>What is your target audience?</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="compliance" render={() => ( <FormItem><FormLabel>Do you comply with specific data laws?</FormLabel>{complianceOptions.map((item) => (<FormField key={item} control={form.control} name="compliance" render={({ field }) => {return (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))}}/></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>);}} />))}<FormMessage /></FormItem>)} />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Policy
            </Button>
          </CardContent>
        </form>
      </Form>
      {generatedPolicy && (
        <CardFooter className="flex-col items-start gap-4">
          <h3 className="font-semibold text-lg">Your Generated Privacy Policy</h3>
           <div className="w-full space-y-2">
                <Textarea value={generatedPolicy} readOnly rows={20} className="bg-muted" />
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
