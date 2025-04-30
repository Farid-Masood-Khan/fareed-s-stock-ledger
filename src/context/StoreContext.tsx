import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import {
  Product,
  Sale,
  Shopkeeper,
  Transaction,
  Customer,
  ReportTimeframe,
  ReportDateRange,
  SalesReport,
  StockReport,
  FinancialSummary,
  User,
} from "../types";
import { mockProducts, mockSales, mockShopkeepers, mockTransactions } from "../data/mockData";

interface StoreContextType {
  // Data
  products: Product[];
  sales: Sale[];
  shopkeepers: Shopkeeper[];
  transactions: Transaction[];
  customers?: Customer[];
  currentUser?: User | null;

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

  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) => Customer;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  deleteCustomer: (customerId: string) => void;
  
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Reports
  generateSalesReport: (timeframe: ReportTimeframe, dateRange?: ReportDateRange) => SalesReport;
  generateStockReport: () => StockReport;
  generateFinancialSummary: () => FinancialSummary;
  
  // Init utility
  clearMockData: () => void;
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

// Default admin user
const DEFAULT_USER: User = {
  id: "default-admin",
  username: "subhancomputer",
  role: "admin",
  createdAt: new Date(),
};

// Default password (should be hashed in a real app)
const DEFAULT_PASSWORD = "allahhuakbar786";

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts, dateReviver) : mockProducts;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const savedSales = localStorage.getItem("sales");
    return savedSales ? JSON.parse(savedSales, dateReviver) : mockSales;
  });
  
  const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>(() => {
    const savedShopkeepers = localStorage.getItem("shopkeepers");
    return savedShopkeepers ? JSON.parse(savedShopkeepers, dateReviver) : mockShopkeepers;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions, dateReviver) : mockTransactions;
  });
  
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const savedCustomers = localStorage.getItem("customers");
    return savedCustomers ? JSON.parse(savedCustomers, dateReviver) : [];
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser, dateReviver) : null;
  });

  // Helper function to convert date strings to Date objects when parsing JSON
  function dateReviver(key: string, value: any) {
    if (typeof value === 'string') {
      // Check if the string is a date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
      if (dateRegex.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("sales", JSON.stringify(sales));
    localStorage.setItem("shopkeepers", JSON.stringify(shopkeepers));
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("customers", JSON.stringify(customers));
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [products, sales, shopkeepers, transactions, customers, currentUser]);

  // Generate a random ID
  const generateId = (): string => Math.random().toString(36).substring(2, 10);

  // Authentication functions
  const login = (username: string, password: string): boolean => {
    if (username === DEFAULT_USER.username && password === DEFAULT_PASSWORD) {
      setCurrentUser(DEFAULT_USER);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

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

  // Customer CRUD operations
  const addCustomer = (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer => {
    const newCustomer: Customer = {
      ...customer,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId
          ? { ...customer, ...updates, updatedAt: new Date() }
          : customer
      )
    );
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter((customer) => customer.id !== customerId)
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
    // Get the sale before deleting
    const saleToDelete = sales.find(s => s.id === saleId);
    
    if (saleToDelete) {
      // Return items to inventory
      saleToDelete.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          updateProduct(item.productId, {
            quantity: product.quantity + item.quantity
          });
        }
      });
      
      // If sale was to a shopkeeper, adjust balance and remove transaction
      if (saleToDelete.shopkeeperId) {
        const relatedTransaction = transactions.find(
          t => t.type === "SALE" && t.shopkeeperId === saleToDelete.shopkeeperId && 
              t.notes?.includes(saleToDelete.invoiceNumber)
        );
        
        if (relatedTransaction) {
          deleteTransaction(relatedTransaction.id);
        }
        
        // Adjust shopkeeper balance
        setShopkeepers((prevShopkeepers) =>
          prevShopkeepers.map((shopkeeper) =>
            shopkeeper.id === saleToDelete.shopkeeperId
              ? { ...shopkeeper, balance: shopkeeper.balance + saleToDelete.total }
              : shopkeeper
          )
        );
      }
    }
    
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
  
  // Clear all mock data
  const clearMockData = () => {
    setProducts([]);
    setSales([]);
    setShopkeepers([]);
    setTransactions([]);
    setCustomers([]);
    
    localStorage.removeItem("products");
    localStorage.removeItem("sales");
    localStorage.removeItem("shopkeepers");
    localStorage.removeItem("transactions");
    localStorage.removeItem("customers");
  };

  const value: StoreContextType = {
    products,
    sales,
    shopkeepers,
    transactions,
    customers,
    currentUser,
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
    addCustomer,
    updateCustomer,
    deleteCustomer,
    login,
    logout,
    generateSalesReport,
    generateStockReport,
    generateFinancialSummary,
    clearMockData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
