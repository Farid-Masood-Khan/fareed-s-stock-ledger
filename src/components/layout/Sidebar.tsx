
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  User,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Receipt,
  Wrench,
  Info,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/StoreContext";
import { useSettings } from "@/context/SettingsContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useStore();
  const { isDarkMode } = useSettings();

  const isActive = (path: string) => location.pathname === path;

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: <Package className="mr-3 h-5 w-5" />,
      label: "Inventory",
      path: "/inventory",
    },
    {
      icon: <ShoppingCart className="mr-3 h-5 w-5" />,
      label: "Sales",
      path: "/sales",
    },
    {
      icon: <Users className="mr-3 h-5 w-5" />,
      label: "Shopkeepers",
      path: "/shopkeepers",
    },
    {
      icon: <User className="mr-3 h-5 w-5" />,
      label: "Customers",
      path: "/customers",
    },
    {
      icon: <BarChart3 className="mr-3 h-5 w-5" />,
      label: "Reports",
      path: "/reports",
    },
    {
      icon: <Wallet className="mr-3 h-5 w-5" />,
      label: "Financial",
      path: "/financial",
    },
    {
      icon: <Receipt className="mr-3 h-5 w-5" />,
      label: "Expenses",
      path: "/expenses",
    },
    {
      icon: <Wrench className="mr-3 h-5 w-5" />,
      label: "Services",
      path: "/services",
    },
    {
      icon: <Info className="mr-3 h-5 w-5" />,
      label: "About",
      path: "/about",
    },
    {
      icon: <PhoneCall className="mr-3 h-5 w-5" />,
      label: "Contact",
      path: "/contact",
    },
    {
      icon: <Settings className="mr-3 h-5 w-5" />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={cn(
        "z-30 fixed inset-y-0 left-0 w-64 transform transition-transform duration-200 ease-in-out",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        }
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden shadow-lg",
          isDarkMode
            ? "bg-zinc-950 border-r border-zinc-800"
            : "bg-white border-r"
        )}
      >
        <div className="p-4 flex items-center">
          <h2 className="text-lg font-semibold">Stock Ledger</h2>
        </div>

        <Separator />

        <ScrollArea className="flex-1 pt-3">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "group flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
