
import React, { useRef } from 'react';
import { Sale } from '@/types';
import Receipt from './Receipt';
import PrintButton from './buttons/PrintButton';
import SharePdfButton from './buttons/SharePdfButton';
import WhatsAppDialog from './buttons/WhatsAppDialog';

interface PrintReceiptProps {
  sale: Sale;
}

const PrintReceipt = ({ sale }: PrintReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="hidden">
        <Receipt ref={receiptRef} sale={sale} />
      </div>
      <PrintButton receiptRef={receiptRef} />
      <SharePdfButton receiptRef={receiptRef} sale={sale} />
      <WhatsAppDialog receiptRef={receiptRef} sale={sale} />
    </div>
  );
};

export default PrintReceipt;
