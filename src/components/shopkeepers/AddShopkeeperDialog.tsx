
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddShopkeeperDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newShopkeeper: {
    name: string;
    contact: string;
    address: string;
    balance: number;
  };
  onNewShopkeeperChange: (field: string, value: string | number) => void;
  onAddShopkeeper: () => void;
}

const AddShopkeeperDialog = ({
  isOpen,
  onOpenChange,
  newShopkeeper,
  onNewShopkeeperChange,
  onAddShopkeeper,
}: AddShopkeeperDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                onNewShopkeeperChange("name", e.target.value)
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
                onNewShopkeeperChange("contact", e.target.value)
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
                onNewShopkeeperChange("address", e.target.value)
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
                onNewShopkeeperChange("balance", parseFloat(e.target.value) || 0)
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onAddShopkeeper}>Add Shopkeeper</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddShopkeeperDialog;
