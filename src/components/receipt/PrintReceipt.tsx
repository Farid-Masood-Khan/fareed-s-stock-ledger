
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Share, Download, MessageSquare } from 'lucide-react';
import { Sale } from '@/types';
import Receipt from './Receipt';
import { usePrint } from '@/hooks/use-print';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PrintReceiptProps {
  sale: Sale;
}

const PrintReceipt = ({ sale }: PrintReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { printElement } = usePrint();
  const { toast } = useToast();
  const { playSound } = useNotificationSound();
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const handlePrint = () => {
    if (receiptRef.current) {
      printElement(receiptRef.current);
    }
  };

  const handleShare = async () => {
    if (!receiptRef.current) return;

    try {
      // Create a temporary canvas from the receipt
      const receiptElement = receiptRef.current;
      const canvas = await html2canvas(receiptElement);
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast({
            title: "Error",
            description: "Could not generate PDF for sharing",
            variant: "destructive",
          });
          playSound('error');
          return;
        }
        
        // Create a file from blob
        const file = new File([blob], `receipt-${sale.invoiceNumber}.pdf`, { type: 'application/pdf' });
        
        // Share the file if Web Share API is available
        if (navigator.share) {
          try {
            await navigator.share({
              files: [file],
              title: `Receipt #${sale.invoiceNumber}`,
              text: 'Here is your receipt',
            });
            playSound('success');
            toast({
              title: "Success",
              description: "Receipt shared successfully",
            });
          } catch (error) {
            console.error('Error sharing:', error);
            // Fallback to download if sharing fails
            downloadPDF(canvas, sale.invoiceNumber);
          }
        } else {
          // Fallback to download if Web Share API is not available
          downloadPDF(canvas, sale.invoiceNumber);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Could not generate PDF for sharing",
        variant: "destructive",
      });
      playSound('error');
    }
  };

  const downloadPDF = async (canvas: HTMLCanvasElement, invoiceNumber: string) => {
    try {
      // Create a PDF using jsPDF
      const { default: JsPDF } = await import('jspdf');
      const pdf = new JsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, canvas.height * 80 / canvas.width]
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 80, canvas.height * 80 / canvas.width);
      pdf.save(`receipt-${invoiceNumber}.pdf`);
      
      toast({
        title: "Downloaded",
        description: "Receipt downloaded as PDF",
      });
      playSound('success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Could not generate PDF",
        variant: "destructive",
      });
      playSound('error');
    }
  };

  const shareViaWhatsApp = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      playSound('error');
      return;
    }

    try {
      // Format phone number (remove spaces, +, etc)
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      
      // Generate PDF
      const receiptElement = receiptRef.current;
      if (!receiptElement) return;
      
      const canvas = await html2canvas(receiptElement);
      const { default: JsPDF } = await import('jspdf');
      const pdf = new JsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, canvas.height * 80 / canvas.width]
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 80, canvas.height * 80 / canvas.width);
      
      // Generate PDF blob
      const pdfBlob = pdf.output('blob');
      
      // Check if mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile, we can directly open WhatsApp
        const message = `Receipt for your purchase of ${formatCurrency(sale.total)} on ${new Date(sale.date).toLocaleDateString()}. Invoice #${sale.invoiceNumber}`;
        const url = `whatsapp://send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        
        toast({
          title: "WhatsApp Opening",
          description: "Redirecting to WhatsApp with your message",
        });
      } else {
        // For desktop, open WhatsApp Web
        const message = `Receipt for your purchase of ${formatCurrency(sale.total)} on ${new Date(sale.date).toLocaleDateString()}. Invoice #${sale.invoiceNumber}`;
        const url = `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        
        toast({
          title: "WhatsApp Web",
          description: "Opening WhatsApp Web with your message. You'll need to send the receipt separately.",
        });
      }
      
      playSound('success');
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast({
        title: "Error",
        description: "Could not share via WhatsApp",
        variant: "destructive",
      });
      playSound('error');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="hidden">
        <Receipt ref={receiptRef} sale={sale} />
      </div>
      <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
        <Printer className="h-4 w-4" />
        Print
      </Button>
      <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center gap-2">
        <Share className="h-4 w-4" />
        Share PDF
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white hover:text-white border-green-600">
            <MessageSquare className="h-4 w-4" />
            WhatsApp
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Receipt via WhatsApp</DialogTitle>
            <DialogDescription>
              Enter the phone number to share the receipt with.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+92 300 1234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Include country code (e.g., +92 for Pakistan)
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={shareViaWhatsApp} className="bg-green-500 hover:bg-green-600">
              <MessageSquare className="h-4 w-4 mr-2" /> Share via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrintReceipt;

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
  }).format(amount);
}

// External dependency for HTML to canvas conversion
function html2canvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  return import('html2canvas').then(module => {
    return module.default(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff"
    });
  });
}
