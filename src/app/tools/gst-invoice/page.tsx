'use client';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Receipt, X, Plus, Trash2, Zap, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { scrollToDownload } from '@/lib/utils';

interface InvoiceItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstPercent: number;
}

export default function GSTInvoicePage() {
  const [businessName, setBusinessName] = useState('My Business Pvt Ltd');
  const [businessGSTIN, setBusinessGSTIN] = useState('27AAAAA0000A1Z5');
  const [clientName, setClientName] = useState('Client Company');
  const [clientGSTIN, setClientGSTIN] = useState('27BBBBB1111B2Z6');
  
  const [invoiceNo, setInvoiceNo] = useState('INV-2026-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: 'Software Development Services', hsn: '998313', qty: 1, rate: 80000, gstPercent: 18 },
    { id: '2', name: 'Cloud Infrastructure Setup', hsn: '998315', qty: 1, rate: 25000, gstPercent: 18 }
  ]);

  const [name, setName] = useState('');
  const [hsn, setHsn] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [rate, setRate] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(18);

  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!name.trim()) {
      toast({ title: "Item name is required", variant: "destructive" });
      return;
    }
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      name,
      hsn: hsn || '99',
      qty,
      rate,
      gstPercent,
    };
    setItems(prev => [...prev, newItem]);
    setName('');
    setHsn('');
    setQty(1);
    setRate(0);
    setPdfUrl(null);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setPdfUrl(null);
  };

  const getInvoiceTotals = () => {
    let subtotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let gstTotal = 0;

    items.forEach((item) => {
      const base = item.qty * item.rate;
      const gst = base * (item.gstPercent / 100);
      subtotal += base;
      cgstTotal += gst / 2;
      sgstTotal += gst / 2;
      gstTotal += gst;
    });

    return {
      subtotal,
      cgstTotal,
      sgstTotal,
      gstTotal,
      grandTotal: subtotal + gstTotal
    };
  };

  const { subtotal, cgstTotal, sgstTotal, gstTotal, grandTotal } = getInvoiceTotals();

  const handleGenerate = () => {
    if (items.length === 0) {
      toast({ title: "No items", description: "Please add at least one item.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      // Header Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(41, 171, 226);
      doc.text('TAX INVOICE', margin, 25);

      // Business Info (Seller)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(businessName, margin, 35);
      doc.setFont('helvetica', 'normal');
      doc.text(`GSTIN: ${businessGSTIN}`, margin, 40);

      // Invoice Details (Right Side)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice No: ${invoiceNo}`, pageWidth - margin - 60, 25);
      doc.text(`Date: ${date}`, pageWidth - margin - 60, 30);

      // Client Info (Buyer)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text('BILL TO:', margin, 52);
      doc.setFont('helvetica', 'normal');
      doc.text(clientName, margin, 57);
      doc.text(`GSTIN: ${clientGSTIN}`, margin, 62);

      // Build Table
      const headers = ['Description', 'HSN', 'Qty', 'Rate (₹)', 'GST %', 'CGST (₹)', 'SGST (₹)', 'Total (₹)'];
      const body = items.map((item) => {
        const base = item.qty * item.rate;
        const gst = base * (item.gstPercent / 100);
        return [
          item.name,
          item.hsn,
          item.qty,
          item.rate.toFixed(2),
          `${item.gstPercent}%`,
          (gst / 2).toFixed(2),
          (gst / 2).toFixed(2),
          (base + gst).toFixed(2),
        ];
      });

      autoTable(doc, {
        head: [headers],
        body: body,
        startY: 72,
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
      });

      let finalY = (doc as any).lastAutoTable.finalY + 10;
      const labelX = pageWidth - margin - 70;
      const valX = pageWidth - margin;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);

      doc.text('Subtotal (Taxable Value):', labelX, finalY);
      doc.text(subtotal.toFixed(2), valX, finalY, { align: 'right' });
      finalY += 6;

      doc.text('Central Tax (CGST):', labelX, finalY);
      doc.text(cgstTotal.toFixed(2), valX, finalY, { align: 'right' });
      finalY += 6;

      doc.text('State Tax (SGST):', labelX, finalY);
      doc.text(sgstTotal.toFixed(2), valX, finalY, { align: 'right' });
      finalY += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text('Grand Total (INR):', labelX, finalY);
      doc.text(grandTotal.toFixed(2), valX, finalY, { align: 'right' });

      const pdfBytes = doc.output('arraybuffer');
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      toast({ title: 'Tax Invoice generated successfully!' });
      scrollToDownload();
    } catch (err) {
      console.error(err);
      toast({ title: 'Generation failed', description: 'Could not compile Tax Invoice.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Receipt className="h-6 w-6 text-primary" /> GST INVOICE GENERATOR
              </CardTitle>
              <CardDescription>Create compliant Indian Tax Invoices with automated CGST & SGST calculations per item.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biz">Your Business Name</Label>
                  <Input id="biz" value={businessName} onChange={(e) => { setBusinessName(e.target.value); setPdfUrl(null); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bizgst">Your GSTIN</Label>
                  <Input id="bizgst" value={businessGSTIN} onChange={(e) => { setBusinessGSTIN(e.target.value); setPdfUrl(null); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Company Name</Label>
                  <Input id="client" value={clientName} onChange={(e) => { setClientName(e.target.value); setPdfUrl(null); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientgst">Client GSTIN</Label>
                  <Input id="clientgst" value={clientGSTIN} onChange={(e) => { setClientGSTIN(e.target.value); setPdfUrl(null); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invno">Invoice Number</Label>
                  <Input id="invno" value={invoiceNo} onChange={(e) => { setInvoiceNo(e.target.value); setPdfUrl(null); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => { setDate(e.target.value); setPdfUrl(null); }} />
                </div>
              </div>

              {/* Items Management */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-xs font-bold uppercase tracking-wider block">Billing Items</Label>
                
                <div className="grid grid-cols-6 gap-2">
                  <div className="col-span-2">
                    <Input placeholder="Item Description" value={name} onChange={(e) => setName(e.target.value)} className="text-xs" />
                  </div>
                  <div>
                    <Input placeholder="HSN" value={hsn} onChange={(e) => setHsn(e.target.value)} className="text-xs" />
                  </div>
                  <div>
                    <Input type="number" placeholder="Qty" value={qty === 0 ? '' : qty} onChange={(e) => setQty(Number(e.target.value))} className="text-xs" />
                  </div>
                  <div>
                    <Input type="number" placeholder="Rate (₹)" value={rate === 0 ? '' : rate} onChange={(e) => setRate(Number(e.target.value))} className="text-xs" />
                  </div>
                  <div>
                    <Select value={String(gstPercent)} onValueChange={(val) => setGstPercent(Number(val))}>
                      <SelectTrigger className="h-10 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="28">28%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddItem} variant="outline" className="w-full rounded-xl"><Plus className="h-4 w-4 mr-2" /> Add Item</Button>

                <div className="divide-y max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => {
                    const base = item.qty * item.rate;
                    const gst = base * (item.gstPercent / 100);
                    return (
                      <div key={item.id} className="flex justify-between items-center py-3">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-xs truncate">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">HSN: {item.hsn} • {item.qty} x {item.rate.toFixed(2)} (GST {item.gstPercent}%)</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-xs font-semibold">{formatCurrency(base + gst)}</span>
                          <Button size="icon" variant="ghost" onClick={() => handleRemoveItem(item.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
              <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                GENERATE GST INVOICE PDF
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Download area */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Download Area</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-10 min-h-[300px]">
              {pdfUrl ? (
                <div id="download-section" className="space-y-6 w-full animate-in fade-in zoom-in duration-500 text-center">
                  <div className="inline-flex p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
                    <ShieldCheck className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight">INVOICE CREATED</h3>
                  <div className="my-4 space-y-1 text-sm bg-muted/20 p-4 border rounded-2xl">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Taxable Subtotal:</span>
                      <span className="font-bold">{formatCurrency(subtotal)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Total CGST:</span>
                      <span className="font-bold">{formatCurrency(cgstTotal)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Total SGST:</span>
                      <span className="font-bold">{formatCurrency(sgstTotal)}</span>
                    </p>
                    <p className="flex justify-between border-t pt-2 mt-2 font-bold text-xs uppercase tracking-wider text-primary">
                      <span>Grand Total:</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </p>
                  </div>
                  <a href={pdfUrl} download={`invoice-${invoiceNo}.pdf`} className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD INVOICE PDF
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <Receipt className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Sizing & Render</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our GST Invoice Maker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our GST Invoice Maker is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Generate CGST/SGST compliant tax invoices.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the GST Invoice Maker tool on UseBro.</li>
                        <li>Input your parameters or upload the required file in the field controls.</li>
                        <li>Wait for the tool to process the details dynamically in your browser.</li>
                        <li>Click download, save, or copy the final outputs to your device.</li>
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
                    <h4 className="font-bold mb-2 text-base">Can I use GST Invoice Maker on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
