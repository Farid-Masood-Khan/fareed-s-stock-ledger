// Product represents an item in inventory
export interface Product {
  id: string;
  code: string; // Custom code or barcode
  name: string;
  description?: string;
  price: number;
  costPrice: number; // To calculate profit
  quantity: number; // Current stock quantity
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sale represents a sales transaction
export interface Sale {
  id: string;
  invoiceNumber: string;
  date: Date;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  shopkeeperId?: string; // Optional, if sale is to a shopkeeper
  customerId?: string; // Optional, if sale is to a specific customer
  notes?: string;
}

// SaleItem represents an item in a sale
export interface SaleItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  total: number;
}

// Shopkeeper represents a business partner
export interface Shopkeeper {
  id: string;
  name: string;
  contact?: string;
  address?: string;
  balance: number; // Negative means they owe you, positive means you owe them
  createdAt: Date;
}

// Customer represents an individual customer
export interface Customer {
  id: string;
  name: string;
  contact?: string;
  cnic?: string;
  email?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction represents a transaction with a shopkeeper
export interface Transaction {
  id: string;
  shopkeeperId: string;
  date: Date;
  type: "SALE" | "PURCHASE" | "PAYMENT_RECEIVED" | "PAYMENT_MADE";
  amount: number;
  notes?: string;
  relatedItems?: SaleItem[];
}

// Report types for different time periods
export type ReportTimeframe = "daily" | "weekly" | "monthly" | "yearly" | "custom";

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
