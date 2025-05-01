
import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Sale, SaleItem } from '@/types';

interface ReceiptProps {
  sale: Sale;
}

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ sale }, ref) => {
  return (
    <div ref={ref} className="p-4 font-mono text-sm" style={{ width: '80mm' }}>
      <div className="text-center mb-4">
        <h1 className="font-bold text-lg">SUBHAN Computers</h1>
        <p className="text-xs">Computer Hardware & Accessories</p>
        <p className="text-xs">Owner: Muhammad Subhan</p>
        <p className="text-xs">Contact: 0300-1234567</p>
        <p className="text-xs">Address: Shop #123, Computer Market, Saddar, Karachi</p>
      </div>

      <div className="border-t border-b border-dashed py-2 mb-2">
        <div className="flex justify-between">
          <span>Invoice #:</span>
          <span>{sale.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{formatDate(sale.date)}</span>
        </div>
        {sale.shopkeeperId && (
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{sale.shopkeeperId}</span>
          </div>
        )}
      </div>

      <table className="w-full mb-2">
        <thead>
          <tr className="border-b">
            <th className="text-left">Item</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item: SaleItem) => (
            <tr key={item.productId}>
              <td className="text-left">{item.productName}</td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">{formatCurrency(item.price)}</td>
              <td className="text-right">{formatCurrency(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dashed pt-2">
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{formatCurrency(sale.total)}</span>
        </div>
        <div className="text-xs text-center mt-4">
          <p>Thank you for your business!</p>
          <p>All prices include VAT</p>
          <p>Warranty terms apply as per product policy</p>
        </div>
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';

export default Receipt;
