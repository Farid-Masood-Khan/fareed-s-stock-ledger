
export interface Customer {
  id: string;
  name: string;
  contact?: string;
  cnic?: string;
  email?: string;
  createdAt: Date;
  updatedAt?: Date;
  totalPurchases?: number;
  purchaseHistory?: Sale[];
  totalAmountSpent?: number;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  price: number;
  costPrice: number;
  quantity: number;
  category?: string;
  supplier?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  date: Date;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  shopkeeperId?: string;
  customerId?: string;
  notes?: string;
}

export interface Shopkeeper {
  id: string;
  name: string;
  contact?: string;
  address?: string;
  balance: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  shopkeeperId: string;
  date: Date;
  type: 'SALE' | 'PURCHASE' | 'PAYMENT_RECEIVED' | 'PAYMENT_MADE';
  amount: number;
  notes?: string;
  relatedItems?: any[];
}

export interface User {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

export type ReportTimeframe = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface ReportDateRange {
  startDate: Date;
  endDate: Date;
}

export interface SalesReport {
  timeframe: ReportTimeframe;
  dateRange: ReportDateRange;
  totalSales: number;
  totalProfit: number;
  salesCount: number;
  topSellingProducts: {
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }[];
}

export interface StockReport {
  totalItems: number;
  totalValue: number;
  lowStockItems: Product[];
  outOfStockItems: Product[];
}

export interface FinancialSummary {
  totalStockValue: number;
  totalSales: number;
  totalPurchases: number;
  totalDueFromShopkeepers: number;
  totalDueToShopkeepers: number;
  netBalance: number;
}
