import React, { useState } from "react";
import { Plus, Trash2, Filter, ArrowDownWideNarrow, Search } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, isValid } from "date-fns";

// Expense categories
const EXPENSE_CATEGORIES = ["Rent", "Utilities", "Salaries", "Inventory", "Marketing", "Equipment", "Maintenance", "Transportation", "Insurance", "Taxes", "Miscellaneous"];

// Extended store with expenses
type Expense = {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
};

// This would normally be handled by adding to the store context
// For this example we'll use local state
const ExpensesPage = () => {
  const {
    toast
  } = useToast();
  const {
    isMoneyHidden
  } = useSettings();

  // Local state for expenses (in a real app, this would be in the store context)
  const [expenses, setExpenses] = useState<Expense[]>([{
    id: "exp-1",
    date: new Date(),
    amount: 1200,
    category: "Rent",
    description: "Monthly shop rent"
  }, {
    id: "exp-2",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    amount: 350,
    category: "Utilities",
    description: "Electricity and water bill"
  }]);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date()
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Generate ID for new expense
  const generateId = (): string => `exp-${Math.random().toString(36).substr(2, 9)}`;

  // Handle adding a new expense
  const handleAddExpense = () => {
    if (!newExpense.amount || !newExpense.category) {
      toast({
        title: "Error",
        description: "Please enter an amount and select a category",
        variant: "destructive"
      });
      return;
    }
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    const expense: Expense = {
      id: generateId(),
      date: newExpense.date,
      amount: amount,
      category: newExpense.category,
      description: newExpense.description
    };
    setExpenses([...expenses, expense]);
    toast({
      title: "Success",
      description: "Expense added successfully"
    });
    setNewExpense({
      amount: "",
      category: "",
      description: "",
      date: new Date()
    });
    setIsAddExpenseOpen(false);
  };

  // Delete an expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Success",
      description: "Expense deleted successfully"
    });
  };

  // Filter expenses by search term and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesTerm = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) || expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    return matchesTerm && matchesCategory;
  });

  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const filteredTotal = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  return <div className="space-y-6 my-[28px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Expense Manager</h1>
        <Button onClick={() => setIsAddExpenseOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMoneyHidden ? "*****" : formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{expenses.length} expense entries</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {EXPENSE_CATEGORIES.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-[1fr,auto,auto,auto] sm:grid-cols-[1fr,1fr,auto,auto,auto] items-center px-4 py-3 border-b bg-muted/40 font-medium">
                <div>Description</div>
                <div className="hidden sm:block">Category</div>
                <div>Date</div>
                <div>Amount</div>
                <div className="w-10"></div>
              </div>

              <div className="divide-y">
                {sortedExpenses.length === 0 ? <div className="px-4 py-6 text-center text-muted-foreground">
                    No expenses found
                  </div> : sortedExpenses.map(expense => <div key={expense.id} className="grid grid-cols-[1fr,auto,auto,auto] sm:grid-cols-[1fr,1fr,auto,auto,auto] items-center px-4 py-3 hover:bg-muted/50">
                      <div className="truncate">{expense.description || "No description"}</div>
                      <div className="hidden sm:block">
                        <Badge variant="outline">{expense.category}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                      </div>
                      <div className="font-medium">
                        {isMoneyHidden ? "*****" : formatCurrency(expense.amount)}
                      </div>
                      <div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>)}
              </div>

              {sortedExpenses.length > 0 && <div className="px-4 py-3 flex justify-end border-t bg-muted/40">
                  <div className="text-sm">
                    Filtered Total: <span className="font-bold">{isMoneyHidden ? "*****" : formatCurrency(filteredTotal)}</span>
                  </div>
                </div>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of your expense.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" placeholder="0.00" value={newExpense.amount} onChange={e => setNewExpense({
                ...newExpense,
                amount: e.target.value
              })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {format(newExpense.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={newExpense.date} onSelect={date => {
                    if (date) {
                      setNewExpense({
                        ...newExpense,
                        date
                      });
                      setCalendarOpen(false);
                    }
                  }} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newExpense.category} onValueChange={value => setNewExpense({
              ...newExpense,
              category: value
            })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter expense details..." value={newExpense.description} onChange={e => setNewExpense({
              ...newExpense,
              description: e.target.value
            })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default ExpensesPage;