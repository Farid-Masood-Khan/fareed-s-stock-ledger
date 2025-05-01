
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { usePrint } from '@/hooks/use-print';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/use-notification-sound';

interface PrintButtonProps {
  receiptRef: React.RefObject<HTMLDivElement>;
}

const PrintButton: React.FC<PrintButtonProps> = ({ receiptRef }) => {
  const { printElement } = usePrint();
  const { toast } = useToast();
  const { playSound } = useNotificationSound();

  const handlePrint = () => {
    if (receiptRef.current) {
      printElement(receiptRef.current);
    } else {
      toast({
        title: "Error",
        description: "Receipt element not found",
        variant: "destructive",
      });
      playSound('error');
    }
  };

  return (
    <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
      <Printer className="h-4 w-4" />
      Print
    </Button>
  );
};

export default PrintButton;
