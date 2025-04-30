
import React from "react";
import { Menu, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarOpen }) => {
  const { settings, updateSetting } = useSettings();
  const { currentUser, logout } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleTheme = () => {
    updateSetting("theme", settings?.theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "You've been logged out",
    });
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b z-50 h-16">
      <div className="px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <span className="ml-3 text-xl font-semibold hidden sm:inline-block">
            Stock Ledger
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground"
          >
            {settings?.theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {currentUser && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-foreground"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
