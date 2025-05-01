export interface Customer {
  id: string;
  name: string;
  contact?: string;
  cnic?: string;
  email?: string;
  createdAt: Date;
  totalPurchases?: number;
  purchaseHistory?: Sale[];
  totalAmountSpent?: number;
}
