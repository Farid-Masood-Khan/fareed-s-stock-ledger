import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Barcode, FileText, Search } from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
const Inventory = () => {
  const {
    products,
    addProduct,
    updateProduct,
    generateStockReport
  } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    description: "",
    price: 0,
    costPrice: 0,
    quantity: 0,
    category: ""
  });
  const {
    toast
  } = useToast();
  const stockReport = generateStockReport();

  // Filter products based on search term
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.code.toLowerCase().includes(searchTerm.toLowerCase()) || (product.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()));

  // Handle adding new product
  const handleAddProduct = () => {
    if (!newProduct.code || !newProduct.name || newProduct.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      costPrice: Number(newProduct.costPrice),
      quantity: Number(newProduct.quantity)
    });
    toast({
      title: "Success",
      description: "Product added successfully"
    });
    setNewProduct({
      code: "",
      name: "",
      description: "",
      price: 0,
      costPrice: 0,
      quantity: 0,
      category: ""
    });
    setIsAddDialogOpen(false);
  };

  // Handle updating product
  const handleUpdateProduct = () => {
    if (!selectedProduct) return;
    updateProduct(selectedProduct.id, selectedProduct);
    toast({
      title: "Success",
      description: "Product updated successfully"
    });
    setSelectedProduct(null);
  };
  return <div className="space-y-6 px-0 my-[28px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Product Code/Barcode*</Label>
                    <div className="relative">
                      <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input id="code" placeholder="Enter code or barcode" className="pl-10" value={newProduct.code} onChange={e => setNewProduct({
                      ...newProduct,
                      code: e.target.value
                    })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name*</Label>
                    <Input id="name" placeholder="Enter name" value={newProduct.name} onChange={e => setNewProduct({
                    ...newProduct,
                    name: e.target.value
                  })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Enter description" value={newProduct.description} onChange={e => setNewProduct({
                  ...newProduct,
                  description: e.target.value
                })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Selling Price*</Label>
                    <Input id="price" type="number" placeholder="0" value={newProduct.price || ""} onChange={e => setNewProduct({
                    ...newProduct,
                    price: parseFloat(e.target.value)
                  })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price*</Label>
                    <Input id="costPrice" type="number" placeholder="0" value={newProduct.costPrice || ""} onChange={e => setNewProduct({
                    ...newProduct,
                    costPrice: parseFloat(e.target.value)
                  })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Initial Quantity*</Label>
                    <Input id="quantity" type="number" placeholder="0" value={newProduct.quantity || ""} onChange={e => setNewProduct({
                    ...newProduct,
                    quantity: parseInt(e.target.value)
                  })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Enter category" value={newProduct.category} onChange={e => setNewProduct({
                  ...newProduct,
                  category: e.target.value
                })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length} products</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total Value: {formatCurrency(stockReport.totalValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockReport.lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Need attention soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockReport.outOfStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Need to restock
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3">Code</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-right p-3">Quantity</th>
                  <th className="text-right p-3">Cost Price</th>
                  <th className="text-right p-3">Selling Price</th>
                  <th className="text-right p-3">Value</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? <tr>
                    <td colSpan={8} className="p-4 text-center">
                      No products found
                    </td>
                  </tr> : filteredProducts.map(product => <tr key={product.id} className={`border-b hover:bg-muted/50 ${product.quantity === 0 ? "bg-red-50" : product.quantity <= 5 ? "bg-yellow-50" : ""}`}>
                      <td className="p-3">
                        <div className="flex items-center">
                          <Barcode className="h-4 w-4 mr-2 text-gray-400" />
                          {product.code}
                        </div>
                      </td>
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.category || "—"}</td>
                      <td className="p-3 text-right">{product.quantity}</td>
                      <td className="p-3 text-right">
                        {formatCurrency(product.costPrice)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(product.costPrice * product.quantity)}
                      </td>
                      <td className="p-3 text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(product)}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Product Details</DialogTitle>
                            </DialogHeader>
                            {selectedProduct && <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="view-code">
                                      Product Code
                                    </Label>
                                    <Input id="view-code" value={selectedProduct.code} onChange={e => setSelectedProduct({
                              ...selectedProduct,
                              code: e.target.value
                            })} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="view-name">
                                      Product Name
                                    </Label>
                                    <Input id="view-name" value={selectedProduct.name} onChange={e => setSelectedProduct({
                              ...selectedProduct,
                              name: e.target.value
                            })} />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="view-description">
                                    Description
                                  </Label>
                                  <Input id="view-description" value={selectedProduct.description || ""} onChange={e => setSelectedProduct({
                            ...selectedProduct,
                            description: e.target.value
                          })} />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="view-price">
                                      Selling Price
                                    </Label>
                                    <Input id="view-price" type="number" value={selectedProduct.price} onChange={e => setSelectedProduct({
                              ...selectedProduct,
                              price: parseFloat(e.target.value)
                            })} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="view-costPrice">
                                      Cost Price
                                    </Label>
                                    <Input id="view-costPrice" type="number" value={selectedProduct.costPrice} onChange={e => setSelectedProduct({
                              ...selectedProduct,
                              costPrice: parseFloat(e.target.value)
                            })} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="view-quantity">
                                      Quantity
                                    </Label>
                                    <Input id="view-quantity" type="number" value={selectedProduct.quantity} onChange={e => setSelectedProduct({
                              ...selectedProduct,
                              quantity: parseInt(e.target.value)
                            })} />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="view-category">Category</Label>
                                  <Input id="view-category" value={selectedProduct.category || ""} onChange={e => setSelectedProduct({
                            ...selectedProduct,
                            category: e.target.value
                          })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Created At</Label>
                                    <Input disabled value={formatDate(selectedProduct.createdAt)} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Updated At</Label>
                                    <Input disabled value={formatDate(selectedProduct.updatedAt)} />
                                  </div>
                                </div>
                              </div>}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateProduct}>
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Inventory;