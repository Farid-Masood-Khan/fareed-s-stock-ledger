import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, formatDate, formatTransactionType, getTransactionTypeColor } from "@/utils/formatters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Users, ArrowUp, ArrowDown } from "lucide-react";
import { Shopkeeper } from "@/types";
import { useToast } from "@/hooks/use-toast";

const ShopkeepersPage = () => {
  const { shopkeepers, transactions, addShopkeeper, updateShopkeeper, addTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedShopkeeper, setSelectedShopkeeper] = useState<Shopkeeper | null>(null);
  const [newShopkeeper, setNewShopkeeper] = useState({
    name: "",
    contact: "",
    address: "",
    balance: 0,
  });
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    type: "PAYMENT_RECEIVED",
    notes: "",
  });
  const { toast } = useToast();

  // Filter shopkeepers based on search term
  const filteredShopkeepers = shopkeepers.filter(
    (shopkeeper) =>
      shopkeeper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shopkeeper.contact || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shopkeeper.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get transactions for selected shopkeeper
  const shopkeeperTransactions = selectedShopkeeper
    ? transactions
        .filter((t) => t.shopkeeperId === selectedShopkeeper.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Handle adding new shopkeeper
  const handleAddShopkeeper = () => {
    if (!newShopkeeper.name) {
      toast({
        title: "Error",
        description: "Please enter a name for the shopkeeper",
        variant: "destructive",
      });
      return;
    }

    addShopkeeper({
      ...newShopkeeper,
      balance: Number(newShopkeeper.balance),
    });

    toast({
      title: "Success",
      description: "Shopkeeper added successfully",
    });

    setNewShopkeeper({
      name: "",
      contact: "",
      address: "",
      balance: 0,
    });

    setIsAddDialogOpen(false);
  };

  // Handle adding new payment
  const handleAddPayment = () => {
    if (!selectedShopkeeper) return;
    
    if (newPayment.amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than zero",
        variant: "destructive",
      });
      return;
    }

    addTransaction({
      shopkeeperId: selectedShopkeeper.id,
      date: new Date(),
      type: newPayment.type as "PAYMENT_RECEIVED" | "PAYMENT_MADE",
      amount: newPayment.amount,
      notes: newPayment.notes,
    });

    toast({
      title: "Success",
      description: "Payment recorded successfully",
    });

    setNewPayment({
      amount: 0,
      type: "PAYMENT_RECEIVED",
      notes: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Shopkeeper Accounts</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search shopkeepers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Shopkeeper</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Shopkeeper</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Shopkeeper Name*</Label>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    value={newShopkeeper.name}
                    onChange={(e) =>
                      setNewShopkeeper({ ...newShopkeeper, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    placeholder="Enter contact number"
                    value={newShopkeeper.contact}
                    onChange={(e) =>
                      setNewShopkeeper({
                        ...newShopkeeper,
                        contact: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter address"
                    value={newShopkeeper.address}
                    onChange={(e) =>
                      setNewShopkeeper({
                        ...newShopkeeper,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialBalance">Initial Balance</Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    placeholder="0"
                    value={newShopkeeper.balance || ""}
                    onChange={(e) =>
                      setNewShopkeeper({
                        ...newShopkeeper,
                        balance: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Positive value means you owe them, negative means they owe you
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddShopkeeper}>Add Shopkeeper</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Shopkeeper List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredShopkeepers.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No shopkeepers found</p>
              ) : (
                filteredShopkeepers.map((shopkeeper) => (
                  <div
                    key={shopkeeper.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedShopkeeper?.id === shopkeeper.id
                        ? "bg-brand-100 border-brand-300"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedShopkeeper(shopkeeper)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium">{shopkeeper.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {shopkeeper.contact}
                          </div>
                        </div>
                      </div>
                      <div>
                        {shopkeeper.balance < 0 ? (
                          <Badge variant="destructive" className="whitespace-nowrap">
                            {formatCurrency(Math.abs(shopkeeper.balance))} Due
                          </Badge>
                        ) : shopkeeper.balance > 0 ? (
                          <Badge variant="outline" className="whitespace-nowrap">
                            {formatCurrency(shopkeeper.balance)} Owed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="whitespace-nowrap">
                            No Balance
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedShopkeeper ? `${selectedShopkeeper.name}'s Account` : "Select a Shopkeeper"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedShopkeeper ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-3" />
                <p className="text-muted-foreground">Select a shopkeeper to view details</p>
              </div>
            ) : (
              <Tabs defaultValue="summary">
                <TabsList className="mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="payment">Record Payment</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="py-4">
                          <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Contact:</span>
                              <span>{selectedShopkeeper.contact || "—"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Address:</span>
                              <span>{selectedShopkeeper.address || "—"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Since:</span>
                              <span>{formatDate(selectedShopkeeper.createdAt)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-4">
                          <CardTitle className="text-sm font-medium">Balance Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground text-sm">Current Balance:</span>
                              <div>
                                {selectedShopkeeper.balance < 0 ? (
                                  <div className="flex items-center text-red-600">
                                    <ArrowDown className="h-4 w-4 mr-1" />
                                    <span className="font-bold">
                                      {formatCurrency(Math.abs(selectedShopkeeper.balance))} Due
                                    </span>
                                  </div>
                                ) : selectedShopkeeper.balance > 0 ? (
                                  <div className="flex items-center text-green-600">
                                    <ArrowUp className="h-4 w-4 mr-1" />
                                    <span className="font-bold">
                                      {formatCurrency(selectedShopkeeper.balance)} Owed
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-bold">No Pending Balance</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Total Purchases:</span>
                              <span>
                                {formatCurrency(
                                  shopkeeperTransactions
                                    .filter(t => t.type === "PURCHASE")
                                    .reduce((sum, t) => sum + t.amount, 0)
                                )}
                              </span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Total Sales:</span>
                              <span>
                                {formatCurrency(
                                  shopkeeperTransactions
                                    .filter(t => t.type === "SALE")
                                    .reduce((sum, t) => sum + t.amount, 0)
                                )}
                              </span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Last Transaction:</span>
                              <span>
                                {shopkeeperTransactions.length > 0
                                  ? formatDate(shopkeeperTransactions[0].date)
                                  : "No transactions"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          {shopkeeperTransactions.length === 0 ? (
                            <p className="text-center py-4 text-muted-foreground">No transactions found</p>
                          ) : (
                            <table className="w-full">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="text-left p-2">Date</th>
                                  <th className="text-left p-2">Type</th>
                                  <th className="text-right p-2">Amount</th>
                                  <th className="text-left p-2">Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {shopkeeperTransactions.slice(0, 5).map((transaction) => (
                                  <tr key={transaction.id} className="border-t hover:bg-muted/50">
                                    <td className="p-2">{formatDate(transaction.date)}</td>
                                    <td className="p-2">
                                      <Badge className={getTransactionTypeColor(transaction.type)}>
                                        {formatTransactionType(transaction.type)}
                                      </Badge>
                                    </td>
                                    <td className="p-2 text-right">{formatCurrency(transaction.amount)}</td>
                                    <td className="p-2">{transaction.notes || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="transactions">
                  <Card>
                    <CardContent className="py-4">
                      <div className="overflow-x-auto">
                        {shopkeeperTransactions.length === 0 ? (
                          <p className="text-center py-4 text-muted-foreground">No transactions found</p>
                        ) : (
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="text-left p-2">Date</th>
                                <th className="text-left p-2">Type</th>
                                <th className="text-right p-2">Amount</th>
                                <th className="text-left p-2">Notes</th>
                                <th className="text-right p-2">Running Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {shopkeeperTransactions.map((transaction, index) => {
                                // Calculate running balance
                                let runningBalance = selectedShopkeeper.balance;
                                for (let i = 0; i < index; i++) {
                                  const t = shopkeeperTransactions[i];
                                  switch (t.type) {
                                    case "SALE":
                                      runningBalance += t.amount;
                                      break;
                                    case "PURCHASE":
                                      runningBalance -= t.amount;
                                      break;
                                    case "PAYMENT_RECEIVED":
                                      runningBalance += t.amount;
                                      break;
                                    case "PAYMENT_MADE":
                                      runningBalance -= t.amount;
                                      break;
                                  }
                                }
                                
                                return (
                                  <tr key={transaction.id} className="border-t hover:bg-muted/50">
                                    <td className="p-2">{formatDate(transaction.date)}</td>
                                    <td className="p-2">
                                      <Badge className={getTransactionTypeColor(transaction.type)}>
                                        {formatTransactionType(transaction.type)}
                                      </Badge>
                                    </td>
                                    <td className="p-2 text-right">{formatCurrency(transaction.amount)}</td>
                                    <td className="p-2">{transaction.notes || "—"}</td>
                                    <td className="p-2 text-right">
                                      {runningBalance < 0 ? (
                                        <span className="text-red-600">
                                          {formatCurrency(Math.abs(runningBalance))} Due
                                        </span>
                                      ) : runningBalance > 0 ? (
                                        <span className="text-green-600">
                                          {formatCurrency(runningBalance)} Owed
                                        </span>
                                      ) : (
                                        <span>No Balance</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Record Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="paymentType">Payment Type</Label>
                          <div className="flex gap-4">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="paymentReceived"
                                name="paymentType"
                                className="mr-2"
                                checked={newPayment.type === "PAYMENT_RECEIVED"}
                                onChange={() => setNewPayment({ ...newPayment, type: "PAYMENT_RECEIVED" })}
                              />
                              <Label htmlFor="paymentReceived">Payment Received</Label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="paymentMade"
                                name="paymentType"
                                className="mr-2"
                                checked={newPayment.type === "PAYMENT_MADE"}
                                onChange={() => setNewPayment({ ...newPayment, type: "PAYMENT_MADE" })}
                              />
                              <Label htmlFor="paymentMade">Payment Made</Label>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {newPayment.type === "PAYMENT_RECEIVED"
                              ? "Select this if you received payment from the shopkeeper"
                              : "Select this if you made payment to the shopkeeper"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentAmount">Amount</Label>
                          <Input
                            id="paymentAmount"
                            type="number"
                            placeholder="0"
                            value={newPayment.amount || ""}
                            onChange={(e) =>
                              setNewPayment({
                                ...newPayment,
                                amount: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentNotes">Notes (Optional)</Label>
                        <Input
                          id="paymentNotes"
                          placeholder="Add any additional information"
                          value={newPayment.notes}
                          onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddPayment} className="w-full">Record Payment</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopkeepersPage;
