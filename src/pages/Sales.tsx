
import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, formatDateTime, generateInvoiceNumber } from "@/utils/formatters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Receipt, Printer, User } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Sale, SaleItem, Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const Sales = () => {
  const { sales, products, shopkeepers, customers, addSale, deleteSale, addCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewSale, setViewSale] = useState<Sale | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newSale, setNewSale] = useState<{
    items: Array<{ productId: string; quantity: number; price: number }>;
    paymentMethod: string;
    shopkeeperId?: string;
    customerId?: string;
    customerName?: string;
    customerContact?: string;
    customerCnic?: string;
    customerEmail?: string;
    isNewCustomer: boolean;
    notes: string;
  }>({
    items: [],
    paymentMethod: "Cash",
    shopkeeperId: "",
    customerId: "",
    customerName: "",
    customerContact: "",
    customerCnic: "",
    customerEmail: "",
    isNewCustomer: false,
    notes: "",
  });
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Filter sales based on search term
  const filteredSales = sales
    .filter(
      (sale) =>
        sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.shopkeeperId && shopkeepers.find(s => s.id === sale.shopkeeperId)?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sale.customerId && customers?.find(c => c.id === sale.customerId)?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        sale.items.some(item => 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.productCode.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Filter products in new sale dialog
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.code.toLowerCase().includes(searchProduct.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchProduct.toLowerCase())
  );

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSearchProduct("");
  };

  const handleAddProductToSale = () => {
    if (!selectedProduct) return;
    
    if (quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than zero",
        variant: "destructive",
      });
      return;
    }
    
    if (quantity > selectedProduct.quantity) {
      toast({
        title: "Error",
        description: "Not enough stock available",
        variant: "destructive",
      });
      return;
    }

    const existingItemIndex = newSale.items.findIndex(
      item => item.productId === selectedProduct.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...newSale.items];
      const totalQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (totalQuantity > selectedProduct.quantity) {
        toast({
          title: "Error",
          description: "Not enough stock available",
          variant: "destructive",
        });
        return;
      }
      
      updatedItems[existingItemIndex].quantity = totalQuantity;
      setNewSale({ ...newSale, items: updatedItems });
    } else {
      // Add new item
      setNewSale({
        ...newSale,
        items: [
          ...newSale.items,
          {
            productId: selectedProduct.id,
            quantity,
            price: selectedProduct.price,
          },
        ],
      });
    }

    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItemFromSale = (index: number) => {
    const updatedItems = [...newSale.items];
    updatedItems.splice(index, 1);
    setNewSale({ ...newSale, items: updatedItems });
  };

  const calculateTotal = () => {
    return newSale.items.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const handleAddSale = () => {
    if (newSale.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product",
        variant: "destructive",
      });
      return;
    }

    let customerId = newSale.customerId;

    // Handle new customer creation if needed
    if (newSale.isNewCustomer && newSale.customerName) {
      // Check if a customer with the same contact already exists
      const existingCustomer = customers?.find(
        c => c.contact === newSale.customerContact || c.cnic === newSale.customerCnic
      );

      if (existingCustomer) {
        customerId = existingCustomer.id;
        toast({
          title: "Customer Already Exists",
          description: `Using existing customer record for ${existingCustomer.name}`,
        });
      } else {
        // Add new customer
        const newCustomer = addCustomer({
          name: newSale.customerName,
          contact: newSale.customerContact,
          cnic: newSale.customerCnic,
          email: newSale.customerEmail,
        });
        
        customerId = newCustomer.id;
      }
    }

    const saleItems: SaleItem[] = newSale.items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        productCode: product.code,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      };
    });

    const sale: Omit<Sale, "id"> = {
      invoiceNumber: generateInvoiceNumber(),
      date: new Date(),
      items: saleItems,
      total: calculateTotal(),
      paymentMethod: newSale.paymentMethod,
      shopkeeperId: newSale.shopkeeperId || undefined,
      customerId: customerId || undefined,
      notes: newSale.notes,
    };

    addSale(sale);

    toast({
      title: "Success",
      description: "Sale recorded successfully",
    });

    // Reset form
    setNewSale({
      items: [],
      paymentMethod: "Cash",
      shopkeeperId: "",
      customerId: "",
      customerName: "",
      customerContact: "",
      customerCnic: "",
      customerEmail: "",
      isNewCustomer: false,
      notes: "",
    });
    
    setIsAddDialogOpen(false);
  };

  const handleDeleteSale = () => {
    if (saleToDelete) {
      deleteSale(saleToDelete);
      
      toast({
        title: "Success",
        description: "Sale deleted successfully",
      });
      
      setSaleToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handlePrintReceipt = (sale: Sale) => {
    // Create a printable version of the receipt
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const shopkeeper = sale.shopkeeperId 
      ? shopkeepers.find(s => s.id === sale.shopkeeperId)
      : null;
    
    const customer = sale.customerId
      ? customers?.find(c => c.id === sale.customerId)
      : null;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Sales Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .receipt { max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .subtitle { font-size: 12px; color: #666; }
            .info { margin-bottom: 15px; font-size: 12px; }
            .info div { margin-bottom: 5px; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            .items th { border-bottom: 1px solid #ddd; padding: 8px 5px; text-align: left; font-size: 12px; }
            .items td { padding: 8px 5px; text-align: left; font-size: 12px; }
            .total { text-align: right; margin-top: 10px; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #999; }
            @media print {
              body { margin: 0; padding: 10px; }
              .receipt { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="title">Stock Ledger Receipt</div>
              <div class="subtitle">Your Business Name</div>
              <div class="subtitle">Your Address, Phone</div>
            </div>
            
            <div class="info">
              <div><strong>Invoice:</strong> ${sale.invoiceNumber}</div>
              <div><strong>Date:</strong> ${formatDateTime(sale.date)}</div>
              <div><strong>Payment:</strong> ${sale.paymentMethod}</div>
              ${shopkeeper ? `<div><strong>Shopkeeper:</strong> ${shopkeeper.name}</div>` : ''}
              ${customer ? `<div><strong>Customer:</strong> ${customer.name}</div>` : ''}
              ${customer?.contact ? `<div><strong>Contact:</strong> ${customer.contact}</div>` : ''}
            </div>
            
            <table class="items">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${sale.items.map(item => `
                  <tr>
                    <td>${item.productName}<br><small>${item.productCode}</small></td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              <div>Total: ${formatCurrency(sale.total)}</div>
            </div>
            
            ${sale.notes ? `<div style="margin-top: 15px; font-size: 12px;"><strong>Notes:</strong> ${sale.notes}</div>` : ''}
            
            <div class="footer">
              <p>Thank you for your business!</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Sales Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>New Sale</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Record New Sale</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Add Products</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {searchProduct && (
                    <div className="border rounded-md mt-1 max-h-40 overflow-y-auto">
                      {filteredProducts.length === 0 ? (
                        <p className="p-2 text-sm text-muted-foreground">No products found</p>
                      ) : (
                        filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-2 hover:bg-muted cursor-pointer flex justify-between items-center border-b last:border-0"
                            onClick={() => handleSelectProduct(product)}
                          >
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {product.code} • {formatCurrency(product.price)} • Stock: {product.quantity}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectProduct(product);
                              }}
                            >
                              Select
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  
                  {selectedProduct && (
                    <div className="border rounded-md p-4 mt-2 bg-muted/30">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Selected Product</Label>
                          <div className="font-medium mt-1">{selectedProduct.name} ({selectedProduct.code})</div>
                          <div className="text-sm text-muted-foreground">
                            Price: {formatCurrency(selectedProduct.price)} • Available: {selectedProduct.quantity}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="quantity"
                              type="number"
                              min={1}
                              max={selectedProduct.quantity}
                              value={quantity}
                              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            />
                            <Button onClick={handleAddProductToSale}>Add</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {newSale.items.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Sale Items</Label>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-2">Product</th>
                            <th className="text-right p-2">Price</th>
                            <th className="text-right p-2">Qty</th>
                            <th className="text-right p-2">Total</th>
                            <th className="text-right p-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newSale.items.map((item, index) => {
                            const product = products.find(p => p.id === item.productId)!;
                            return (
                              <tr key={index} className="border-t">
                                <td className="p-2">
                                  <div>{product.name}</div>
                                  <div className="text-xs text-muted-foreground">{product.code}</div>
                                </td>
                                <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                                <td className="p-2 text-right">{item.quantity}</td>
                                <td className="p-2 text-right">{formatCurrency(item.quantity * item.price)}</td>
                                <td className="p-2 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItemFromSale(index)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="border-t bg-muted/30">
                            <td colSpan={3} className="p-2 text-right font-medium">Total:</td>
                            <td className="p-2 text-right font-bold">{formatCurrency(calculateTotal())}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select 
                      value={newSale.paymentMethod} 
                      onValueChange={(value) => setNewSale({...newSale, paymentMethod: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Credit">Credit (Due)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer Type</Label>
                    <Select
                      value={newSale.isNewCustomer ? "new" : (newSale.customerId ? "existing" : (newSale.shopkeeperId ? "shopkeeper" : "direct"))}
                      onValueChange={(value) => {
                        setNewSale({
                          ...newSale, 
                          isNewCustomer: value === "new", 
                          shopkeeperId: value === "shopkeeper" ? newSale.shopkeeperId : "",
                          customerId: value === "existing" ? newSale.customerId : ""
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shopkeeper">Shopkeeper</SelectItem>
                        <SelectItem value="existing">Existing Customer</SelectItem>
                        <SelectItem value="new">New Customer</SelectItem>
                        <SelectItem value="direct">Direct Sale (No Customer)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Customer or Shopkeeper selection based on type */}
                {!newSale.isNewCustomer && newSale.paymentMethod && (
                  <div className="space-y-2">
                    {newSale.isNewCustomer === false && (
                      <div>
                        <Label htmlFor="entity">
                          {newSale.shopkeeperId !== undefined ? "Shopkeeper" : "Customer"}
                        </Label>
                        <Select 
                          value={newSale.shopkeeperId || newSale.customerId || "none"} 
                          onValueChange={(value) => {
                            if (value === "none") {
                              setNewSale({
                                ...newSale, 
                                shopkeeperId: "",
                                customerId: "",
                              });
                            } else if (shopkeepers.some(s => s.id === value)) {
                              setNewSale({
                                ...newSale, 
                                shopkeeperId: value,
                                customerId: "",
                              });
                            } else {
                              setNewSale({
                                ...newSale, 
                                customerId: value,
                                shopkeeperId: "",
                              });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None (Direct Sale)</SelectItem>
                            {shopkeepers.length > 0 && (
                              <>
                                <SelectItem value="shopkeepers-group" disabled>
                                  --- Shopkeepers ---
                                </SelectItem>
                                {shopkeepers.map(shopkeeper => (
                                  <SelectItem key={`shopkeeper-${shopkeeper.id}`} value={shopkeeper.id}>
                                    {shopkeeper.name}
                                  </SelectItem>
                                ))}
                              </>
                            )}
                            {customers && customers.length > 0 && (
                              <>
                                <SelectItem value="customers-group" disabled>
                                  --- Regular Customers ---
                                </SelectItem>
                                {customers.map(customer => (
                                  <SelectItem key={`customer-${customer.id}`} value={customer.id}>
                                    {customer.name}
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {/* New Customer Form */}
                {newSale.isNewCustomer && (
                  <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                    <h4 className="font-medium flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      New Customer Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Name *</Label>
                        <Input
                          id="customerName"
                          placeholder="Customer name"
                          value={newSale.customerName}
                          onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerContact">Contact</Label>
                        <Input
                          id="customerContact"
                          placeholder="Phone number"
                          value={newSale.customerContact || ""}
                          onChange={(e) => setNewSale({ ...newSale, customerContact: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerCnic">CNIC</Label>
                        <Input
                          id="customerCnic"
                          placeholder="National ID"
                          value={newSale.customerCnic || ""}
                          onChange={(e) => setNewSale({ ...newSale, customerCnic: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email (Optional)</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="customer@example.com"
                          value={newSale.customerEmail || ""}
                          onChange={(e) => setNewSale({ ...newSale, customerEmail: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Add any additional information"
                    value={newSale.notes}
                    onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSale}>Complete Sale</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-4">No sales found</div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3">Invoice</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Items</th>
                      <th className="text-left p-3">Customer</th>
                      <th className="text-right p-3">Total</th>
                      <th className="text-center p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSales.map((sale) => {
                      const shopkeeper = sale.shopkeeperId
                        ? shopkeepers.find(s => s.id === sale.shopkeeperId)
                        : null;
                      
                      const customer = sale.customerId
                        ? customers?.find(c => c.id === sale.customerId)
                        : null;
                        
                      return (
                        <tr key={sale.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="flex items-center">
                              <Receipt className="h-4 w-4 mr-2 text-gray-400" />
                              {sale.invoiceNumber}
                            </div>
                          </td>
                          <td className="p-3">{formatDateTime(sale.date)}</td>
                          <td className="p-3">
                            {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                          </td>
                          <td className="p-3">
                            {shopkeeper ? shopkeeper.name : 
                             customer ? customer.name : "Direct Sale"}
                          </td>
                          <td className="p-3 text-right">{formatCurrency(sale.total)}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePrintReceipt(sale)}
                                title="Print Receipt"
                              >
                                <Printer className="h-4 w-4" />
                                <span className="sr-only">Print</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => {
                                  setSaleToDelete(sale.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                title="Delete Sale"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                                  <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                                <span className="sr-only">Delete</span>
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setViewSale(sale)}
                                    title="View Details"
                                  >
                                    <Receipt className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Sale Details</DialogTitle>
                                  </DialogHeader>
                                  {viewSale && (
                                    <div className="py-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                          <h3 className="text-sm font-semibold mb-2">Sale Information</h3>
                                          <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Invoice:</span>
                                              <span>{viewSale.invoiceNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Date:</span>
                                              <span>{formatDateTime(viewSale.date)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Payment:</span>
                                              <span>{viewSale.paymentMethod}</span>
                                            </div>
                                            {viewSale.notes && (
                                              <div className="pt-2">
                                                <span className="text-muted-foreground">Notes:</span>
                                                <p className="mt-1 text-sm">{viewSale.notes}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        {(viewSale.shopkeeperId || viewSale.customerId) && (
                                          <div>
                                            <h3 className="text-sm font-semibold mb-2">
                                              {viewSale.shopkeeperId ? "Shopkeeper" : "Customer"} Information
                                            </h3>
                                            {(() => {
                                              if (viewSale.shopkeeperId) {
                                                const shopkeeper = shopkeepers.find(s => s.id === viewSale?.shopkeeperId);
                                                return shopkeeper ? (
                                                  <div className="space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                      <span className="text-muted-foreground">Name:</span>
                                                      <span>{shopkeeper.name}</span>
                                                    </div>
                                                    {shopkeeper.contact && (
                                                      <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Contact:</span>
                                                        <span>{shopkeeper.contact}</span>
                                                      </div>
                                                    )}
                                                    {shopkeeper.address && (
                                                      <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Address:</span>
                                                        <span>{shopkeeper.address}</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : null;
                                              } else if (viewSale.customerId && customers) {
                                                const customer = customers.find(c => c.id === viewSale?.customerId);
                                                return customer ? (
                                                  <div className="space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                      <span className="text-muted-foreground">Name:</span>
                                                      <span>{customer.name}</span>
                                                    </div>
                                                    {customer.contact && (
                                                      <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Contact:</span>
                                                        <span>{customer.contact}</span>
                                                      </div>
                                                    )}
                                                    {customer.cnic && (
                                                      <div className="flex justify-between">
                                                        <span className="text-muted-foreground">CNIC:</span>
                                                        <span>{customer.cnic}</span>
                                                      </div>
                                                    )}
                                                    {customer.email && (
                                                      <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Email:</span>
                                                        <span>{customer.email}</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : null;
                                              }
                                              return null;
                                            })()}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-semibold mb-2">Items</h3>
                                        <div className="border rounded-md overflow-hidden">
                                          <table className="w-full">
                                            <thead>
                                              <tr className="bg-muted/50">
                                                <th className="text-left p-2">Product</th>
                                                <th className="text-right p-2">Price</th>
                                                <th className="text-right p-2">Qty</th>
                                                <th className="text-right p-2">Total</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {viewSale.items.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                  <td className="p-2">
                                                    <div>{item.productName}</div>
                                                    <div className="text-xs text-muted-foreground">{item.productCode}</div>
                                                  </td>
                                                  <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                                                  <td className="p-2 text-right">{item.quantity}</td>
                                                  <td className="p-2 text-right">{formatCurrency(item.total)}</td>
                                                </tr>
                                              ))}
                                              <tr className="border-t bg-muted/30">
                                                <td colSpan={3} className="p-2 text-right font-medium">Total:</td>
                                                <td className="p-2 text-right font-bold">{formatCurrency(viewSale.total)}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                  <Pagination>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 mx-4">
                      {Array.from({length: Math.min(5, totalPages)}).map((_, i) => {
                        // Show a window of 5 pages around current page
                        let pageNum = i + 1;
                        if (totalPages > 5) {
                          if (currentPage > 3) {
                            pageNum = currentPage - 3 + i;
                          }
                          if (currentPage > totalPages - 2) {
                            pageNum = totalPages - 5 + i + 1;
                          }
                        }
                        
                        if (pageNum <= totalPages) {
                          return (
                            <Button 
                              key={i} 
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Sale Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sale</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this sale? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSale}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
