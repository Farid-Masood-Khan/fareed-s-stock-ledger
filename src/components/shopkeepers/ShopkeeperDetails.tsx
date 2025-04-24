import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDate, formatTransactionType, getTransactionTypeColor } from "@/utils/formatters";
import { ArrowDown, ArrowUp, Users } from "lucide-react";
import { Shopkeeper, Transaction, Sale } from "@/types";
import PrintReceipt from "@/components/receipt/PrintReceipt";

interface ShopkeeperDetailsProps {
  selectedShopkeeper: Shopkeeper;
  transactions: Transaction[];
  newPayment: {
    amount: number;
    type: "PAYMENT_RECEIVED" | "PAYMENT_MADE";
    notes: string;
  };
  onNewPaymentChange: (field: string, value: string | number) => void;
  onAddPayment: () => void;
}

const ShopkeeperDetails = ({
  selectedShopkeeper,
  transactions,
  newPayment,
  onNewPaymentChange,
  onAddPayment,
}: ShopkeeperDetailsProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{selectedShopkeeper.name}'s Account</CardTitle>
      </CardHeader>
      <CardContent>
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
                            transactions
                              .filter(t => t.type === "PURCHASE")
                              .reduce((sum, t) => sum + t.amount, 0)
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Sales:</span>
                        <span>
                          {formatCurrency(
                            transactions
                              .filter(t => t.type === "SALE")
                              .reduce((sum, t) => sum + t.amount, 0)
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Transaction:</span>
                        <span>
                          {transactions.length > 0
                            ? formatDate(transactions[0].date)
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
                    {transactions.length === 0 ? (
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
                          {transactions.slice(0, 5).map((transaction) => (
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
                      {transactions.map((transaction, index) => {
                        let runningBalance = selectedShopkeeper.balance;
                        for (let i = 0; i < index; i++) {
                          const t = transactions[i];
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
                            <td className="p-2">
                              {transaction.type === 'SALE' && (
                                <PrintReceipt
                                  sale={{
                                    id: transaction.id,
                                    date: transaction.date,
                                    items: transaction.relatedItems || [],
                                    total: transaction.amount,
                                    paymentMethod: 'CREDIT',
                                    invoiceNumber: transaction.notes?.split(': ')[1] || transaction.id,
                                    shopkeeperId: transaction.shopkeeperId
                                  }}
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
                          onChange={() => onNewPaymentChange("type", "PAYMENT_RECEIVED")}
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
                          onChange={() => onNewPaymentChange("type", "PAYMENT_MADE")}
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
                        onNewPaymentChange("amount", parseFloat(e.target.value) || 0)
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
                    onChange={(e) => onNewPaymentChange("notes", e.target.value)}
                  />
                </div>
                <Button onClick={onAddPayment} className="w-full">Record Payment</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShopkeeperDetails;
