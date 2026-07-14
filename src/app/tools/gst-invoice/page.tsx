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
  hsn: string;
  quantity: string;
  rate: string;
  gstRate: string; // GST Percent, e.g. "18"
}

interface FormState {
  yourCompanyName: string;
  yourCompanyAddress: string;
  yourCompanyGstin: string;
  yourLogo: string | null;
  clientName: string;
  clientAddress: string;
  clientGstin: string;
  docNumber: string;
  docDate: string;
  currency: string;
  items: Item[];
  notes: string;
}

const currencies = [
  { code: 'INR', symbol: '₹' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
];

const initialFormState: FormState = {
  yourCompanyName: '',
  yourCompanyAddress: '',
  yourCompanyGstin: '',
  yourLogo: null,
  clientName: '',
  clientAddress: '',
  clientGstin: '',
  docNumber: 'INV-2026-001',
  docDate: new Date().toISOString().split('T')[0],
  currency: '₹',
  items: [
    { description: '', hsn: '99', quantity: '1', rate: '0', gstRate: '18' }
  ],
  notes: 'Thank you for your business.',
};

const storageKey = 'gst-invoice-form-data';

export default function GSTInvoicePage() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            setFormState(parsedData);
            toast({ title: 'Draft Loaded', description: `Your saved GST invoice draft has been loaded.` });
        } catch (error) {
            console.error("Failed to parse saved data:", error);
        }
    }
  }, [toast]);

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
      setFormState(prev => ({ ...prev, items: [...prev.items, { description: '', hsn: '99', quantity: '1', rate: '0', gstRate: '18' }] }));
  };

  const removeItem = (index: number) => {
      setFormState(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const subtotal = formState.items.reduce((acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);
  const gstTotal = formState.items.reduce((acc, item) => {
    const base = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
    const gstPercent = (Number(item.gstRate) || 0);
    return acc + base * (gstPercent / 100);
  }, 0);
  const cgstTotal = gstTotal / 2;
  const sgstTotal = gstTotal / 2;
  const grandTotal = subtotal + gstTotal;

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    const requiredFields: (keyof FormState)[] = ['yourCompanyName', 'yourCompanyGstin', 'clientName', 'clientGstin', 'docNumber', 'docDate'];
    
    requiredFields.forEach(field => {
        const value = formState[field];
        if (typeof value === 'string' && !value.trim()) newErrors[field] = true;
    });

    formState.items.forEach((item, index) => {
        if (!item.description.trim()) newErrors[`item-${index}-description`] = true;
        if (!item.hsn.trim()) newErrors[`item-${index}-hsn`] = true;
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
        doc.text('TAX INVOICE', 14, y);
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
        doc.text(`GSTIN: ${formState.yourCompanyGstin}`, 14, y);
        y += 5;
        if (formState.yourCompanyAddress) {
          doc.splitTextToSize(formState.yourCompanyAddress, 80).forEach((line: string) => {
              doc.text(line, 14, y);
              y += 5;
          });
        }

        let clientY = 40;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text('BILL TO:', pageWidth / 2, clientY);
        clientY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(formState.clientName, pageWidth / 2, clientY);
        clientY += 5;
        doc.text(`GSTIN: ${formState.clientGstin}`, pageWidth / 2, clientY);
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
        doc.text(`Invoice No: ${formState.docNumber}`, 14, y);
        doc.text(`Date: ${formState.docDate}`, pageWidth - 14, y, { align: 'right' });
        
        const headers = ['Description', 'HSN', 'Qty', `Rate (${currencySymbol})`, 'GST %', `CGST (${currencySymbol})`, `SGST (${currencySymbol})`, `Total (${currencySymbol})`];
        const body = formState.items.map((item) => {
          const qtyVal = parseFloat(item.quantity) || 0;
          const rateVal = parseFloat(item.rate) || 0;
          const base = qtyVal * rateVal;
          const gstPercent = parseFloat(item.gstRate) || 0;
          const gst = base * (gstPercent / 100);
          return [
            item.description,
            item.hsn,
            item.quantity,
            rateVal.toFixed(2),
            `${gstPercent}%`,
            (gst / 2).toFixed(2),
            (gst / 2).toFixed(2),
            (base + gst).toFixed(2),
          ];
        });

        autoTable(doc, {
            startY: y + 10,
            head: [headers],
            body: body,
            theme: 'striped',
            headStyles: { fillColor: [41, 171, 226] },
            columnStyles: {
              2: { halign: 'center' },
              3: { halign: 'right' },
              4: { halign: 'center' },
              5: { halign: 'right' },
              6: { halign: 'right' },
              7: { halign: 'right' },
            },
            didDrawPage: (data) => {
                let tableY = data.cursor?.y ? data.cursor.y + 10 : 200;
                
                const totalsX = pageWidth - 14 - 70;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);

                doc.text('Subtotal (Taxable Value):', totalsX, tableY, { align: 'right' });
                doc.text(`${currencySymbol}${subtotal.toFixed(2)}`, pageWidth - 14, tableY, { align: 'right' });
                tableY += 6;
                doc.text('Central Tax (CGST):', totalsX, tableY, { align: 'right' });
                doc.text(`${currencySymbol}${cgstTotal.toFixed(2)}`, pageWidth - 14, tableY, { align: 'right' });
                tableY += 6;
                doc.text('State Tax (SGST):', totalsX, tableY, { align: 'right' });
                doc.text(`${currencySymbol}${sgstTotal.toFixed(2)}`, pageWidth - 14, tableY, { align: 'right' });
                tableY += 8;
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(50, 50, 50);
                doc.text('Grand Total:', totalsX, tableY, { align: 'right' });
                doc.text(`${currencySymbol}${grandTotal.toFixed(2)}`, pageWidth - 14, tableY, { align: 'right' });
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

        doc.save(`gst-invoice-${formState.docNumber}.pdf`);
        toast({ title: 'Success', description: `GST Invoice has been generated and downloaded.` });
        scrollToDownload();

    } catch (e) {
        console.error(e);
        toast({ title: 'Error', description: `Failed to generate PDF. Please try again.`, variant: 'destructive' });
    }
  };
  
  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(formState));
    toast({ title: 'Draft Saved!', description: `Your GST Invoice has been saved locally.` });
  };
  
  const handleClear = () => {
    localStorage.removeItem(storageKey);
    setFormState(initialFormState);
    setErrors({});
    toast({ title: 'Form Cleared', description: `The GST Invoice form has been reset.` });
  };

  return (
    <>
      <Card className="shadow-lg border-primary/10">
        <form onSubmit={(e) => { e.preventDefault(); generatePdf(); }}>
          <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Receipt className="h-6 w-6 text-primary" /> GST INVOICE GENERATOR
              </CardTitle>
              <CardDescription>Create compliant Indian Tax Invoices with automated CGST & SGST calculations per item.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">Your Details</h3>
                      <div><Label>Company Name</Label><Input value={formState.yourCompanyName} onChange={e => handleInputChange('yourCompanyName', e.target.value)} className={cn(errors.yourCompanyName && 'border-destructive')} /></div>
                      <div><Label>GSTIN</Label><Input value={formState.yourCompanyGstin} onChange={e => handleInputChange('yourCompanyGstin', e.target.value)} className={cn(errors.yourCompanyGstin && 'border-destructive')} /></div>
                      <div><Label>Address</Label><Textarea value={formState.yourCompanyAddress} onChange={e => handleInputChange('yourCompanyAddress', e.target.value)} className={cn(errors.yourCompanyAddress && 'border-destructive')} /></div>
                      <div><Label>Logo</Label><Input type="file" accept="image/png, image/jpeg" onChange={handleLogoChange}/></div>
                      {formState.yourLogo && <img src={formState.yourLogo} alt="Logo preview" className="w-24 h-24 object-contain rounded-md border p-1" />}
                  </div>

                  <div className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">Client Details</h3>
                      <div><Label>Client Name</Label><Input value={formState.clientName} onChange={e => handleInputChange('clientName', e.target.value)} className={cn(errors.clientName && 'border-destructive')} /></div>
                      <div><Label>Client GSTIN</Label><Input value={formState.clientGstin} onChange={e => handleInputChange('clientGstin', e.target.value)} className={cn(errors.clientGstin && 'border-destructive')} /></div>
                      <div><Label>Client Address</Label><Textarea value={formState.clientAddress} onChange={e => handleInputChange('clientAddress', e.target.value)} className={cn(errors.clientAddress && 'border-destructive')} /></div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label>Invoice #</Label><Input value={formState.docNumber} onChange={e => handleInputChange('docNumber', e.target.value)} className={cn(errors.docNumber && 'border-destructive')}/></div>
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
                          <Label className="md:col-span-4">Description</Label>
                          <Label className="md:col-span-2">HSN</Label>
                          <Label className="md:col-span-1">Qty</Label>
                          <Label className="md:col-span-2">Rate</Label>
                          <Label className="md:col-span-2">GST %</Label>
                      </div>
                      {formState.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-start p-2 md:p-0 border md:border-0 rounded-md md:rounded-none">
                              <div className="col-span-12 md:col-span-4"><Label className="md:hidden">Description</Label><Input value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Item Description" className={cn(errors[`item-${index}-description`] && 'border-destructive')}/></div>
                              <div className="col-span-6 md:col-span-2"><Label className="md:hidden">HSN</Label><Input value={item.hsn} onChange={e => handleItemChange(index, 'hsn', e.target.value)} placeholder="HSN/SAC Code" className={cn(errors[`item-${index}-hsn`] && 'border-destructive')}/></div>
                              <div className="col-span-6 md:col-span-1"><Label className="md:hidden">Qty</Label><Input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className={cn(errors[`item-${index}-quantity`] && 'border-destructive')}/></div>
                              <div className="col-span-6 md:col-span-2"><Label className="md:hidden">Rate</Label><Input type="number" value={item.rate} onChange={e => handleItemChange(index, 'rate', e.target.value)} className={cn(errors[`item-${index}-rate`] && 'border-destructive')}/></div>
                              <div className="col-span-6 md:col-span-2">
                                <Label className="md:hidden">GST %</Label>
                                <Select value={item.gstRate} onValueChange={val => handleItemChange(index, 'gstRate', val)}>
                                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">0%</SelectItem>
                                    <SelectItem value="5">5%</SelectItem>
                                    <SelectItem value="12">12%</SelectItem>
                                    <SelectItem value="18">18%</SelectItem>
                                    <SelectItem value="28">28%</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-12 md:col-span-1 self-center"><Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)} className="rounded-xl"><Trash className="h-4 w-4" /></Button></div>
                          </div>
                      ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addItem} className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                  <div className="w-full md:w-1/3 space-y-2">
                      <div className="flex justify-between"><Label>Subtotal (Taxable Value)</Label><span>{formState.currency}{subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between"><Label>Central Tax (CGST)</Label><span>{formState.currency}{cgstTotal.toFixed(2)}</span></div>
                      <div className="flex justify-between"><Label>State Tax (SGST)</Label><span>{formState.currency}{sgstTotal.toFixed(2)}</span></div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><Label>Grand Total</Label><span>{formState.currency}{grandTotal.toFixed(2)}</span></div>
                  </div>
              </div>

              <div><Label>Notes / Terms</Label><Textarea value={formState.notes} onChange={e => handleInputChange('notes', e.target.value)} className="rounded-xl" /></div>
          </CardContent>
          <CardFooter id="download-section" className="flex-col items-start gap-4 md:flex-row md:justify-between bg-muted/30 p-6 border-t">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button type="submit" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Download GST Invoice</Button>
                  <Button type="button" variant="secondary" onClick={handleSave} className="rounded-xl"><Save className="mr-2 h-4 w-4" /> Save Draft</Button>
              </div>
              <Button type="button" variant="ghost" onClick={handleClear} className="text-destructive hover:bg-destructive/10 rounded-xl"><XCircle className="mr-2 h-4 w-4" /> Clear Form</Button>
          </CardFooter>
        </form>
      </Card>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our GST Invoice Maker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our GST Invoice Maker is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Generate Indian GST compliant tax invoices with automatic CGST and SGST calculations per billing item.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Input your business credentials and client credentials, including GSTIN numbers.</li>
                        <li>Add items, setting HSN codes, quantity, rate, and select GST brackets.</li>
                        <li>The system automatically computes taxable amounts, CGST, and SGST parameters.</li>
                        <li>Click "Download GST Invoice" to generate the PDF instantly.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the GST Invoice Maker tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this GST Invoice Maker upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I save my invoice progress?</h4>
                    <p className="text-muted-foreground text-sm">Yes, you can click "Save Draft" to store all invoice fields directly in browser storage and reload them next time you load the page.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use GST Invoice Maker on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}
