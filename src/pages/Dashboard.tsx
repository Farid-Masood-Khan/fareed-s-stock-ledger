
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/formatters";
import { ChartBar, Users, Wallet, Receipt, EyeOff, Laptop, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { 
    generateSalesReport, 
    generateStockReport, 
    generateFinancialSummary,
    products,
    sales 
  } = useStore();
  
  const { isMoneyHidden, toggleMoneyVisibility } = useSettings();

  const dailyReport = generateSalesReport("daily");
  const weeklyReport = generateSalesReport("weekly");
  const stockReport = generateStockReport();
  const financialSummary = generateFinancialSummary();

  // Format money value based on whether it should be hidden
  const formatMoney = (value: number) => {
    return isMoneyHidden ? "***" : formatCurrency(value);
  };

  // Prepare data for recent sales chart with potentially hidden values
  const last7DaysSales = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayTotal = sales
      .filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getDate() === date.getDate() &&
               saleDate.getMonth() === date.getMonth() &&
               saleDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, sale) => sum + sale.total, 0);
    
    return { name: dateStr, amount: dayTotal };
  });

  // Prepare data for category distribution
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += product.quantity * product.price;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to Subhan Computer's Stock Management System
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleMoneyVisibility}
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <EyeOff size={16} />
          {isMoneyHidden ? "Show Values" : "Hide Values"}
        </Button>
      </motion.div>
      
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium">Daily Sales</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatMoney(dailyReport.totalSales)}</div>
                <p className="text-xs text-muted-foreground mt-1">{dailyReport.salesCount} transactions today</p>
              </div>
              <Receipt className="h-8 w-8 text-brand-600 opacity-80" />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatMoney(stockReport.totalValue)}</div>
                <p className="text-xs text-muted-foreground mt-1">{stockReport.totalItems} items in stock</p>
              </div>
              <ChartBar className="h-8 w-8 text-brand-600 opacity-80" />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium">Shopkeeper Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatMoney(financialSummary.totalDueFromShopkeepers)}</div>
                <p className="text-xs text-muted-foreground mt-1">Due from shopkeepers</p>
              </div>
              <Users className="h-8 w-8 text-brand-600 opacity-80" />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium">Net Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{formatMoney(financialSummary.netBalance)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total assets - liabilities</p>
              </div>
              <Wallet className="h-8 w-8 text-brand-600 opacity-80" />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Sales Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={last7DaysSales}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 'auto']} tickFormatter={(value) => isMoneyHidden ? "***" : formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value) => [isMoneyHidden ? "***" : formatCurrency(value as number), 'Sales']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Sales"
                    stroke="#1E3A8A"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => isMoneyHidden ? "***" : formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value) => [isMoneyHidden ? "***" : formatCurrency(value as number), 'Value']}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-500" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-md border bg-muted/30">
                  <div className="bg-brand-100 dark:bg-brand-900/30 rounded-full p-2 text-brand-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Morning Stock Check</h3>
                    <p className="text-sm text-muted-foreground">9:00 AM - Inventory verification</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-md border bg-muted/30">
                  <div className="bg-brand-100 dark:bg-brand-900/30 rounded-full p-2 text-brand-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Supplier Meeting</h3>
                    <p className="text-sm text-muted-foreground">2:00 PM - New laptop arrivals</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-md border bg-muted/30">
                  <div className="bg-brand-100 dark:bg-brand-900/30 rounded-full p-2 text-brand-600">
                    <Laptop className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Repair Service</h3>
                    <p className="text-sm text-muted-foreground">4:30 PM - Dell laptop repair pickup</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3">Product</th>
                      <th className="text-left p-3">Code</th>
                      <th className="text-right p-3">Sold</th>
                      <th className="text-right p-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyReport.topSellingProducts.map((product, index) => (
                      <motion.tr 
                        key={product.productId} 
                        className="border-b hover:bg-muted/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="p-3">{product.productName}</td>
                        <td className="p-3">
                          {products.find(p => p.id === product.productId)?.code || 'N/A'}
                        </td>
                        <td className="p-3 text-right">{product.quantitySold}</td>
                        <td className="p-3 text-right">{formatMoney(product.revenue)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
