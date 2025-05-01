import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, ChartBar, ArrowUp, ArrowDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
const FinancialPage = () => {
  const {
    generateFinancialSummary,
    generateStockReport,
    shopkeepers
  } = useStore();
  const financialSummary = generateFinancialSummary();
  const stockReport = generateStockReport();

  // Prepare data for pie chart
  const assetsData = [{
    name: "Stock Value",
    value: financialSummary.totalStockValue
  }, {
    name: "Receivables",
    value: financialSummary.totalDueFromShopkeepers
  }];
  const liabilitiesData = [{
    name: "Payables",
    value: financialSummary.totalDueToShopkeepers
  }];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return <div className="space-y-6 my-[28px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Financial Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Net Balance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(financialSummary.netBalance)}</div>
              <p className="text-xs text-muted-foreground mt-1">Total assets - liabilities</p>
            </div>
            <Wallet className="h-8 w-8 text-brand-600 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalStockValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">{stockReport.totalItems} items in stock</p>
            </div>
            <ChartBar className="h-8 w-8 text-brand-600 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Receivables</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalDueFromShopkeepers)}</div>
              <p className="text-xs text-muted-foreground mt-1">Due from shopkeepers</p>
            </div>
            <ArrowDown className="h-8 w-8 text-green-600 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Payables</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalDueToShopkeepers)}</div>
              <p className="text-xs text-muted-foreground mt-1">Due to shopkeepers</p>
            </div>
            <ArrowUp className="h-8 w-8 text-red-600 opacity-80" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assets Distribution</CardTitle>
            <CardDescription>
              Total value: {formatCurrency(financialSummary.totalStockValue + financialSummary.totalDueFromShopkeepers)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={assetsData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({
                  name,
                  percent
                }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                    {assetsData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={value => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
            <CardDescription>Shopkeeper accounts and balances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3">Shopkeeper</th>
                    <th className="text-right p-3">Balance</th>
                    <th className="text-right p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shopkeepers.length === 0 ? <tr>
                      <td colSpan={3} className="p-4 text-center">No shopkeepers found</td>
                    </tr> : shopkeepers.map(shopkeeper => <tr key={shopkeeper.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">{shopkeeper.name}</td>
                        <td className="p-3 text-right">{formatCurrency(Math.abs(shopkeeper.balance))}</td>
                        <td className="p-3 text-right">
                          {shopkeeper.balance < 0 ? <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">They owe you</span> : shopkeeper.balance > 0 ? <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">You owe them</span> : <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">No balance</span>}
                        </td>
                      </tr>)}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Overview of your business financial position</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-3">Assets</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Inventory Value:</span>
                    <span className="font-medium">{formatCurrency(financialSummary.totalStockValue)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Receivables from Shopkeepers:</span>
                    <span className="font-medium">{formatCurrency(financialSummary.totalDueFromShopkeepers)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Sales (Lifetime):</span>
                    <span className="font-medium">{formatCurrency(financialSummary.totalSales)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Total Assets:</span>
                    <span className="font-bold">{formatCurrency(financialSummary.totalStockValue + financialSummary.totalDueFromShopkeepers)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-3">Liabilities</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Payables to Shopkeepers:</span>
                    <span className="font-medium">{formatCurrency(financialSummary.totalDueToShopkeepers)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Purchases (Lifetime):</span>
                    <span className="font-medium">{formatCurrency(financialSummary.totalPurchases)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Total Liabilities:</span>
                    <span className="font-bold">{formatCurrency(financialSummary.totalDueToShopkeepers)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Net Position:</span>
                <span className="text-xl font-bold">{formatCurrency(financialSummary.netBalance)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default FinancialPage;