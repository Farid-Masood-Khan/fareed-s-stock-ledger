
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotificationSound } from '@/hooks/use-notification-sound';

export const usePrint = () => {
  const { toast } = useToast();
  const { playSound } = useNotificationSound();
  const [isPrinting, setIsPrinting] = useState(false);

  const printElement = useCallback((content: HTMLElement, options: { 
    title?: string,
    showLogo?: boolean,
    includeHeader?: boolean,
    includeFooter?: boolean,
    footerText?: string,
  } = {}) => {
    const { 
      title = "Print Receipt", 
      showLogo = true, 
      includeHeader = true,
      includeFooter = true,
      footerText = "Thank you for your business!"
    } = options;
    
    setIsPrinting(true);
    
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      setIsPrinting(false);
      playSound('error');
      toast({
        title: "Error",
        description: "Could not open print window. Please check your popup settings.",
        variant: "destructive",
      });
      return;
    }

    // Get current date and time for receipt
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
    
    // Create logo if showLogo is true
    const logoHTML = showLogo ? `
      <div style="text-align: center; margin-bottom: 10px;">
        <div style="font-size: 24px; font-weight: bold; margin: 0;">Stock Ledger</div>
        <div style="font-size: 12px; margin: 0;">Professional Inventory Management</div>
      </div>
    ` : '';

    // Create header if includeHeader is true
    const headerHTML = includeHeader ? `
      <div style="border-bottom: 1px dashed #000; margin-bottom: 10px; padding-bottom: 10px;">
        <div style="display: flex; justify-content: space-between;">
          <div style="font-size: 12px;">Date: ${dateString}</div>
          <div style="font-size: 12px;">Time: ${timeString}</div>
        </div>
      </div>
    ` : '';

    // Create footer if includeFooter is true
    const footerHTML = includeFooter ? `
      <div style="border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; text-align: center;">
        <div style="font-size: 12px;">${footerText}</div>
      </div>
    ` : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            @media print {
              @page {
                margin: 0;
                size: 80mm auto;
              }
              body {
                margin: 10mm;
                padding: 0;
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.4;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                padding: 4px;
                text-align: left;
              }
              .receipt-content {
                width: 100%;
              }
              .text-center {
                text-align: center;
              }
              .text-right {
                text-align: right;
              }
              .text-bold {
                font-weight: bold;
              }
              .divider {
                border-bottom: 1px dashed #000;
                margin: 5px 0;
              }
              .receipt-header {
                text-align: center;
                margin-bottom: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${logoHTML}
            ${headerHTML}
            <div class="receipt-content">
              ${content.outerHTML}
            </div>
            ${footerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Add a small delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsPrinting(false);
      playSound('success');
      toast({
        title: "Success",
        description: "Document sent to printer",
      });
    }, 500);
  }, [toast, playSound]);

  return { printElement, isPrinting };
};
