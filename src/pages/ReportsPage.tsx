
import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, ChartBar, Calendar as CalendarIcon, ArrowUpDown, FileText } from "lucide-react";
import { ReportTimeframe, ReportDateRange, SalesReport } from "@/types";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const ReportsPage = () => {
  const [timeframe, setTimeframe] = useState<ReportTimeframe>("daily");
  const [dateRange, setDateRange] = useState<ReportDateRange>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    generateSalesReport,
    products,
    sales
  } = useStore();
  
  const report = generateSalesReport(timeframe, dateRange);

  // Prepare data for charts
  const prepareChartData = () => {
    // For time-based charts
    let dataByTime: any[] = [];
    if (timeframe === "daily") {
      // Get sales for each hour of the day
      const hours: Record<string, number> = {};

      // Initialize all hours
      for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}:00` : `${i}:00`;
        hours[hour] = 0;
      }
      
      sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        const today = new Date();
        if (saleDate.getDate() === today.getDate() && saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear()) {
          const hour = saleDate.getHours();
          const hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
          hours[hourStr] = (hours[hourStr] || 0) + sale.total;
        }
      });
      
      dataByTime = Object.entries(hours).map(([time, total]) => ({
        time,
        total
      }));
    } 
    else if (timeframe === "weekly") {
      // Get sales for each day of the current week
      const days: Record<string, number> = {};
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // Initialize all days
      dayNames.forEach(day => {
        days[day] = 0;
      });
      
      const today = new Date();
      const firstDay = new Date(today);
      firstDay.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)

      sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate >= firstDay && saleDate <= today) {
          const day = dayNames[saleDate.getDay()];
          days[day] = (days[day] || 0) + sale.total;
        }
      });
      
      dataByTime = dayNames.map(day => ({
        time: day,
        total: days[day]
      }));
    } 
    else if (timeframe === "monthly") {
      // Get sales for each day of the current month
      const daysInMonth: Record<string, number> = {};
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();

      // Initialize all days
      for (let i = 1; i <= daysCount; i++) {
        daysInMonth[i] = 0;
      }
      
      sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
          const day = saleDate.getDate();
          daysInMonth[day] = (daysInMonth[day] || 0) + sale.total;
        }
      });
      
      dataByTime = Object.entries(daysInMonth).map(([day, total]) => ({
        time: `Day ${day}`,
        total
      }));
    } 
    else if (timeframe === "yearly") {
      // Get sales for each month of the current year
      const months: Record<string, number> = {};
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      // Initialize all months
      monthNames.forEach((month, index) => {
        months[month] = 0;
      });
      
      const currentYear = new Date().getFullYear();
      
      sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate.getFullYear() === currentYear) {
          const month = monthNames[saleDate.getMonth()];
          months[month] = (months[month] || 0) + sale.total;
        }
      });
      
      dataByTime = monthNames.map(month => ({
        time: month,
        total: months[month]
      }));
    } 
    else if (timeframe === "custom") {
      // Group by days in the custom range
      const days: Record<string, number> = {};
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);

      // Create a map of all dates in range
      let currentDate = new Date(start);
      while (currentDate <= end) {
        const dateStr = formatDate(currentDate);
        days[dateStr] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      sales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (saleDate >= start && saleDate <= end) {
          const dateStr = formatDate(saleDate);
          days[dateStr] = (days[dateStr] || 0) + sale.total;
        }
      });
      
      dataByTime = Object.entries(days).map(([date, total]) => ({
        time: date,
        total
      }));
    }
    
    return dataByTime;
  };
  
  const timeSeriesData = prepareChartData();

  // Calculate category distribution
  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = {
        value: 0,
        quantity: 0
      };
    }

    // Sum up the inventory value
    acc[category].value += product.quantity * product.costPrice;
    acc[category].quantity += product.quantity;
    return acc;
  }, {} as Record<string, {
    value: number;
    quantity: number;
  }>);
  
  const categoryChartData = Object.entries(categoryData).map(([name, data]) => ({
    name,
    value: data.value,
    quantity: data.quantity
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  
  const formatTimeframeTitle = (tf: ReportTimeframe): string => {
    switch (tf) {
      case "daily":
        return "Today";
      case "weekly":
        return "This Week";
      case "monthly":
        return "This Month";
      case "yearly":
        return "This Year";
      case "custom":
        return `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`;
      default:
        return "";
    }
  };
  
  const handlePrintReport = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Error",
          description: "Could not open print window. Please check your popup settings.",
          variant: "destructive"
        });
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Sales Report - ${formatTimeframeTitle(timeframe)}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { margin-bottom: 10px; color: #1E3A8A; }
              h2 { margin-top: 30px; margin-bottom: 10px; color: #1E3A8A; }
              .header { margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
              .summary { margin-bottom: 30px; }
              .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
              .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #f9fafb; }
              .summary-card h3 { margin-top: 0; margin-bottom: 5px; font-size: 14px; color: #666; }
              .summary-card p { margin: 0; font-size: 24px; font-weight: bold; color: #1E3A8A; }
              .summary-card small { font-size: 12px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f2f7ff; color: #1E3A8A; }
              .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
              @media print {
                body { margin: 20px; }
                .no-print { display: none; }
                h1, h2 { color: #000; }
                th { background-color: #f2f2f2; color: #000; }
                .summary-card p { color: #000; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Sales Report</h1>
              <p>Period: ${formatTimeframeTitle(timeframe)}</p>
              <p>Generated: ${formatDate(new Date())} at ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <div class="summary">
              <h2>Summary</h2>
              <div class="summary-grid">
                <div class="summary-card">
                  <h3>Total Sales</h3>
                  <p>${formatCurrency(report.totalSales)}</p>
                  <small>${report.salesCount} transactions</small>
                </div>
                <div class="summary-card">
                  <h3>Total Profit</h3>
                  <p>${formatCurrency(report.totalProfit)}</p>
                  <small>Based on cost vs. selling price</small>
                </div>
                <div class="summary-card">
                  <h3>Average Sale</h3>
                  <p>${formatCurrency(report.salesCount > 0 ? report.totalSales / report.salesCount : 0)}</p>
                  <small>Per transaction</small>
                </div>
              </div>
            </div>
            
            <h2>Top Selling Products</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Code</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${report.topSellingProducts.length === 0 ? 
                  `<tr><td colspan="4" style="text-align:center">No sales data available</td></tr>` :
                  report.topSellingProducts.map(product => `
                  <tr>
                    <td>${product.productName}</td>
                    <td>${products.find(p => p.id === product.productId)?.code || 'N/A'}</td>
                    <td>${product.quantitySold}</td>
                    <td>${formatCurrency(product.revenue)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>Stock Ledger System - Sales Report</p>
            </div>
            
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      toast({
        title: "Success",
        description: "Print window opened. Please confirm print settings."
      });
    } catch (error) {
      console.error("Print error:", error);
      toast({
        title: "Error",
        description: "Failed to generate print view",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Sales Reports</h1>
          <p className="text-muted-foreground text-sm">
            View and analyze your sales performance over different time periods
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={timeframe} onValueChange={value => setTimeframe(value as ReportTimeframe)}>
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {timeframe === "custom" && (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="truncate">
                    {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col sm:flex-row">
                  <div>
                    <h4 className="text-sm font-medium p-2">Start Date</h4>
                    <Calendar 
                      mode="single" 
                      selected={dateRange.startDate} 
                      onSelect={date => {
                        if (date) {
                          setDateRange({
                            ...dateRange,
                            startDate: date
                          });
                        }
                      }} 
                      disabled={date => date > dateRange.endDate || date > new Date()} 
                    />
                  </div>
                  <div className="border-t sm:border-t-0 sm:border-l">
                    <h4 className="text-sm font-medium p-2">End Date</h4>
                    <Calendar 
                      mode="single" 
                      selected={dateRange.endDate} 
                      onSelect={date => {
                        if (date) {
                          setDateRange({
                            ...dateRange,
                            endDate: date
                          });
                        }
                      }} 
                      disabled={date => date < dateRange.startDate || date > new Date()} 
                    />
                  </div>
                </div>
                <div className="p-2 border-t">
                  <Button size="sm" className="w-full" onClick={() => setCalendarOpen(false)}>
                    Apply Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          <Button variant="outline" className="md:ml-2 w-full sm:w-auto" onClick={handlePrintReport}>
            <Printer className="h-4 w-4 mr-2" /> Print Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-brand-700 dark:text-brand-500">{formatCurrency(report.totalSales)}</div>
              <p className="text-xs text-muted-foreground mt-1">{report.salesCount} transactions</p>
            </div>
            <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full">
              <ChartBar className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Profit</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-brand-700 dark:text-brand-500">{formatCurrency(report.totalProfit)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Margin: {report.totalSales > 0 ? Math.round(report.totalProfit / report.totalSales * 100) : 0}%
              </p>
            </div>
            <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full">
              <ArrowUpDown className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Average Sale</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-brand-700 dark:text-brand-500">
                {formatCurrency(report.salesCount > 0 ? report.totalSales / report.salesCount : 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
            </div>
            <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full">
              <FileText className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Sales Over Time - {formatTimeframeTitle(timeframe)}</CardTitle>
          <CardDescription>
            Track your sales trends over the selected time period
          </CardDescription>
          <Separator className="my-2" />
        </CardHeader>
        <CardContent>
          <div className="h-[350px] sm:h-[400px] md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={timeSeriesData} 
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="time" 
                  tick={{fontSize: 12}} 
                  interval={timeframe === "yearly" || timeframe === "weekly" ? 0 : "preserveEnd"} 
                />
                <YAxis />
                <Tooltip 
                  formatter={value => [`${formatCurrency(value as number)}`, 'Sales']}
                  contentStyle={{ 
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    borderRadius: '6px'
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Bar 
                  dataKey="total" 
                  name="Sales" 
                  fill="hsl(var(--brand-600))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>
              Distribution of inventory value across different product categories
            </CardDescription>
            <Separator className="my-2" />
          </CardHeader>
          <CardContent>
            <div className="h-[350px] sm:h-[400px] md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={categoryChartData} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    outerRadius={80} 
                    fill="#8884d8" 
                    dataKey="value" 
                    nameKey="name" 
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={value => formatCurrency(value as number)} 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '6px'
                    }}
                    labelStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Products with the highest sales volume and revenue
            </CardDescription>
            <Separator className="my-2" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead className="text-right">Qty Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.topSellingProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No sales data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    report.topSellingProducts.map(product => (
                      <TableRow key={product.productId} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>
                          {products.find(p => p.id === product.productId)?.code || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">{product.quantitySold}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
