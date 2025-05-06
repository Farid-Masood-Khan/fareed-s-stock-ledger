import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/context/SettingsContext";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import {
  Wallet,
  ChartBar,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  LineChart,
  Users,
  Package,
  FileText,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  CircleDollarSign,
  ShoppingCart,
  Save
} from "lucide-react";
import {
  PieChart as RechartPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart as RechartLineChart,
  Line
} from 'recharts';

const FinancialPage = () => {
  const { 
    generateFinancialSummary, 
    generateStockReport, 
    shopkeepers,
    getRecentTransactions
  } = useStore();
  
  const { settings } = useSettings();
  const { toast } = useToast();
  const { playSound } = useNotificationSound();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [financialSummary, setFinancialSummary] = useState(generateFinancialSummary());
  const [stockReport, setStockReport] = useState(generateStockReport());
  const [transactions, setTransactions] = useState(getRecentTransactions());
  
  // Chart color schemes
  const ASSET_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'];
  const TRANSACTION_COLORS = {
    sales: '#10b981',
    purchases: '#ef4444',
    expenses: '#f59e0b',
    income: '#3b82f6'
  };
  
  // Filter transactions by time range
  const getFilteredTransactions = () => {
    if (timeRange === "all") return transactions;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };
  
  // Prepare data for pie chart
  const assetsData = [
    {
      name: "Stock Value",
      value: financialSummary.totalStockValue
    },
    {
      name: "Receivables",
      value: financialSummary.totalDueFromShopkeepers
    }
  ];
  
  const liabilitiesData = [
    {
      name: "Payables",
      value: financialSummary.totalDueToShopkeepers
    }
  ];
  
  // Prepare data for sales vs purchases chart
  const getTransactionData = () => {
    const filteredTransactions = getFilteredTransactions();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = {};
    
    // Initialize data structure
    months.forEach(month => {
      data[month] = {
        name: month,
        sales: 0,
        purchases: 0
      };
    });
    
    // Populate with actual data
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = months[date.getMonth()];
      
      if (transaction.type === 'sale') {
        data[month].sales += transaction.amount;
      } else if (transaction.type === 'purchase') {
        data[month].purchases += transaction.amount;
      }
    });
    
    return Object.values(data);
  };
  
  // Cash flow data
  const getCashFlowData = () => {
    const filteredTransactions = getFilteredTransactions();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = {};
    
    // Initialize data structure
    months.forEach(month => {
      data[month] = {
        name: month,
        income: 0,
        expenses: 0,
        cashFlow: 0
      };
    });
    
    // Populate with actual data
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const month = months[date.getMonth()];
      
      if (transaction.type === 'sale' || transaction.type === 'payment_received') {
        data[month].income += transaction.amount;
        data[month].cashFlow += transaction.amount;
      } else if (transaction.type === 'purchase' || transaction.type === 'payment_made' || transaction.type === 'expense') {
        data[month].expenses += transaction.amount;
        data[month].cashFlow -= transaction.amount;
      }
    });
    
    return Object.values(data);
  };
  
  // Handle refresh of financial data
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call or complex calculation
    setTimeout(() => {
      const newFinancialSummary = generateFinancialSummary();
      const newStockReport = generateStockReport();
      const newTransactions = getRecentTransactions();
      
      setFinancialSummary(newFinancialSummary);
      setStockReport(newStockReport);
      setTransactions(newTransactions);
      setRefreshing(false);
      
      toast({
        title: "Data Refreshed",
        description: "Financial data has been updated successfully.",
      });
      
      playSound("success");
    }, 1000);
  };
  
  // Export financial report
  const handleExportReport = () => {
    // Simulate report generation and export
    toast({
      title: "Report Generated",
      description: "Financial report has been exported to Excel.",
    });
    
    playSound("success");
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
      className="space-y-6 my-[28px] pb-12" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with actions */}
      <motion.div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Financial Overview</h1>
          <p className="text-muted-foreground">Comprehensive view of your business financial position</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Button onClick={handleExportReport} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Financial Stats */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={itemVariants}>
        <Card className="bg-gradient-to-br from-white to-brand-50/30 dark:from-gray-800 dark:to-brand-900/10 hover-lift border-l-4 border-l-brand-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Net Balance</p>
                <div className="text-2xl font-bold mt-1">{formatCurrency(financialSummary.netBalance)}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Total assets - liabilities
                </p>
              </div>
              <div className="bg-brand-100/80 dark:bg-brand-900/40 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
            
            {financialSummary.netBalance > 0 ? (
              <div className="flex items-center gap-1 mt-3 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" /> Positive balance
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-3 text-sm text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Negative balance
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 hover-lift border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Inventory Value</p>
                <div className="text-2xl font-bold mt-1">{formatCurrency(financialSummary.totalStockValue)}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Package className="h-3 w-3 mr-1" />
                  {stockReport.totalItems} items in stock
                </p>
              </div>
              <div className="bg-blue-100/80 dark:bg-blue-900/40 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            {stockReport.lowStockItems > 0 && (
              <div className="flex items-center gap-1 mt-3 text-sm text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" /> {stockReport.lowStockItems} items low in stock
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10 hover-lift border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Receivables</p>
                <div className="text-2xl font-bold mt-1">{formatCurrency(financialSummary.totalDueFromShopkeepers)}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  Due from shopkeepers
                </p>
              </div>
              <div className="bg-green-100/80 dark:bg-green-900/40 p-3 rounded-full">
                <ArrowDown className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            {financialSummary.totalDueFromShopkeepers > 0 && (
              <div className="flex items-center gap-1 mt-3 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" /> Incoming payments expected
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-red-50/30 dark:from-gray-800 dark:to-red-900/10 hover-lift border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Payables</p>
                <div className="text-2xl font-bold mt-1">{formatCurrency(financialSummary.totalDueToShopkeepers)}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  Due to shopkeepers
                </p>
              </div>
              <div className="bg-red-100/80 dark:bg-red-900/40 p-3 rounded-full">
                <ArrowUp className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            {financialSummary.totalDueToShopkeepers > 0 && (
              <div className="flex items-center gap-1 mt-3 text-sm text-amber-600 dark:text-amber-400">
                <TrendingDown className="h-4 w-4" /> Outgoing payments pending
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Tabbed Content */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-brand-100 dark:data-[state=active]:bg-brand-900/40">
              <PieChart className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2 data-[state=active]:bg-brand-100 dark:data-[state=active]:bg-brand-900/40">
              <BarChart3 className="h-4 w-4" /> Transactions
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2 data-[state=active]:bg-brand-100 dark:data-[state=active]:bg-brand-900/40">
              <Users className="h-4 w-4" /> Accounts
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* Asset Distribution and Account Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                      <PieChart className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </span>
                    <div>
                      <CardTitle>Assets Distribution</CardTitle>
                      <CardDescription>
                        Total value: {formatCurrency(financialSummary.totalStockValue + financialSummary.totalDueFromShopkeepers)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartPieChart>
                        <Pie 
                          data={assetsData} 
                          cx="50%" 
                          cy="50%" 
                          labelLine={false} 
                          outerRadius={90} 
                          innerRadius={40}
                          fill="#8884d8" 
                          dataKey="value" 
                          nameKey="name" 
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {assetsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={value => formatCurrency(value as number)} />
                        <Legend />
                      </RechartPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                      <Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    </span>
                    <div>
                      <CardTitle>Account Balances</CardTitle>
                      <CardDescription>Shopkeeper accounts and balances</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto scrollbar-custom">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50 dark:bg-muted/20">
                          <th className="text-left p-3 text-sm font-medium">Shopkeeper</th>
                          <th className="text-right p-3 text-sm font-medium">Balance</th>
                          <th className="text-right p-3 text-sm font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {shopkeepers.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-muted-foreground">No shopkeepers found</td>
                          </tr>
                        ) : (
                          shopkeepers.map(shopkeeper => (
                            <tr key={shopkeeper.id} className="hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors">
                              <td className="p-3 font-medium">{shopkeeper.name}</td>
                              <td className="p-3 text-right">{formatCurrency(Math.abs(shopkeeper.balance))}</td>
                              <td className="p-3 text-right">
                                {shopkeeper.balance < 0 ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">They owe you</span>
                                ) : shopkeeper.balance > 0 ? (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">You owe them</span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs">No balance</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sales vs Purchases Chart */}
            <Card className="hover-lift">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </span>
                  <div>
                    <CardTitle>Sales vs Purchases</CardTitle>
                    <CardDescription>Monthly comparison {timeRange !== "all" ? `(${timeRange})` : ""}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getTransactionData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickFormatter={value => `${value / 1000}k`}
                        label={{ value: 'Amount (PKR)', angle: -90, position: 'insideLeft', offset: -15, fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={value => [`${formatCurrency(value as number)}`, undefined]} 
                        contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Bar 
                        name="Sales" 
                        dataKey="sales" 
                        fill={TRANSACTION_COLORS.sales}
                        radius={[4, 4, 0, 0]} 
                        barSize={20}
                      />
                      <Bar 
                        name="Purchases" 
                        dataKey="purchases" 
                        fill={TRANSACTION_COLORS.purchases}
                        radius={[4, 4, 0, 0]} 
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Financial Summary */}
            <Card className="hover-lift">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </span>
                  <div>
                    <CardTitle>Financial Summary</CardTitle>
                    <CardDescription>Overview of your business financial position</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg mb-3 section-heading">Assets</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Inventory Value:</span>
                          <span className="font-medium">{formatCurrency(financialSummary.totalStockValue)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Receivables from Shopkeepers:</span>
                          <span className="font-medium">{formatCurrency(financialSummary.totalDueFromShopkeepers)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Total Sales (Lifetime):</span>
                          <span className="font-medium">{formatCurrency(financialSummary.totalSales)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50 bg-brand-50/30 dark:bg-brand-900/10 px-2 rounded">
                          <span className="font-medium">Total Assets:</span>
                          <span className="font-bold">{formatCurrency(financialSummary.totalStockValue + financialSummary.totalDueFromShopkeepers)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg mb-3 section-heading">Liabilities</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Payables to Shopkeepers:</span>
                          <span className="font-medium">{formatCurrency(financialSummary.totalDueToShopkeepers)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Total Purchases (Lifetime):</span>
                          <span className="font-medium">{formatCurrency(financialSummary.totalPurchases)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50 bg-brand-50/30 dark:bg-brand-900/10 px-2 rounded">
                          <span className="font-medium">Total Liabilities:</span>
                          <span className="font-bold">{formatCurrency(financialSummary.totalDueToShopkeepers)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg">
                      <span className="text-lg font-semibold">Net Position:</span>
                      <span className={`text-xl font-bold ${financialSummary.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(financialSummary.netBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 inline mr-1" /> Last updated: {new Date().toLocaleDateString()}
                  </p>
                  <Button variant="outline" onClick={handleExportReport} size="sm" className="flex items-center gap-2">
                    <Download className="h-3.5 w-3.5" /> Export Report
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab Content */}
          <TabsContent value="transactions" className="space-y-6 animate-fade-in">
            {/* Cash Flow Chart */}
            <Card className="hover-lift">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <LineChart className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </span>
                  <div>
                    <CardTitle>Cash Flow</CardTitle>
                    <CardDescription>Monthly income, expenses and cash flow {timeRange !== "all" ? `(${timeRange})` : ""}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLineChart data={getCashFlowData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickFormatter={value => `${value / 1000}k`}
                        label={{ value: 'Amount (PKR)', angle: -90, position: 'insideLeft', offset: -15, fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={value => [`${formatCurrency(value as number)}`, undefined]} 
                        contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Line 
                        type="monotone" 
                        name="Income" 
                        dataKey="income" 
                        stroke={TRANSACTION_COLORS.income}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        name="Expenses" 
                        dataKey="expenses" 
                        stroke={TRANSACTION_COLORS.expenses}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        name="Net Cash Flow" 
                        dataKey="cashFlow" 
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </RechartLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Transactions */}
            <Card className="hover-lift">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </span>
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest financial activities {timeRange !== "all" ? `(${timeRange})` : ""}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto scrollbar-custom">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50 dark:bg-muted/20">
                        <th className="text-left p-3 text-sm font-medium">Date</th>
                        <th className="text-left p-3 text-sm font-medium">Description</th>
                        <th className="text-left p-3 text-sm font-medium">Type</th>
                        <th className="text-left p-3 text-sm font-medium">Entity</th>
                        <th className="text-right p-3 text-sm font-medium">Amount</th>
                        <th className="text-right p-3 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {getFilteredTransactions().length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">No transactions found</td>
                        </tr>
                      ) : (
                        getFilteredTransactions().slice(0, 10).map((transaction, index) => (
                          <tr key={index} className="hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors">
                            <td className="p-3 whitespace-nowrap">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="p-3">{transaction.description}</td>
                            <td className="p-3">
                              {transaction.type === 'sale' && (
                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <ShoppingCart className="h-3.5 w-3.5" /> Sale
                                </span>
                              )}
                              {transaction.type === 'purchase' && (
                                <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                  <Package className="h-3.5 w-3.5" /> Purchase
                                </span>
                              )}
                              {transaction.type === 'payment_received' && (
                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                  <CircleDollarSign className="h-3.5 w-3.5" /> Payment In
                                </span>
                              )}
                              {transaction.type === 'payment_made' && (
                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                  <CircleDollarSign className="h-3.5 w-3.5" /> Payment Out
                                </span>
                              )}
                              {transaction.type === 'expense' && (
                                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                                  <CircleDollarSign className="h-3.5 w-3.5" /> Expense
                                </span>
                              )}
                            </td>
                            <td className="p-3">{transaction.entity}</td>
                            <td className="p-3 text-right font-medium whitespace-nowrap">
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td className="p-3 text-right">
                              {transaction.status === 'completed' ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs flex items-center gap-1 justify-center">
                                  <CheckCircle className="h-3 w-3" /> Completed
                                </span>
                              ) : transaction.status === 'pending' ? (
                                <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-full text-xs flex items-center gap-1 justify-center">
                                  <Clock className="h-3 w-3" /> Pending
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs flex items-center gap-1 justify-center">
                                  <AlertTriangle className="h-3 w-3" /> Failed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {getFilteredTransactions().length > 10 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" size="sm">View All Transactions</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Transaction Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full">
                      <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <div className="text-xl font-bold">{formatCurrency(financialSummary.totalSales)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full">
                      <Package className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Purchases</p>
                      <div className="text-xl font-bold">{formatCurrency(financialSummary.totalPurchases)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-full">
                      <CircleDollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Sale</p>
                      <div className="text-xl font-bold">
                        {formatCurrency(financialSummary.totalSales > 0 
                          ? financialSummary.totalSales / (getFilteredTransactions().filter(t => t.type === 'sale').length || 1) 
                          : 0
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profit Margin</p>
                      <div className="text-xl font-bold">
                        {financialSummary.totalSales > 0
                          ? `${Math.round((financialSummary.totalSales - financialSummary.totalPurchases) / financialSummary.totalSales * 100)}%`
                          : "N/A"
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Accounts Tab Content */}
          <TabsContent value="accounts" className="space-y-6 animate-fade-in">
            {/* Shopkeepers Detail */}
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-50 dark:bg-brand-900/40 p-2 rounded-full">
                    <Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </span>
                  <div>
                    <CardTitle>Shopkeeper Accounts</CardTitle>
                    <CardDescription>Detailed financial relationships with shopkeepers</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Export Accounts
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto scrollbar-custom">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50 dark:bg-muted/20">
                        <th className="text-left p-3 text-sm font-medium">Name</th>
                        <th className="text-left p-3 text-sm font-medium">Contact</th>
                        <th className="text-right p-3 text-sm font-medium">Total Purchases</th>
                        <th className="text-right p-3 text-sm font-medium">Total Payments</th>
                        <th className="text-right p-3 text-sm font-medium">Balance</th>
                        <th className="text-right p-3 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {shopkeepers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">No shopkeepers found</td>
                        </tr>
                      ) : (
                        shopkeepers.map(shopkeeper => (
                          <tr key={shopkeeper.id} className="hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors">
                            <td className="p-3 font-medium">{shopkeeper.name}</td>
                            <td className="p-3">{shopkeeper.phone || "N/A"}</td>
                            <td className="p-3 text-right">
                              {formatCurrency(shopkeeper.totalPurchases || 0)}
                            </td>
                            <td className="p-3 text-right">
                              {formatCurrency(shopkeeper.totalPayments || 0)}
                            </td>
                            <td className={`p-3 text-right font-medium ${
                              shopkeeper.balance < 0 
                                ? "text-green-600 dark:text-green-400" 
                                : shopkeeper.balance > 0 
                                  ? "text-red-600 dark:text-red-400" 
                                  : ""
                            }`}>
                              {formatCurrency(Math.abs(shopkeeper.balance))}
                            </td>
                            <td className="p-3 text-right">
                              {shopkeeper.balance < 0 ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">They owe you</span>
                              ) : shopkeeper.balance > 0 ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">You owe them</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs">No balance</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="bg-brand-50/50 dark:bg-brand-900/10 font-medium">
                      <tr>
                        <td colSpan={4} className="p-3 text-right">Total Balance:</td>
                        <td className="p-3 text-right font-bold">
                          {formatCurrency(Math.abs(financialSummary.netShopkeeperBalance))}
                        </td>
                        <td className="p-3 text-right">
                          {financialSummary.netShopkeeperBalance < 0 ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs">Net receivable</span>
                          ) : financialSummary.netShopkeeperBalance > 0 ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs">Net payable</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs">Balanced</span>
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  <Info className="h-3.5 w-3.5 inline mr-1" /> Positive balances indicate amounts you owe, negative balances indicate amounts owed to you.
                </p>
              </CardFooter>
            </Card>
            
            {/* Account Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-lg">Record Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Record a payment to or from a shopkeeper account.</p>
                  <Button className="w-full">Record Payment</Button>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-lg">Account Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Generate a statement for a specific account.</p>
                  <Button className="w-full">Generate Statement</Button>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-lg">Reconcile Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Balance and reconcile all financial accounts.</p>
                  <Button className="w-full">Reconcile Now</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default FinancialPage;
