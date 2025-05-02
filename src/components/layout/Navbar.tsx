
import React from "react";
import { Menu, Bell, Moon, Sun, LogOut, Settings } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarOpen }) => {
  const { settings, theme, toggleTheme } = useSettings();
  const { currentUser, logout } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleThemeToggle = () => {
    toggleTheme();
    
    toast({
      title: theme === "dark" ? "Light Mode Enabled" : "Dark Mode Enabled",
      description: theme === "dark" 
        ? "The application is now using light theme" 
        : "The application is now using dark theme",
      duration: 2000,
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "You've been logged out",
      variant: "default",
    });
    navigate("/login");
  };

  return (
    <header className="bg-background border-b z-50 h-16 sticky top-0">
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
            className="ml-3 text-xl font-semibold hidden sm:inline-block"
          >
            Stock Ledger
          </motion.span>
        </div>

        <div className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              className="text-foreground rounded-full"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="text-foreground rounded-full"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </motion.div>

          {currentUser && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-foreground rounded-full"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
