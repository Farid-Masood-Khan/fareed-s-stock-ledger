
// Format number as currency (PKR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date to readable format
export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format time to readable format
export function formatTime(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format date and time
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

// Generate invoice number
export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}${day}-${random}`;
}

// Get color for transaction type
export function getTransactionTypeColor(type: string): string {
  switch (type) {
    case 'SALE':
      return 'bg-green-100 text-green-800';
    case 'PURCHASE':
      return 'bg-blue-100 text-blue-800';
    case 'PAYMENT_RECEIVED':
      return 'bg-purple-100 text-purple-800';
    case 'PAYMENT_MADE':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Format transaction type for display
export function formatTransactionType(type: string): string {
  switch (type) {
    case 'SALE':
      return 'Sale';
    case 'PURCHASE':
      return 'Purchase';
    case 'PAYMENT_RECEIVED':
      return 'Payment Received';
    case 'PAYMENT_MADE':
      return 'Payment Made';
    default:
      return type;
  }
}
