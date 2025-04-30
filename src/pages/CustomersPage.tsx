
import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer, Sale } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Search, User, UserPlus, Receipt, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const CustomersPage = () => {
  const { customers, sales, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [newCustomer, setNewCustomer] = useState<{
    name: string;
    contact: string;
    cnic: string;
    email: string;
  }>({
    name: "",
    contact: "",
    cnic: "",
    email: "",
  });

  // Filter customers based on search term
  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.contact && customer.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.cnic && customer.cnic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // Sort by most recent first
  const sortedCustomers = [...filteredCustomers].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Pagination
  const totalPages = Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Get customer sales history
  const customerSales = selectedCustomer
    ? sales.filter(sale => sale.customerId === selectedCustomer.id)
         .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const handleAddCustomer = () => {
    if (!newCustomer.name) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate customer by contact or CNIC
    if (newCustomer.contact || newCustomer.cnic) {
      const existingCustomer = customers?.find(
        c => (newCustomer.contact && c.contact === newCustomer.contact) || 
            (newCustomer.cnic && c.cnic === newCustomer.cnic)
      );
      
      if (existingCustomer) {
        toast({
          title: "Customer Already Exists",
          description: `A customer with the same contact or CNIC already exists: ${existingCustomer.name}`,
          variant: "destructive",
        });
        return;
      }
    }

    addCustomer(newCustomer);

    toast({
      title: "Success",
      description: "Customer added successfully",
    });

    setNewCustomer({
      name: "",
      contact: "",
      cnic: "",
      email: "",
    });

    setIsAddDialogOpen(false);
  };

  const handleEditCustomer = () => {
    if (!selectedCustomer) return;
    
    if (!newCustomer.name) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    // Check if changes would create a duplicate
    if (newCustomer.contact || newCustomer.cnic) {
      const existingCustomer = customers?.find(
        c => c.id !== selectedCustomer.id && (
          (newCustomer.contact && c.contact === newCustomer.contact) || 
          (newCustomer.cnic && c.cnic === newCustomer.cnic)
        )
      );
      
      if (existingCustomer) {
        toast({
          title: "Customer Exists",
          description: `Another customer with the same contact or CNIC exists: ${existingCustomer.name}`,
          variant: "destructive",
        });
        return;
      }
    }

    updateCustomer(selectedCustomer.id, {
      name: newCustomer.name,
      contact: newCustomer.contact || undefined,
      cnic: newCustomer.cnic || undefined,
      email: newCustomer.email || undefined,
      updatedAt: new Date(),
    });

    toast({
      title: "Success",
      description: "Customer updated successfully",
    });

    setIsEditDialogOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;

    // Check if customer has sales
    const hasSales = sales.some(sale => sale.customerId === selectedCustomer.id);
    
    if (hasSales) {
      toast({
        title: "Cannot Delete",
        description: "This customer has sales records and cannot be deleted.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
      return;
    }

    deleteCustomer(selectedCustomer.id);

    toast({
      title: "Success",
      description: "Customer deleted successfully",
    });

    setSelectedCustomer(null);
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      name: customer.name,
      contact: customer.contact || "",
      cnic: customer.cnic || "",
      email: customer.email || "",
    });
    setIsEditDialogOpen(true);
  };

  const calculateTotalSpent = (customerId: string): number => {
    return sales
      .filter(sale => sale.customerId === customerId)
      .reduce((total, sale) => total + sale.total, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedCustomers.length === 0 ? (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                <p className="mt-2 text-muted-foreground">
                  {searchTerm ? "No customers found matching your search" : "No customers yet"}
                </p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Your First Customer
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {paginatedCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="truncate">
                        <div className="font-medium">{customer.name}</div>
                        <div className={`text-xs ${selectedCustomer?.id === customer.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {customer.contact || "No contact"}
                          {customer.cnic ? ` • ${customer.cnic}` : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${selectedCustomer?.id === customer.id ? "text-primary-foreground hover:text-primary-foreground/80" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(customer);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${selectedCustomer?.id === customer.id ? "text-primary-foreground hover:text-primary-foreground/80" : "hover:text-destructive"}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(customer);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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

        {/* Customer Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCustomer ? (
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="purchases">
                    Purchase History ({customerSales.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {selectedCustomer.name}
                        </h2>
                        <p className="text-muted-foreground">
                          Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => openEditDialog(selectedCustomer)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Contact Information</h3>
                        <div className="space-y-2 rounded-md border p-3">
                          <div>
                            <span className="text-muted-foreground">Contact:</span>
                            <p className="font-medium">{selectedCustomer.contact || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CNIC:</span>
                            <p className="font-medium">{selectedCustomer.cnic || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <p className="font-medium">{selectedCustomer.email || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Purchase Summary</h3>
                        <div className="space-y-2 rounded-md border p-3">
                          <div>
                            <span className="text-muted-foreground">Total Purchases:</span>
                            <p className="font-medium">{customerSales.length}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Spent:</span>
                            <p className="font-medium">{formatCurrency(calculateTotalSpent(selectedCustomer.id))}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Purchase:</span>
                            <p className="font-medium">
                              {customerSales.length > 0
                                ? formatDateTime(customerSales[0].date)
                                : "No purchases yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="purchases">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Purchase History</h3>
                    
                    {customerSales.length === 0 ? (
                      <div className="text-center py-8 border rounded-md">
                        <Receipt className="mx-auto h-10 w-10 text-muted-foreground opacity-30" />
                        <p className="mt-2 text-muted-foreground">
                          No purchase history found for this customer
                        </p>
                      </div>
                    ) : (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="text-left p-3">Invoice</th>
                              <th className="text-left p-3">Date</th>
                              <th className="text-left p-3">Items</th>
                              <th className="text-right p-3">Total</th>
                              <th className="text-center p-3">Payment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerSales.map((sale) => (
                              <tr key={sale.id} className="border-t hover:bg-muted/50">
                                <td className="p-3">
                                  <div className="flex items-center">
                                    <Receipt className="h-4 w-4 mr-2 text-gray-400" />
                                    {sale.invoiceNumber}
                                  </div>
                                </td>
                                <td className="p-3">{formatDateTime(sale.date)}</td>
                                <td className="p-3">
                                  <div className="flex flex-col gap-1">
                                    {sale.items.slice(0, 2).map((item, i) => (
                                      <div key={i} className="text-sm">
                                        {item.productName} x{item.quantity}
                                      </div>
                                    ))}
                                    {sale.items.length > 2 && (
                                      <div className="text-xs text-muted-foreground">
                                        +{sale.items.length - 2} more items
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-right font-medium">
                                  {formatCurrency(sale.total)}
                                </td>
                                <td className="p-3 text-center">
                                  <span className="text-xs rounded-full bg-muted px-2 py-1">
                                    {sale.paymentMethod}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-16">
                <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                <p className="mt-2 text-muted-foreground">Select a customer to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="Customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="Phone number"
                value={newCustomer.contact}
                onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC / National ID</Label>
              <Input
                id="cnic"
                placeholder="CNIC number"
                value={newCustomer.cnic}
                onChange={(e) => setNewCustomer({ ...newCustomer, cnic: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="edit-name"
                placeholder="Customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-contact">Contact Number</Label>
              <Input
                id="edit-contact"
                placeholder="Phone number"
                value={newCustomer.contact}
                onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-cnic">CNIC / National ID</Label>
              <Input
                id="edit-cnic"
                placeholder="CNIC number"
                value={newCustomer.cnic}
                onChange={(e) => setNewCustomer({ ...newCustomer, cnic: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email (Optional)</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="customer@example.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Update Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this customer? 
            {customerSales.length > 0 ? (
              <span className="text-red-500 block mt-2 font-semibold">
                This customer has {customerSales.length} associated sales and cannot be deleted.
              </span>
            ) : (
              " This action cannot be undone."
            )}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCustomer}
              disabled={customerSales.length > 0}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersPage;
