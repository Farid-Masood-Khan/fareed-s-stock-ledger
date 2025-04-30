
import React, { useState } from "react";
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
import { Search, Receipt, Printer } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Sale, SaleItem, Product } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Sales = () => {
  const { sales, products, shopkeepers, addSale } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewSale, setViewSale] = useState<Sale | null>(null);
  const [newSale, setNewSale] = useState<{
    items: Array<{ productId: string; quantity: number; price: number }>;
    paymentMethod: string;
    shopkeeperId?: string;
    notes: string;
  }>({
    items: [],
    paymentMethod: "Cash",
    shopkeeperId: "",
    notes: "",
  });
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { toast } = useToast();

  // Filter sales based on search term
  const filteredSales = sales
    .filter(
      (sale) =>
        sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.shopkeeperId && shopkeepers.find(s => s.id === sale.shopkeeperId)?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        sale.items.some(item => 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.productCode.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      shopkeeperId: newSale.shopkeeperId && newSale.shopkeeperId !== "" ? newSale.shopkeeperId : undefined,
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
      notes: "",
    });
    
    setIsAddDialogOpen(false);
  };

  const handlePrintReceipt = (sale: Sale) => {
    // Create a printable version of the receipt
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const shopkeeper = sale.shopkeeperId 
      ? shopkeepers.find(s => s.id === sale.shopkeeperId)
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
              ${shopkeeper ? `<div><strong>Customer:</strong> ${shopkeeper.name}</div>` : ''}
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
                    <Label htmlFor="shopkeeper">Shopkeeper (Optional)</Label>
                    <Select 
                      value={newSale.shopkeeperId} 
                      onValueChange={(value) => setNewSale({...newSale, shopkeeperId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shopkeeper" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Direct Sale)</SelectItem>
                        {shopkeepers.map(shopkeeper => (
                          <SelectItem key={shopkeeper.id} value={shopkeeper.id}>
                            {shopkeeper.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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
                  {filteredSales.map((sale) => {
                    const shopkeeper = sale.shopkeeperId
                      ? shopkeepers.find(s => s.id === sale.shopkeeperId)
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
                          {shopkeeper ? shopkeeper.name : "Direct Sale"}
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
                                      {viewSale.shopkeeperId && (
                                        <div>
                                          <h3 className="text-sm font-semibold mb-2">Customer Information</h3>
                                          {(() => {
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
                                            {viewSale.items.map((item, idx) => (
                                              <tr key={idx} className="border-t">
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
                                <DialogFooter>
                                  <Button 
                                    variant="outline"
                                    onClick={() => handlePrintReceipt(viewSale!)}
                                    className="mr-auto"
                                  >
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Receipt
                                  </Button>
                                  <Button
                                    onClick={() => setViewSale(null)}
                                  >
                                    Close
                                  </Button>
                                </DialogFooter>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
