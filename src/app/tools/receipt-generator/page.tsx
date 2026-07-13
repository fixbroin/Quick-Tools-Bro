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
import { scrollToDownload } from '@/lib/utils';

interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function ReceiptGeneratorPage() {
  const [businessName, setBusinessName] = useState('My Business Ltd');
  const [customerName, setCustomerName] = useState('Jane Doe');
  const [receiptNumber, setReceiptNumber] = useState('REC-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: '1', name: 'Web Design Service', quantity: 1, price: 15000 },
    { id: '2', name: 'Domain Registration', quantity: 1, price: 1200 },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  
  const [taxRate, setTaxRate] = useState<number>(18); // default GST

  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast({ title: "Blank Item Name", description: "Please enter an item name.", variant: "destructive" });
      return;
    }
    const item: ReceiptItem = {
      id: String(Date.now()),
      name: newItemName,
      quantity: newItemQty,
      price: newItemPrice,
    };
    setItems(prev => [...prev, item]);
    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice(0);
    setPdfUrl(null);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setPdfUrl(null);
  };

  const getTotals = () => {
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = getTotals();

  const handleGenerate = () => {
    if (items.length === 0) {
      toast({ title: "No items", description: "Please add at least one item to generate a receipt.", variant: "destructive" });
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

      // Business Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(41, 171, 226); // primary blue
      doc.text(businessName.toUpperCase(), margin, 25);

      // Receipt info (right side)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Receipt #: ${receiptNumber}`, pageWidth - margin - 50, 22);
      doc.text(`Date: ${date}`, pageWidth - margin - 50, 27);

      // Customer info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text('BILLED TO:', margin, 45);
      
      doc.setFont('helvetica', 'normal');
      doc.text(customerName, margin, 50);

      // Draw autoTable
      const headers = ['Item Description', 'Qty', 'Unit Price (INR)', 'Total (INR)'];
      const body = items.map((item) => [
        item.name,
        item.quantity,
        item.price.toFixed(2),
        (item.quantity * item.price).toFixed(2),
      ]);

      autoTable(doc, {
        head: [headers],
        body: body,
        startY: 60,
        theme: 'striped',
        headStyles: { fillColor: [41, 171, 226] },
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'right' },
        },
      });

      // Fetch final table height to position totals box
      let finalY = (doc as any).lastAutoTable.finalY + 10;

      // Totals Box (Right aligned)
      const labelX = pageWidth - margin - 60;
      const valX = pageWidth - margin;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);

      doc.text('Subtotal:', labelX, finalY);
      doc.text(subtotal.toFixed(2), valX, finalY, { align: 'right' });
      finalY += 6;

      doc.text(`Tax (${taxRate}%):`, labelX, finalY);
      doc.text(tax.toFixed(2), valX, finalY, { align: 'right' });
      finalY += 8;

      // Gross Total
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text('Gross Total (INR):', labelX, finalY);
      doc.text(total.toFixed(2), valX, finalY, { align: 'right' });

      const pdfBytes = doc.output('arraybuffer');
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      toast({ title: 'Receipt Generated successfully!' });
      scrollToDownload();
    } catch (err) {
      console.error(err);
      toast({ title: 'Generation failed', description: 'Failed to build receipt PDF.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Receipt form */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Receipt className="h-6 w-6 text-primary" /> RECEIPT GENERATOR
              </CardTitle>
              <CardDescription>Enter details of your items and customers to build downloadable PDF receipts client-side.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biz">Business / Brand Name</Label>
                  <Input id="biz" value={businessName} onChange={(e) => { setBusinessName(e.target.value); setPdfUrl(null); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cust">Customer Name</Label>
                  <Input id="cust" value={customerName} onChange={(e) => { setCustomerName(e.target.value); setPdfUrl(null); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recnum">Receipt Number</Label>
                  <Input id="recnum" value={receiptNumber} onChange={(e) => { setReceiptNumber(e.target.value); setPdfUrl(null); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => { setDate(e.target.value); setPdfUrl(null); }} />
                </div>
              </div>

              {/* Items Management */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-xs font-bold uppercase tracking-wider block">Items Ledger</Label>
                
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-2">
                    <Input placeholder="Item Description" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                  </div>
                  <div>
                    <Input type="number" min={1} placeholder="Qty" value={newItemQty === 0 ? '' : newItemQty} onChange={(e) => setNewItemQty(Number(e.target.value))} />
                  </div>
                  <div>
                    <Input type="number" placeholder="Price (INR)" value={newItemPrice === 0 ? '' : newItemPrice} onChange={(e) => setNewItemPrice(Number(e.target.value))} />
                  </div>
                </div>
                <Button onClick={handleAddItem} variant="outline" className="w-full rounded-xl"><Plus className="h-4 w-4 mr-2" /> Add Item</Button>

                <div className="divide-y max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-xs truncate">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.quantity} x {item.price.toFixed(2)} INR</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs font-semibold">{(item.quantity * item.price).toFixed(2)} INR</span>
                        <Button size="icon" variant="ghost" onClick={() => handleRemoveItem(item.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="tax">Tax / GST Rate (%)</Label>
                <Input id="tax" type="number" value={taxRate} onChange={(e) => { setTaxRate(Number(e.target.value)); setPdfUrl(null); }} />
              </div>

            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
              <Button className="w-full h-14 rounded-2xl font-black italic text-lg shadow-lg shadow-primary/20" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                GENERATE RECEIPT PDF
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
                  <h3 className="text-xl font-black italic tracking-tight">RECEIPT CREATED</h3>
                  <div className="my-4 space-y-1 text-sm bg-muted/20 p-4 border rounded-2xl">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-bold">{subtotal.toFixed(2)} INR</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Tax ({taxRate}%):</span>
                      <span className="font-bold">{tax.toFixed(2)} INR</span>
                    </p>
                    <p className="flex justify-between border-t pt-2 mt-2 font-bold text-xs uppercase tracking-wider text-primary">
                      <span>Total Value:</span>
                      <span>{total.toFixed(2)} INR</span>
                    </p>
                  </div>
                  <a href={pdfUrl} download={`receipt-${receiptNumber}.pdf`} className="w-full">
                    <Button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                      <Download className="mr-2 h-4 w-4" /> DOWNLOAD RECEIPT PDF
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
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Receipt Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Receipt Generator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Create sales and donation receipt PDFs client-side.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Receipt Generator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Receipt Generator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Receipt Generator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Receipt Generator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
