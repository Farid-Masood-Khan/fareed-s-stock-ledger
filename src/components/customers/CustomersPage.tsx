
import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Customer } from "@/types";
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
import { Search, User, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Pagination } from "@/components/ui/pagination";
import { formatCurrency } from "@/utils/formatters";

const ITEMS_PER_PAGE = 8;

const CustomersPage = () => {
  const { customers, sales, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    cnic: "",
    email: "",
  });

  const { toast } = useToast();

  // Calculate customer statistics
  const customersWithStats = customers?.map(customer => {
    const customerSales = sales.filter(sale => sale.customerId === customer.id);
    const totalPurchases = customerSales.length;
    const totalAmountSpent = customerSales.reduce((total, sale) => total + sale.total, 0);
    
    return {
      ...customer,
      totalPurchases,
      totalAmountSpent,
      purchaseHistory: customerSales
    };
  }) || [];

  // Filter customers based on search term
  const filteredCustomers = customersWithStats.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.contact?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (customer.cnic?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (customer.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    // Check if a customer with the same contact or CNIC already exists
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

    if (!selectedCustomer.name.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    // Check if another customer with the same contact or CNIC already exists
    const existingCustomer = customers?.find(
      c => c.id !== selectedCustomer.id && 
          ((selectedCustomer.contact && c.contact === selectedCustomer.contact) || 
           (selectedCustomer.cnic && c.cnic === selectedCustomer.cnic))
    );

    if (existingCustomer) {
      toast({
        title: "Duplicate Information",
        description: `Another customer (${existingCustomer.name}) already has the same contact or CNIC`,
        variant: "destructive",
      });
      return;
    }

    updateCustomer(selectedCustomer.id, {
      name: selectedCustomer.name,
      contact: selectedCustomer.contact,
      cnic: selectedCustomer.cnic,
      email: selectedCustomer.email,
    });

    toast({
      title: "Success",
      description: "Customer updated successfully",
    });
    
    setIsEditDialogOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    
    // Check if customer has associated sales
    const hasAssociatedSales = sales.some(sale => sale.customerId === selectedCustomer.id);
    
    if (hasAssociatedSales) {
      toast({
        title: "Cannot Delete Customer",
        description: "This customer has associated sales records. Delete their sales first.",
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
    
    setIsDeleteDialogOpen(false);
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
              <Button>New Customer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Customer name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input
                    id="contact"
                    placeholder="Phone number"
                    value={newCustomer.contact}
                    onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC</Label>
                  <Input
                    id="cnic"
                    placeholder="National ID"
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
        </div>
      </div>

      {!customers || customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Customers Found</h3>
            <p className="text-muted-foreground text-center mb-6">
              You haven't added any customers yet. Add your first customer to get started.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              Add Your First Customer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-4">No matching customers found</div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">CNIC</th>
                        <th className="text-right p-3">Total Purchases</th>
                        <th className="text-right p-3">Total Spent</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{customer.name}</td>
                          <td className="p-3">{customer.contact || "-"}</td>
                          <td className="p-3">{customer.cnic || "-"}</td>
                          <td className="p-3 text-right">{customer.totalPurchases || 0}</td>
                          <td className="p-3 text-right">{formatCurrency(customer.totalAmountSpent || 0)}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={selectedCustomer.name}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact</Label>
                <Input
                  id="edit-contact"
                  value={selectedCustomer.contact || ""}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, contact: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cnic">CNIC</Label>
                <Input
                  id="edit-cnic"
                  value={selectedCustomer.cnic || ""}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, cnic: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedCustomer.email || ""}
                  onChange={(e) => setSelectedCustomer({...selectedCustomer, email: e.target.value})}
                />
              </div>
              
              {/* Purchase History */}
              {selectedCustomer.purchaseHistory && selectedCustomer.purchaseHistory.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-sm font-semibold mb-2">Purchase History</h3>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left">Date</th>
                          <th className="p-2 text-left">Invoice</th>
                          <th className="p-2 text-right">Items</th>
                          <th className="p-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.purchaseHistory.map(sale => (
                          <tr key={sale.id} className="border-b">
                            <td className="p-2">
                              {new Date(sale.date).toLocaleDateString()}
                            </td>
                            <td className="p-2">{sale.invoiceNumber}</td>
                            <td className="p-2 text-right">{sale.items.length}</td>
                            <td className="p-2 text-right">{formatCurrency(sale.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this customer? This action cannot be undone.
            {selectedCustomer?.totalPurchases ? (
              <span className="text-red-500 block mt-2 font-medium">
                Warning: This customer has {selectedCustomer.totalPurchases} purchase records.
                Delete their sales records first.
              </span>
            ) : null}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
