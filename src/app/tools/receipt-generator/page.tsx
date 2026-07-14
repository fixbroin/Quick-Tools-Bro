'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash, Download, Save, XCircle, Receipt } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '@/hooks/use-toast';
import { cn, scrollToDownload } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Item {
  description: string;
  quantity: string;
  rate: string;
}

interface FormState {
  yourCompanyName: string;
  yourCompanyAddress: string;
  yourLogo: string | null;
  clientName: string;
  clientAddress: string;
  docNumber: string;
  docDate: string;
  currency: string;
  items: Item[];
  taxRate: string;
  taxName: string;
  notes: string;
}

const currencies = [
  { code: 'INR', symbol: 'Rs.' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
];

const initialFormState: FormState = {
  yourCompanyName: '',
  yourCompanyAddress: '',
  yourLogo: null,
  clientName: '',
  clientAddress: '',
  docNumber: 'REC-001',
  docDate: new Date().toISOString().split('T')[0],
  currency: 'Rs.',
  items: [
    { description: '', quantity: '1', rate: '0' }
  ],
  taxRate: '18',
  taxName: 'GST',
  notes: 'Thank you for your payment.',
};

const storageKey = 'receipt-form-data';

export default function ReceiptGeneratorPage() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            setFormState(parsedData);
            toast({ title: 'Draft Loaded', description: `Your saved receipt draft has been loaded.` });
        } catch (error) {
            console.error("Failed to parse saved data:", error);
        }
    }
    setIsLoaded(true);
  }, [toast]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(formState));
    }
  }, [formState, isLoaded]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
     if(errors[field]) {
       setErrors(prev => ({...prev, [field]: false}));
    }
  };
  
  const handleItemChange = (index: number, field: keyof Item, value: string) => {
      const newItems = [...formState.items];
      newItems[index] = { ...newItems[index], [field]: value };
      setFormState(prev => ({ ...prev, items: newItems }));
      const errorKey = `item-${index}-${field}`;
      if(errors[errorKey]) {
        setErrors(prev => ({...prev, [errorKey]: false}));
      }
  };
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setFormState(prev => ({ ...prev, yourLogo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
        toast({ title: "Invalid file type", description: "Please upload an image.", variant: "destructive" });
    }
  };

  const addItem = () => {
      setFormState(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: '1', rate: '0' }] }));
  };

  const removeItem = (index: number) => {
      setFormState(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const subtotal = formState.items.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const taxAmount = subtotal * ((Number(formState.taxRate) || 0) / 100);
  const total = subtotal + taxAmount;

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    const requiredFields: (keyof FormState)[] = ['yourCompanyName', 'clientName', 'docNumber', 'docDate'];
    
    requiredFields.forEach(field => {
        const value = formState[field];
        if (typeof value === 'string' && !value.trim()) newErrors[field] = true;
    });

    formState.items.forEach((item, index) => {
        if (!item.description.trim()) newErrors[`item-${index}-description`] = true;
        if (isNaN(parseFloat(item.quantity)) || parseFloat(item.quantity) <= 0) newErrors[`item-${index}-quantity`] = true;
        if (isNaN(parseFloat(item.rate)) || parseFloat(item.rate) < 0) newErrors[`item-${index}-rate`] = true;
    });

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
        toast({
            title: 'Validation Error',
            description: 'Please fill out all required fields marked in red.',
            variant: 'destructive',
        });
        return false;
    }
    return true;
  };

  const generatePdf = async () => {
    if (!validateForm()) {
        return;
    }

    try {
        const doc = new jsPDF({
          format: 'a4',
          unit: 'mm',
        });
        doc.setFont('helvetica', 'normal');

        const pageWidth = doc.internal.pageSize.getWidth();
        const currencySymbol = formState.currency;
        let y = 20;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 171, 226); // primary blue
        doc.text('RECEIPT', 14, y);
        y += 10;
        
        if (formState.yourLogo) {
             const img = new Image();
             img.src = formState.yourLogo;
             await new Promise(resolve => img.onload = resolve);
             const imgWidth = 25;
             const imgHeight = (img.height * imgWidth) / img.width;
             doc.addImage(formState.yourLogo, 'PNG', pageWidth - 14 - imgWidth, 15, imgWidth, imgHeight);
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text(formState.yourCompanyName, 14, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        if (formState.yourCompanyAddress) {
          doc.splitTextToSize(formState.yourCompanyAddress, 80).forEach((line: string) => {
              doc.text(line, 14, y);
              y += 5;
          });
        }

        let clientY = 40;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text('BILLED TO:', pageWidth / 2, clientY);
        clientY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(formState.clientName, pageWidth / 2, clientY);
        clientY += 5;
        if (formState.clientAddress) {
          doc.splitTextToSize(formState.clientAddress, 80).forEach((line: string) => {
              doc.text(line, pageWidth / 2, clientY);
              clientY += 5;
          });
        }

        y = Math.max(y, clientY) + 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Receipt #: ${formState.docNumber}`, 14, y);
        doc.text(`Date: ${formState.docDate}`, pageWidth - 14, y, { align: 'right' });
        
        autoTable(doc, {
            startY: y + 10,
            head: [[
              { content: 'Item Description', styles: { halign: 'left' as const } },
              { content: 'Qty', styles: { halign: 'center' as const } },
              { content: `Unit Price (${currencySymbol})`, styles: { halign: 'right' as const } },
              { content: `Total (${currencySymbol})`, styles: { halign: 'right' as const } }
            ]],
            body: formState.items.map(item => [
                item.description,
                item.quantity,
                parseFloat(item.rate).toFixed(2),
                (parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2)
            ]),
            theme: 'striped',
            headStyles: { fillColor: [41, 171, 226] },
            columnStyles: {
              0: { halign: 'left' },
              1: { halign: 'center' },
              2: { halign: 'right' },
              3: { halign: 'right' },
            },
            didDrawPage: (data) => {
                let tableY = data.cursor?.y ? data.cursor.y + 10 : 200;
                
                const totalsX = pageWidth - 14 - 50;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);

                doc.text('Subtotal:', totalsX, tableY, { align: 'right' });
                doc.text(`${currencySymbol}${subtotal.toFixed(2)}`, pageWidth - 14, tableY, { align: 'right' });
                tableY += 7;
                doc.text(`${formState.taxName} (${formState.taxRate}%):`, totalsX, tableY, { align: 'right' });
                doc.text(`${currencySymbol}${taxAmount.toFixed(2)}`, pageWidth - 14, tableY, { align: 'right' });
                tableY += 7;
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(50, 50, 50);
                doc.text('Gross Total:', totalsX, tableY, { align: 'right' });
                doc.text(`${currencySymbol}${total.toFixed(2)}`, pageWidth - 14, tableY, { align: 'right' });
                tableY += 15;
                
                doc.setFont('helvetica', 'normal');
                if (formState.notes) {
                    doc.setFontSize(8);
                    doc.text('Notes:', 14, tableY);
                    tableY+= 4;
                    doc.text(doc.splitTextToSize(formState.notes, pageWidth - 28), 14, tableY);
                }
            }
        });

        const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'UseBro';
        const totalPages = doc.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.getHeight();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(150, 150, 150);
          doc.text(`Generated by ${siteName}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        doc.save(`receipt-${formState.docNumber}.pdf`);
        toast({ title: 'Success', description: `Receipt has been generated and downloaded.` });
        scrollToDownload();

    } catch (e) {
        console.error(e);
        toast({ title: 'Error', description: `Failed to generate PDF. Please try again.`, variant: 'destructive' });
    }
  };
  
  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(formState));
    toast({ title: 'Draft Saved!', description: `Your receipt has been saved locally.` });
  };
  
  const handleClear = () => {
    localStorage.removeItem(storageKey);
    setFormState(initialFormState);
    setErrors({});
    toast({ title: 'Form Cleared', description: `The receipt form has been reset.` });
  };

  return (
    <>
      <Card className="shadow-lg border-primary/10">
        <form onSubmit={(e) => { e.preventDefault(); generatePdf(); }}>
          <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Receipt className="h-6 w-6 text-primary" /> RECEIPT GENERATOR
              </CardTitle>
              <CardDescription>Enter details of your items and customers to build downloadable PDF receipts client-side.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">Your Details</h3>
                      <div><Label>Company Name</Label><Input value={formState.yourCompanyName} onChange={e => handleInputChange('yourCompanyName', e.target.value)} className={cn(errors.yourCompanyName && 'border-destructive')} /></div>
                      <div><Label>Address</Label><Textarea value={formState.yourCompanyAddress} onChange={e => handleInputChange('yourCompanyAddress', e.target.value)} className={cn(errors.yourCompanyAddress && 'border-destructive')} /></div>
                      <div><Label>Logo</Label><Input type="file" accept="image/png, image/jpeg" onChange={handleLogoChange}/></div>
                      {formState.yourLogo && <img src={formState.yourLogo} alt="Logo preview" className="w-24 h-24 object-contain rounded-md border p-1" />}
                  </div>

                  <div className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">Client Details</h3>
                      <div><Label>Client Name</Label><Input value={formState.clientName} onChange={e => handleInputChange('clientName', e.target.value)} className={cn(errors.clientName && 'border-destructive')} /></div>
                      <div><Label>Client Address</Label><Textarea value={formState.clientAddress} onChange={e => handleInputChange('clientAddress', e.target.value)} className={cn(errors.clientAddress && 'border-destructive')} /></div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label>Receipt #</Label><Input value={formState.docNumber} onChange={e => handleInputChange('docNumber', e.target.value)} className={cn(errors.docNumber && 'border-destructive')}/></div>
                  <div><Label>Date</Label><Input type="date" value={formState.docDate} onChange={e => handleInputChange('docDate', e.target.value)} className={cn(errors.docDate && 'border-destructive')}/></div>
                  <div>
                      <Label>Currency</Label>
                      <Select value={formState.currency} onValueChange={v => handleInputChange('currency', v)}>
                          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                              {currencies.map(c => <SelectItem key={c.code} value={c.symbol}>{c.code} ({c.symbol})</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
              </div>

              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Items</h3>
                  <div className="space-y-2">
                      <div className="hidden md:grid md:grid-cols-12 gap-2 items-start p-2">
                          <Label className="md:col-span-7">Description</Label>
                          <Label className="md:col-span-1">Qty</Label>
                          <Label className="md:col-span-2">Rate</Label>
                          <Label className="md:col-span-1">Amount</Label>
                      </div>
                      {formState.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-start p-2 md:p-0 border md:border-0 rounded-md md:rounded-none">
                              <div className="col-span-12 md:col-span-7"><Label className="md:hidden">Description</Label><Input value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Item Description" className={cn(errors[`item-${index}-description`] && 'border-destructive')}/></div>
                              <div className="col-span-6 md:col-span-1"><Label className="md:hidden">Qty</Label><Input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className={cn(errors[`item-${index}-quantity`] && 'border-destructive')}/></div>
                              <div className="col-span-6 md:col-span-2"><Label className="md:hidden">Rate</Label><Input type="number" value={item.rate} onChange={e => handleItemChange(index, 'rate', e.target.value)} className={cn(errors[`item-${index}-rate`] && 'border-destructive')}/></div>
                              <div className="col-span-6 md:col-span-1"><Label className="md:hidden">Amount</Label><p className="flex h-10 items-center">{formState.currency}{( (Number(item.quantity) || 0) * (Number(item.rate) || 0) ).toFixed(2)}</p></div>
                              <div className="col-span-12 md:col-span-1 self-center"><Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)} className="rounded-xl"><Trash className="h-4 w-4" /></Button></div>
                          </div>
                      ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addItem} className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                  <div className="w-full md:w-1/3 space-y-2">
                      <div className="flex justify-between"><Label>Subtotal</Label><span>{formState.currency}{subtotal.toFixed(2)}</span></div>
                      <div>
                          <p className="text-xs text-muted-foreground mb-1">(You can edit the tax name)</p>
                          <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                  <Input value={formState.taxName} onChange={e => handleInputChange('taxName', e.target.value)} className="w-20 h-8" />
                                  <Label>(%)</Label>
                              </div>
                              <Input type="number" value={formState.taxRate} onChange={e => handleInputChange('taxRate', e.target.value)} className="w-24 h-8" />
                          </div>
                      </div>
                      <div className="flex justify-between"><Label>Tax Amount</Label><span>{formState.currency}{taxAmount.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold text-lg"><Label>Total</Label><span>{formState.currency}{total.toFixed(2)}</span></div>
                  </div>
              </div>

              <div><Label>Notes / Terms</Label><Textarea value={formState.notes} onChange={e => handleInputChange('notes', e.target.value)} className="rounded-xl" /></div>
          </CardContent>
          <CardFooter id="download-section" className="flex-col items-start gap-4 md:flex-row md:justify-between bg-muted/30 p-6 border-t">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button type="submit" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Download Receipt</Button>
                  <Button type="button" variant="secondary" onClick={handleSave} className="rounded-xl"><Save className="mr-2 h-4 w-4" /> Save Draft</Button>
              </div>
              <Button type="button" variant="ghost" onClick={handleClear} className="text-destructive hover:bg-destructive/10 rounded-xl"><XCircle className="mr-2 h-4 w-4" /> Clear Form</Button>
          </CardFooter>
        </form>
      </Card>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Receipt Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Receipt Generator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Create sales and donation receipt PDFs client-side without sending your business data to external servers.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Input your business and customer details in the controls.</li>
                        <li>Add your items, quantity, and unit price in the ledger table.</li>
                        <li>Upload your company logo to customize the receipt layout.</li>
                        <li>Click "Download Receipt" to instantly compile and download the PDF.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the Receipt Generator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Receipt Generator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I save my receipts for later?</h4>
                    <p className="text-muted-foreground text-sm">Yes! By clicking "Save Draft", your current receipt form data is stored locally in your browser's memory so it reloads automatically when you return.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Receipt Generator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}
