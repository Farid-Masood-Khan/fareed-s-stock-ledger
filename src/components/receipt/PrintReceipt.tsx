
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Share } from 'lucide-react';
import { Sale } from '@/types';
import Receipt from './Receipt';
import { usePrint } from '@/hooks/use-print';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/use-notification-sound';

interface PrintReceiptProps {
  sale: Sale;
}

const PrintReceipt = ({ sale }: PrintReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { printElement } = usePrint();
  const { toast } = useToast();
  const { playSound } = useNotificationSound();

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

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="hidden">
        <Receipt ref={receiptRef} sale={sale} />
      </div>
      <Button onClick={handlePrint} variant="outline" size="sm">
        <Printer className="h-4 w-4 mr-2" />
        Print Receipt
      </Button>
      <Button onClick={handleShare} variant="outline" size="sm">
        <Share className="h-4 w-4 mr-2" />
        Share PDF
      </Button>
    </div>
  );
};

export default PrintReceipt;

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
