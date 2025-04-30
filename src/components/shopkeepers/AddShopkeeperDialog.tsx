
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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define validation schema
const shopkeeperSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  contact: z.string().max(20, "Contact number is too long").optional(),
  address: z.string().max(200, "Address is too long").optional(),
  balance: z.number().or(z.string().transform(val => Number(val) || 0)),
});

type ShopkeeperFormValues = z.infer<typeof shopkeeperSchema>;

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
  // Initialize form with React Hook Form + Zod validation
  const form = useForm<ShopkeeperFormValues>({
    resolver: zodResolver(shopkeeperSchema),
    defaultValues: {
      name: newShopkeeper.name,
      contact: newShopkeeper.contact,
      address: newShopkeeper.address,
      balance: newShopkeeper.balance,
    },
  });

  // Update the parent component's state when form values change
  const handleFieldChange = (field: string, value: string | number) => {
    // Sanitize inputs
    if (typeof value === 'string') {
      // Basic sanitization - trim whitespace
      value = value.trim();
    }
    onNewShopkeeperChange(field, value);
  };

  const onSubmit = (data: ShopkeeperFormValues) => {
    // Update parent component state with sanitized values
    Object.entries(data).forEach(([key, value]) => {
      handleFieldChange(key, value);
    });
    onAddShopkeeper();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Shopkeeper</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shopkeeper Name*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("name", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter contact number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("contact", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("address", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("balance", parseFloat(e.target.value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Positive value means you owe them, negative means they owe you
                  </p>
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Shopkeeper</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddShopkeeperDialog;
