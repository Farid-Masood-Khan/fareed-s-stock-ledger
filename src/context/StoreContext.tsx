import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  Product,
  Sale,
  Shopkeeper,
  Transaction,
  ReportTimeframe,
  ReportDateRange,
  SalesReport,
  StockReport,
  FinancialSummary,
} from "../types";
import { mockProducts, mockSales, mockShopkeepers, mockTransactions } from "../data/mockData";

interface StoreContextType {
  // Data
  products: Product[];
  sales: Sale[];
  shopkeepers: Shopkeeper[];
  transactions: Transaction[];

  // State management functions
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  addSale: (sale: Omit<Sale, "id">) => void;
  updateSale: (saleId: string, updates: Partial<Sale>) => void;
  deleteSale: (saleId: string) => void;

  addShopkeeper: (shopkeeper: Omit<Shopkeeper, "id" | "createdAt">) => void;
  updateShopkeeper: (shopkeeperId: string, updates: Partial<Shopkeeper>) => void;
  deleteShopkeeper: (shopkeeperId: string) => void;
  
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (transactionId: string) => void;

  // Reports
  generateSalesReport: (timeframe: ReportTimeframe, dateRange?: ReportDateRange) => SalesReport;
  generateStockReport: () => StockReport;
  generateFinancialSummary: () => FinancialSummary;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>(mockShopkeepers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  // Generate a random ID
  const generateId = (): string => Math.random().toString(36).substring(2, 10);

  // Product CRUD operations
  const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  // Sale CRUD operations
  const addSale = (sale: Omit<Sale, "id">) => {
    const newSale: Sale = {
      ...sale,
      id: generateId(),
    };

    // Update product quantities
    sale.items.forEach((item) => {
      updateProduct(item.productId, {
        quantity: (products.find(p => p.id === item.productId)?.quantity || 0) - item.quantity
      });
    });

    setSales((prevSales) => [...prevSales, newSale]);

    // If sale is to a shopkeeper, add transaction
    if (sale.shopkeeperId) {
      addTransaction({
        shopkeeperId: sale.shopkeeperId,
        date: sale.date,
        type: "SALE",
        amount: sale.total,
        notes: `Sale: ${sale.invoiceNumber}`,
        relatedItems: sale.items,
      });

      // Update shopkeeper balance
      setShopkeepers((prevShopkeepers) =>
        prevShopkeepers.map((shopkeeper) =>
          shopkeeper.id === sale.shopkeeperId
            ? { ...shopkeeper, balance: shopkeeper.balance - sale.total }
            : shopkeeper
        )
      );
    }
  };

  const updateSale = (saleId: string, updates: Partial<Sale>) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === saleId ? { ...sale, ...updates } : sale
      )
    );
  };

  const deleteSale = (saleId: string) => {
    setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
  };

  // Shopkeeper CRUD operations
  const addShopkeeper = (shopkeeper: Omit<Shopkeeper, "id" | "createdAt">) => {
    const newShopkeeper: Shopkeeper = {
      ...shopkeeper,
      id: generateId(),
      createdAt: new Date(),
    };
    setShopkeepers((prevShopkeepers) => [...prevShopkeepers, newShopkeeper]);
  };

  const updateShopkeeper = (shopkeeperId: string, updates: Partial<Shopkeeper>) => {
    setShopkeepers((prevShopkeepers) =>
      prevShopkeepers.map((shopkeeper) =>
        shopkeeper.id === shopkeeperId
          ? { ...shopkeeper, ...updates }
          : shopkeeper
      )
    );
  };

  const deleteShopkeeper = (shopkeeperId: string) => {
    setShopkeepers((prevShopkeepers) =>
      prevShopkeepers.filter((shopkeeper) => shopkeeper.id !== shopkeeperId)
    );
  };

  // Transaction CRUD operations
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

    // Update shopkeeper balance based on transaction type
    const shopkeeper = shopkeepers.find((s) => s.id === transaction.shopkeeperId);
    if (shopkeeper) {
      let balanceChange = 0;
      switch (transaction.type) {
        case "SALE":
          balanceChange = -transaction.amount; // Shopkeeper owes us
          break;
        case "PURCHASE":
          balanceChange = transaction.amount; // We owe the shopkeeper
          break;
        case "PAYMENT_RECEIVED":
          balanceChange = transaction.amount; // Reduce shopkeeper debt
          break;
        case "PAYMENT_MADE":
          balanceChange = -transaction.amount; // Reduce our debt
          break;
      }

      updateShopkeeper(shopkeeper.id, {
        balance: shopkeeper.balance + balanceChange,
      });
    }
  };

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, ...updates }
          : transaction
      )
    );
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== transactionId)
    );
  };

  // Reports
  const generateSalesReport = (timeframe: ReportTimeframe, dateRange?: ReportDateRange): SalesReport => {
    let filteredSales = [...sales];
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    // Filter sales based on timeframe
    switch (timeframe) {
      case "daily":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case "custom":
        if (dateRange) {
          startDate = new Date(dateRange.startDate);
          endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
        }
        break;
    }

    // Filter sales by date
    filteredSales = filteredSales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });

    // Calculate total sales and count
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const salesCount = filteredSales.length;

    // Calculate profit (assuming we have cost price data)
    const totalProfit = filteredSales.reduce((sum, sale) => {
      return sum + sale.items.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          return itemSum + ((item.price - product.costPrice) * item.quantity);
        }
        return itemSum;
      }, 0);
    }, 0);

    // Get top selling products
    const productSalesMap = new Map<string, { name: string, quantity: number, revenue: number }>();
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = productSalesMap.get(item.productId) || { name: item.productName, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.total;
        productSalesMap.set(item.productId, existing);
      });
    });
    
    const topSellingProducts = Array.from(productSalesMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        quantitySold: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    return {
      timeframe,
      dateRange: { startDate, endDate },
      totalSales,
      totalProfit,
      salesCount,
      topSellingProducts,
    };
  };

  const generateStockReport = (): StockReport => {
    const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
    const totalValue = products.reduce((sum, product) => sum + (product.quantity * product.costPrice), 0);
    const lowStockThreshold = 5; // Define what "low stock" means
    
    const lowStockItems = products.filter(product => product.quantity > 0 && product.quantity <= lowStockThreshold);
    const outOfStockItems = products.filter(product => product.quantity === 0);

    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
    };
  };

  const generateFinancialSummary = (): FinancialSummary => {
    // Calculate total stock value
    const totalStockValue = products.reduce(
      (sum, product) => sum + product.quantity * product.costPrice,
      0
    );

    // Calculate total sales
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);

    // Calculate total purchases
    const totalPurchases = transactions
      .filter((transaction) => transaction.type === "PURCHASE")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    // Calculate dues from and to shopkeepers
    const totalDueFromShopkeepers = shopkeepers
      .filter((shopkeeper) => shopkeeper.balance < 0)
      .reduce((sum, shopkeeper) => sum + Math.abs(shopkeeper.balance), 0);

    const totalDueToShopkeepers = shopkeepers
      .filter((shopkeeper) => shopkeeper.balance > 0)
      .reduce((sum, shopkeeper) => sum + shopkeeper.balance, 0);

    // Net balance
    const netBalance = totalStockValue + totalDueFromShopkeepers - totalDueToShopkeepers;

    return {
      totalStockValue,
      totalSales,
      totalPurchases,
      totalDueFromShopkeepers,
      totalDueToShopkeepers,
      netBalance,
    };
  };

  const value: StoreContextType = {
    products,
    sales,
    shopkeepers,
    transactions,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    updateSale,
    deleteSale,
    addShopkeeper,
    updateShopkeeper,
    deleteShopkeeper,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    generateSalesReport,
    generateStockReport,
    generateFinancialSummary,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
