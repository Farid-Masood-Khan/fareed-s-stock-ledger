
import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Customer, Sale } from "@/types";
import { Search, User, UserPlus, Edit, Trash, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CustomersPage = () => {
  const { customers, sales, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    cnic: "",
    email: "",
    address: "",
  });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  
  const { toast } = useToast();

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.contact && customer.contact.includes(searchTerm)) ||
      (customer.cnic && customer.cnic.includes(searchTerm)) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get customer purchases
  const getCustomerPurchases = (customerId: string): Sale[] => {
    return sales.filter(sale => sale.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  // Calculate total purchases
  const calculateTotalPurchases = (customerId: string): number => {
    return getCustomerPurchases(customerId).reduce((sum, sale) => sum + sale.total, 0);
  };
  
  // Handle form changes
  const handleNewCustomerChange = (field: string, value: string) => {
    if (selectedCustomer) {
      // Update mode
      setNewCustomer({ ...newCustomer, [field]: value });
    } else {
      // Add mode
      setNewCustomer({ ...newCustomer, [field]: value });
    }
  };

  // Handle save customer
  const handleSaveCustomer = () => {
    if (!newCustomer.name) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    if (selectedCustomer) {
      // Update existing customer
      updateCustomer(selectedCustomer.id, newCustomer);
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
    } else {
      // Add new customer
      addCustomer(newCustomer);
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    }

    resetForm();
  };

  // Handle delete customer
  const handleDeleteCustomer = () => {
    if (!customerToDelete) return;

    // Check if there are sales associated with this customer
    const customerPurchases = getCustomerPurchases(customerToDelete.id);
    if (customerPurchases.length > 0) {
      toast({
        title: "Cannot Delete",
        description: "This customer has associated purchases and cannot be deleted",
        variant: "destructive",
      });
    } else {
      deleteCustomer(customerToDelete.id);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    }

    setIsConfirmDeleteOpen(false);
    setCustomerToDelete(null);
  };

  // Reset form
  const resetForm = () => {
    setNewCustomer({
      name: "",
      contact: "",
      cnic: "",
      email: "",
      address: "",
    });
    setSelectedCustomer(null);
    setIsAddDialogOpen(false);
  };

  // Handle edit button click
  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setNewCustomer({
      name: customer.name,
      contact: customer.contact || "",
      cnic: customer.cnic || "",
      email: customer.email || "",
      address: customer.address || "",
    });
    setIsAddDialogOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsConfirmDeleteOpen(true);
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                {selectedCustomer ? "Edit Customer" : "Add Customer"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                <DialogDescription>
                  {selectedCustomer 
                    ? "Update customer information in the system" 
                    : "Enter customer details to add them to your system"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Customer name"
                    value={newCustomer.name}
                    onChange={(e) => handleNewCustomerChange("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact">Contact</Label>
                    <Input
                      id="contact"
                      placeholder="Phone number"
                      value={newCustomer.contact}
                      onChange={(e) => handleNewCustomerChange("contact", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cnic">CNIC</Label>
                    <Input
                      id="cnic"
                      placeholder="CNIC number"
                      value={newCustomer.cnic}
                      onChange={(e) => handleNewCustomerChange("cnic", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={newCustomer.email}
                    onChange={(e) => handleNewCustomerChange("email", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Address"
                    value={newCustomer.address}
                    onChange={(e) => handleNewCustomerChange("address", e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCustomer}>
                  {selectedCustomer ? "Update" : "Add"} Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            Manage and view all your customers and their purchase history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-10">
              <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
              <p className="mt-2 text-muted-foreground">
                {searchTerm ? "No customers match your search" : "No customers added yet"}
              </p>
              {!searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Your First Customer
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>Purchase History</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const customerPurchases = getCustomerPurchases(customer.id);
                  const totalPurchases = calculateTotalPurchases(customer.id);
                  
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            {customer.email && (
                              <div className="text-xs text-muted-foreground">{customer.email}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.contact || "-"}</TableCell>
                      <TableCell>{customer.cnic || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium">
                            {customerPurchases.length} Purchases
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total: {formatCurrency(totalPurchases)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Customer Details</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <Tabs defaultValue="info">
                                  <TabsList className="mb-4">
                                    <TabsTrigger value="info">Information</TabsTrigger>
                                    <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="info">
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                          <User className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                          <h3 className="text-lg font-bold">{customer.name}</h3>
                                          <p className="text-sm text-muted-foreground">
                                            Customer since {
                                              new Date(customer.createdAt).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                              })
                                            }
                                          </p>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        <div className="space-y-2">
                                          <Label>Contact</Label>
                                          <p className="text-sm">{customer.contact || "Not provided"}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>CNIC</Label>
                                          <p className="text-sm">{customer.cnic || "Not provided"}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Email</Label>
                                          <p className="text-sm">{customer.email || "Not provided"}</p>
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Address</Label>
                                          <p className="text-sm">{customer.address || "Not provided"}</p>
                                        </div>
                                      </div>

                                      <div className="mt-6 pt-6 border-t">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <Card>
                                            <CardContent className="pt-6">
                                              <div className="text-2xl font-bold">
                                                {customerPurchases.length}
                                              </div>
                                              <p className="text-sm text-muted-foreground">
                                                Total Purchases
                                              </p>
                                            </CardContent>
                                          </Card>
                                          <Card>
                                            <CardContent className="pt-6">
                                              <div className="text-2xl font-bold">
                                                {formatCurrency(totalPurchases)}
                                              </div>
                                              <p className="text-sm text-muted-foreground">
                                                Total Amount
                                              </p>
                                            </CardContent>
                                          </Card>
                                          <Card>
                                            <CardContent className="pt-6">
                                              <div className="text-2xl font-bold">
                                                {customerPurchases.length > 0 ? formatCurrency(totalPurchases / customerPurchases.length) : "₹0"}
                                              </div>
                                              <p className="text-sm text-muted-foreground">
                                                Average Purchase
                                              </p>
                                            </CardContent>
                                          </Card>
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="purchases">
                                    {customerPurchases.length === 0 ? (
                                      <div className="text-center py-10">
                                        <p className="text-muted-foreground">No purchase history available</p>
                                      </div>
                                    ) : (
                                      <div className="border rounded-md overflow-x-auto">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Date</TableHead>
                                              <TableHead>Invoice</TableHead>
                                              <TableHead>Items</TableHead>
                                              <TableHead>Payment</TableHead>
                                              <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {customerPurchases.map((sale) => (
                                              <TableRow key={sale.id}>
                                                <TableCell>{formatDateTime(sale.date)}</TableCell>
                                                <TableCell>{sale.invoiceNumber}</TableCell>
                                                <TableCell>
                                                  <div className="flex flex-col gap-1 max-w-md">
                                                    {sale.items.map((item, i) => (
                                                      <Badge key={i} variant="outline" className="w-fit">
                                                        {item.quantity} x {item.productName}
                                                      </Badge>
                                                    ))}
                                                  </div>
                                                </TableCell>
                                                <TableCell>{sale.paymentMethod}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                  {formatCurrency(sale.total)}
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                            <TableRow>
                                              <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                                              <TableCell className="text-right font-bold">{formatCurrency(totalPurchases)}</TableCell>
                                            </TableRow>
                                          </TableBody>
                                        </Table>
                                      </div>
                                    )}
                                  </TabsContent>
                                </Tabs>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(customer)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersPage;
