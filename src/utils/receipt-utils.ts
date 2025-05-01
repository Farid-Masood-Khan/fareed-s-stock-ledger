
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Sale } from '@/types';
import { formatCurrency } from '@/utils/formatters';

// Convert receipt to canvas
export const receiptToCanvas = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff"
  });
};

// Generate PDF from canvas
export const generatePDFFromCanvas = async (canvas: HTMLCanvasElement, filename: string): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, canvas.height * 80 / canvas.width]
  });
  
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, 80, canvas.height * 80 / canvas.width);
  
  return pdf.output('blob');
};

// Download PDF file
export const downloadPDF = async (canvas: HTMLCanvasElement, invoiceNumber: string): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, canvas.height * 80 / canvas.width]
  });
  
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, 80, canvas.height * 80 / canvas.width);
  pdf.save(`receipt-${invoiceNumber}.pdf`);
};

// Generate message for WhatsApp sharing
export const generateReceiptMessage = (sale: Sale): string => {
  return `Receipt for your purchase of ${formatCurrency(sale.total)} on ${new Date(sale.date).toLocaleDateString()}. Invoice #${sale.invoiceNumber}`;
};

// Share via WhatsApp (returns URL)
export const getWhatsAppShareUrl = (phoneNumber: string, message: string, isMobile: boolean): string => {
  const formattedNumber = phoneNumber.replace(/\D/g, '');
  
  if (isMobile) {
    return `whatsapp://send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
  } else {
    return `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
  }
};

// Check if device is mobile
export const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};
