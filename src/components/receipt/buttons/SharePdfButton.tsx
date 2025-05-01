
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import { Sale } from '@/types';
import { downloadPDF, receiptToCanvas } from '@/utils/receipt-utils';

interface SharePdfButtonProps {
  receiptRef: React.RefObject<HTMLDivElement>;
  sale: Sale;
}

const SharePdfButton: React.FC<SharePdfButtonProps> = ({ receiptRef, sale }) => {
  const { toast } = useToast();
  const { playSound } = useNotificationSound();

  const handleShare = async () => {
    if (!receiptRef.current) {
      toast({
        title: "Error",
        description: "Receipt element not found",
        variant: "destructive",
      });
      playSound('error');
      return;
    }

    try {
      // Create a temporary canvas from the receipt
      const canvas = await receiptToCanvas(receiptRef.current);
      
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
            toast({
              title: "Downloaded",
              description: "Receipt downloaded as PDF (sharing failed)",
            });
            playSound('success');
          }
        } else {
          // Fallback to download if Web Share API is not available
          downloadPDF(canvas, sale.invoiceNumber);
          toast({
            title: "Downloaded",
            description: "Receipt downloaded as PDF",
          });
          playSound('success');
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

  return (
    <Button onClick={handleShare} variant="outline" size="sm" className="flex items-center gap-2">
      <Share className="h-4 w-4" />
      Share PDF
    </Button>
  );
};

export default SharePdfButton;
