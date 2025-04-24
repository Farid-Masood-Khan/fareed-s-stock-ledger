import { Product, Sale, SaleItem, Shopkeeper, Transaction } from "../types";

// Generate a random ID
const generateId = (): string => Math.random().toString(36).substring(2, 10);

// Generate a random date within the last 30 days
const randomRecentDate = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date;
};

// Mock products data
export const mockProducts: Product[] = [
  {
    id: "prod1",
    code: "LT001",
    name: "HP Laptop",
    description: "HP ProBook 450 G8 - 15.6 inch",
    price: 75000,
    costPrice: 65000,
    quantity: 5,
    category: "Laptops",
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01"),
  },
  {
    id: "prod2",
    code: "PH001",
    name: "Samsung Galaxy S23",
    description: "Samsung Galaxy S23 - 8GB RAM, 128GB Storage",
    price: 120000,
    costPrice: 105000,
    quantity: 10,
    category: "Phones",
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01"),
  },
  {
    id: "prod3",
    code: "ACC001",
    name: "USB-C Charging Cable",
    description: "Fast charging USB-C cable - 1.5m",
    price: 500,
    costPrice: 250,
    quantity: 50,
    category: "Accessories",
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01"),
  },
  {
    id: "prod4",
    code: "TAB001",
    name: "iPad Air",
    description: "iPad Air 10.9-inch - 64GB",
    price: 90000,
    costPrice: 78000,
    quantity: 7,
    category: "Tablets",
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01"),
  },
  {
    id: "prod5",
    code: "ACC002",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth Speaker - 20W",
    price: 3500,
    costPrice: 2200,
    quantity: 15,
    category: "Accessories",
    createdAt: new Date("2025-04-01"),
    updatedAt: new Date("2025-04-01"),
  },
];

// Mock shopkeepers
export const mockShopkeepers: Shopkeeper[] = [
  {
    id: "shop1",
    name: "Fareed Electronics",
    contact: "0300-1234567",
    address: "Shop #1, Electronics Market",
    balance: -15000, // Shopkeeper owes us 15,000
    createdAt: new Date("2025-03-01"),
  },
  {
    id: "shop2",
    name: "Ahmed Mobile",
    contact: "0321-7654321",
    address: "Main Street, Mobile Market",
    balance: 5000, // We owe shopkeeper 5,000
    createdAt: new Date("2025-03-05"),
  },
  {
    id: "shop3",
    name: "Tech City",
    contact: "0333-5551234",
    address: "IT Plaza, 2nd Floor",
    balance: 0, // No pending balance
    createdAt: new Date("2025-03-10"),
  },
];

// Generate some mock sales items
const generateMockSaleItems = (count: number): SaleItem[] => {
  const items: SaleItem[] = [];
  for (let i = 0; i < count; i++) {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    items.push({
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      quantity: quantity,
      price: product.price,
      total: product.price * quantity,
    });
  }
  return items;
};

// Mock sales
export const mockSales: Sale[] = Array.from({ length: 20 }, (_, i) => {
  const items = generateMockSaleItems(Math.floor(Math.random() * 3) + 1);
  const total = items.reduce((sum, item) => sum + item.total, 0);
  const hasShopkeeper = Math.random() > 0.5;
  const shopkeeper = hasShopkeeper
    ? mockShopkeepers[Math.floor(Math.random() * mockShopkeepers.length)]
    : undefined;

  return {
    id: `sale${i + 1}`,
    invoiceNumber: `INV-${2025}${String(i + 1).padStart(4, "0")}`,
    date: randomRecentDate(),
    items,
    total,
    paymentMethod: Math.random() > 0.7 ? "Credit Card" : "Cash",
    shopkeeperId: shopkeeper?.id,
    notes: "",
  };
});

// Mock transactions with shopkeepers
export const mockTransactions: Transaction[] = [
  {
    id: "trans1",
    shopkeeperId: "shop1",
    date: new Date("2025-04-10"),
    type: "SALE",
    amount: 25000,
    notes: "Sold 2 HP laptops",
    relatedItems: [
      {
        productId: "prod1",
        productName: "HP Laptop",
        productCode: "LT001",
        quantity: 2,
        price: 75000,
        total: 150000,
      },
    ],
  },
  {
    id: "trans2",
    shopkeeperId: "shop1",
    date: new Date("2025-04-15"),
    type: "PAYMENT_RECEIVED",
    amount: 10000,
    notes: "Partial payment for previous sale",
  },
  {
    id: "trans3",
    shopkeeperId: "shop2",
    date: new Date("2025-04-12"),
    type: "PURCHASE",
    amount: 15000,
    notes: "Purchased accessory items",
    relatedItems: [
      {
        productId: "prod3",
        productName: "USB-C Charging Cable",
        productCode: "ACC001",
        quantity: 20,
        price: 250,
        total: 5000,
      },
      {
        productId: "prod5",
        productName: "Bluetooth Speaker",
        productCode: "ACC002",
        quantity: 5,
        price: 2000,
        total: 10000,
      },
    ],
  },
  {
    id: "trans4",
    shopkeeperId: "shop2",
    date: new Date("2025-04-20"),
    type: "PAYMENT_MADE",
    amount: 10000,
    notes: "Partial payment for previous purchase",
  },
  {
    id: "trans5",
    shopkeeperId: "shop3",
    date: new Date("2025-04-18"),
    type: "SALE",
    amount: 120000,
    notes: "Sold 1 Samsung Galaxy S23",
    relatedItems: [
      {
        productId: "prod2",
        productName: "Samsung Galaxy S23",
        productCode: "PH001",
        quantity: 1,
        price: 120000,
        total: 120000,
      },
    ],
  },
];
