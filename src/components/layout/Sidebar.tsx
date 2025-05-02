
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Package, Receipt, User, Users, 
  CreditCard, PieChart, Settings, FileBarChart, 
  CircleDollarSign, ClipboardList, Info, Mail, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  currentPath
}) => {
  const { settings } = useSettings();
  const [collapsed, setCollapsed] = React.useState(false);
  
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <Package className="h-5 w-5" />
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <Receipt className="h-5 w-5" />
    },
    {
      name: "Customers",
      path: "/customers",
      icon: <User className="h-5 w-5" />
    },
    {
      name: "Shopkeepers",
      path: "/shopkeepers",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <CircleDollarSign className="h-5 w-5" />
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FileBarChart className="h-5 w-5" />
    },
    {
      name: "Financial",
      path: "/financial",
      icon: <PieChart className="h-5 w-5" />
    },
    {
      name: "Services",
      path: "/services",
      icon: <ClipboardList className="h-5 w-5" />
    },
    {
      name: "About",
      path: "/about",
      icon: <Info className="h-5 w-5" />
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <Mail className="h-5 w-5" />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  // Group menu items by category
  const mainMenuItems = menuItems.slice(0, 9);
  const secondaryMenuItems = menuItems.slice(9);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: collapsed ? "72px" : "240px",
          translateX: isOpen ? 0 : "-100%" 
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r overflow-hidden pt-20 lg:translate-x-0 lg:static lg:z-0",
          settings?.theme === "dark" ? "dark" : ""
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 lg:hidden">
          <h2 className="text-lg font-semibold">Stock Ledger</h2>
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-3 py-4 flex flex-col h-[calc(100%-60px)]">
          {/* Main navigation */}
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              <Tooltip key={item.path} delayDuration={collapsed ? 300 : 1000}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center rounded-md transition-colors",
                      collapsed 
                        ? "justify-center p-2" 
                        : "px-3 py-2.5 text-sm font-medium",
                      isActive 
                        ? "bg-brand-500/10 text-brand-700 dark:text-brand-400 font-medium" 
                        : "hover:bg-muted text-foreground/70"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <span className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </span>
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
          
          {/* Divider */}
          <div className={cn("my-4 border-t border-border", collapsed && "mx-2")} />

          {/* Secondary navigation */}
          <div className="space-y-1">
            {secondaryMenuItems.map((item) => (
              <Tooltip key={item.path} delayDuration={collapsed ? 300 : 1000}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center rounded-md transition-colors",
                      collapsed 
                        ? "justify-center p-2" 
                        : "px-3 py-2.5 text-sm font-medium",
                      isActive 
                        ? "bg-brand-500/10 text-brand-700 dark:text-brand-400 font-medium" 
                        : "hover:bg-muted text-foreground/70"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <span className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </span>
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
          
          {/* Expand/collapse button (only visible on large screens) */}
          <div className="mt-auto pt-4 hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              className={cn("w-full justify-center", !collapsed && "justify-between")}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.7 12.7L11.1 8.3C11.2 8.2 11.2 8.1 11.3 8C11.4 7.8 11.4 7.6 11.4 7.5C11.4 7.3 11.3 7.1 11.3 7C11.2 6.9 11.2 6.8 11.1 6.7L6.7 2.3C6.5 2.1 6.3 2 6 2C5.7 2 5.5 2.1 5.3 2.3C5.1 2.5 5 2.7 5 3C5 3.3 5.1 3.5 5.3 3.7L9.1 7.5L5.3 11.3C5.1 11.5 5 11.7 5 12C5 12.3 5.1 12.5 5.3 12.7C5.5 12.9 5.7 13 6 13C6.3 13 6.5 12.9 6.7 12.7Z" fill="currentColor" />
                  </svg>
                </motion.div>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.3 12.7L4.9 8.3C4.8 8.2 4.8 8.1 4.7 8C4.6 7.8 4.6 7.6 4.6 7.5C4.6 7.3 4.7 7.1 4.7 7C4.8 6.9 4.8 6.8 4.9 6.7L9.3 2.3C9.5 2.1 9.7 2 10 2C10.3 2 10.5 2.1 10.7 2.3C10.9 2.5 11 2.7 11 3C11 3.3 10.9 3.5 10.7 3.7L6.9 7.5L10.7 11.3C10.9 11.5 11 11.7 11 12C11 12.3 10.9 12.5 10.7 12.7C10.5 12.9 10.3 13 10 13C9.7 13 9.5 12.9 9.3 12.7Z" fill="currentColor" />
                  </svg>
                  <span className="text-xs">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
