
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Receipt,
  Users,
  CreditCard,
  PieChart,
  Settings,
  FileBarChart,
  User,
  Menu,
  CircleDollarSign,
  ClipboardList,
  Info,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, currentPath }) => {
  const { settings } = useSettings();
  
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="mr-3 h-5 w-5" /> },
    { name: "Inventory", path: "/inventory", icon: <Package className="mr-3 h-5 w-5" /> },
    { name: "Sales", path: "/sales", icon: <Receipt className="mr-3 h-5 w-5" /> },
    { name: "Customers", path: "/customers", icon: <User className="mr-3 h-5 w-5" /> },
    { name: "Shopkeepers", path: "/shopkeepers", icon: <Users className="mr-3 h-5 w-5" /> },
    { name: "Expenses", path: "/expenses", icon: <CircleDollarSign className="mr-3 h-5 w-5" /> },
    { name: "Reports", path: "/reports", icon: <FileBarChart className="mr-3 h-5 w-5" /> },
    { name: "Financial", path: "/financial", icon: <PieChart className="mr-3 h-5 w-5" /> },
    { name: "Services", path: "/services", icon: <ClipboardList className="mr-3 h-5 w-5" /> },
    { name: "About", path: "/about", icon: <Info className="mr-3 h-5 w-5" /> },
    { name: "Contact", path: "/contact", icon: <Mail className="mr-3 h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="mr-3 h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r overflow-y-auto pt-20 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          settings?.theme === "dark" ? "dark" : ""
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 lg:hidden">
          <h2 className="text-lg font-semibold">Stock Ledger</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )
              }
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
