import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shopkeeper } from "@/types";
import ShopkeeperList from "@/components/shopkeepers/ShopkeeperList";
import AddShopkeeperDialog from "@/components/shopkeepers/AddShopkeeperDialog";
import ShopkeeperDetails from "@/components/shopkeepers/ShopkeeperDetails";

const ShopkeepersPage = () => {
  const { shopkeepers, transactions, addShopkeeper, addTransaction } = useStore();
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
    type: "PAYMENT_RECEIVED" as "PAYMENT_RECEIVED" | "PAYMENT_MADE",
    notes: "",
  });
  const { toast } = useToast();

  const handleNewShopkeeperChange = (field: string, value: string | number) => {
    setNewShopkeeper((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleNewPaymentChange = (field: string, value: string | number) => {
    setNewPayment((prev) => ({ ...prev, [field]: value }));
  };

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
      type: newPayment.type,
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

  const shopkeeperTransactions = selectedShopkeeper
    ? transactions
        .filter((t) => t.shopkeeperId === selectedShopkeeper.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Shopkeeper Accounts</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Shopkeeper</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShopkeeperList
          shopkeepers={shopkeepers}
          selectedShopkeeper={selectedShopkeeper}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectShopkeeper={setSelectedShopkeeper}
        />

        {selectedShopkeeper ? (
          <ShopkeeperDetails
            selectedShopkeeper={selectedShopkeeper}
            transactions={shopkeeperTransactions}
            newPayment={newPayment}
            onNewPaymentChange={handleNewPaymentChange}
            onAddPayment={handleAddPayment}
          />
        ) : (
          <div className="lg:col-span-2">
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 text-muted-foreground opacity-30 mb-3">
                <Users />
              </div>
              <p className="text-muted-foreground">Select a shopkeeper to view details</p>
            </div>
          </div>
        )}

        <AddShopkeeperDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newShopkeeper={newShopkeeper}
          onNewShopkeeperChange={handleNewShopkeeperChange}
          onAddShopkeeper={handleAddShopkeeper}
        />
      </div>
    </div>
  );
};

export default ShopkeepersPage;
