
import React from "react";
import { Menu, Bell, Moon, Sun, LogOut, Settings, Search, Plus } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  toggleSidebar,
  sidebarOpen
}) => {
  const { settings, theme, toggleTheme } = useSettings();
  const { currentUser, logout } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = React.useState(false);
  
  const handleThemeToggle = () => {
    toggleTheme();
    toast({
      title: theme === "dark" ? "Light Mode Enabled" : "Dark Mode Enabled",
      description: theme === "dark" ? "The application is now using light theme" : "The application is now using dark theme",
      duration: 2000
    });
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "You've been logged out",
      variant: "default"
    });
    navigate("/login");
  };
  
  const getUserInitials = () => {
    if (!currentUser?.email) return "U";
    // Extract initials from email (first letter before @ and first letter of domain)
    const emailParts = currentUser.email.split('@');
    if (emailParts.length < 2) return "U";
    return (emailParts[0][0] + (emailParts[1][0] || "")).toUpperCase();
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b z-50 h-16 sticky top-0 shadow-sm">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={toggleSidebar} 
            className="p-2 rounded-md hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="h-5 w-5" />
          </motion.button>
          <motion.span 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.3 }}
            className="ml-3 text-xl font-semibold hidden sm:inline-block text-gradient"
          >
            Stock Ledger
          </motion.span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Search button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearchOpen(true)} 
            className="text-foreground rounded-full hover:bg-accent/60" 
            aria-label="Search"
          >
            <Search className="h-4.5 w-4.5" />
          </Button>
          
          {/* Quick action button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-foreground rounded-full hover:bg-accent/60"
              >
                <Plus className="h-4.5 w-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl p-1.5">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold">Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={() => navigate("/sales/new")} className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent/70">
                <Badge variant="outline" className="h-6 w-6 p-1 flex items-center justify-center rounded-full border-brand-500/30 bg-brand-500/10">
                  <Plus className="h-3.5 w-3.5 text-brand-500" />
                </Badge>
                New Sale
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/inventory/add")} className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent/70">
                <Badge variant="outline" className="h-6 w-6 p-1 flex items-center justify-center rounded-full border-brand-500/30 bg-brand-500/10">
                  <Plus className="h-3.5 w-3.5 text-brand-500" />
                </Badge>
                Add Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/customers/add")} className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent/70">
                <Badge variant="outline" className="h-6 w-6 p-1 flex items-center justify-center rounded-full border-brand-500/30 bg-brand-500/10">
                  <Plus className="h-3.5 w-3.5 text-brand-500" />
                </Badge>
                Add Customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/expenses/add")} className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent/70">
                <Badge variant="outline" className="h-6 w-6 p-1 flex items-center justify-center rounded-full border-brand-500/30 bg-brand-500/10">
                  <Plus className="h-3.5 w-3.5 text-brand-500" />
                </Badge>
                Record Expense
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleThemeToggle} 
              className="text-foreground rounded-full hover:bg-accent/60" 
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </Button>
          </motion.div>
          
          {/* User menu */}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8 ring-2 ring-brand-200/30 ring-offset-1 ring-offset-background">
                    <AvatarFallback className="bg-brand-100 text-brand-800 text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl p-1.5">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.email?.split('@')[0]}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent/70">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent/70">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md text-red-500 hover:bg-red-100/10 hover:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search for products, customers, sales and more.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Type to search..." className="w-full" autoComplete="off" autoFocus />
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Press <kbd className="rounded-md border px-1 py-0.5 bg-muted text-xs">↵</kbd> to search
              </p>
            </div>
            <div className="h-64 overflow-y-auto">
              <p className="text-center text-muted-foreground py-8">
                Start typing to see results
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
