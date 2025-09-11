
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
import { generatePrivacyPolicy } from '@/ai/flows/privacy-policy-flow';
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

  const handleSubmit = async (values: PrivacyPolicyInput) => {
    setIsLoading(true);
    setGeneratedPolicy('');
    try {
      const result = await generatePrivacyPolicy(values);
      setGeneratedPolicy(result.policy);
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
