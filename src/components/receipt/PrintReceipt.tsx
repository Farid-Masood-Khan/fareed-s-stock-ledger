
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Sale } from '@/types';
import Receipt from './Receipt';
import { usePrint } from '@/hooks/use-print';

interface PrintReceiptProps {
  sale: Sale;
}

const PrintReceipt = ({ sale }: PrintReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { printElement } = usePrint();

  const handlePrint = () => {
    if (receiptRef.current) {
      printElement(receiptRef.current);
    }
  };

  return (
    <div>
      <div className="hidden">
        <Receipt ref={receiptRef} sale={sale} />
      </div>
      <Button onClick={handlePrint} variant="outline" size="sm">
        <Printer className="h-4 w-4 mr-2" />
        Print Receipt
      </Button>
    </div>
  );
};

export default PrintReceipt;
