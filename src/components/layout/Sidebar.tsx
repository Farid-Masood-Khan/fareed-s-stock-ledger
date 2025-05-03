
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Package, Receipt, User, Users, 
  CreditCard, PieChart, Settings, FileBarChart, 
  CircleDollarSign, ClipboardList, Info, Mail, X, 
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden backdrop-blur-sm" 
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
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r overflow-hidden pt-20 lg:translate-x-0 lg:static lg:z-0 shadow-sm",
          settings?.theme === "dark" ? "dark border-border/30" : "border-border/60"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 lg:hidden">
          <h2 className="text-lg font-semibold text-foreground/90">Stock Ledger</h2>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="rounded-full h-8 w-8 p-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="px-3 py-4 flex flex-col min-h-[calc(100vh-120px)]">
            {/* Main navigation */}
            <div className="space-y-1.5">
              {mainMenuItems.map((item) => (
                <Tooltip key={item.path} delayDuration={collapsed ? 300 : 1000}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center rounded-md transition-all duration-200",
                        collapsed 
                          ? "justify-center p-2.5" 
                          : "px-3 py-2.5 text-sm font-medium",
                        isActive 
                          ? "bg-primary/10 text-primary font-medium shadow-sm" 
                          : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <span className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                        <span className={cn(
                          "flex items-center justify-center", 
                          !collapsed && "mr-3"
                        )}>
                          {item.icon}
                        </span>
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </span>
                    </NavLink>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" sideOffset={10} className="bg-card text-foreground border border-border shadow-md">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
            
            {/* Divider */}
            <div className={cn("my-4 border-t border-border/50", collapsed && "mx-2")} />

            {/* Secondary navigation */}
            <div className="space-y-1.5">
              {secondaryMenuItems.map((item) => (
                <Tooltip key={item.path} delayDuration={collapsed ? 300 : 1000}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center rounded-md transition-all duration-200",
                        collapsed 
                          ? "justify-center p-2.5" 
                          : "px-3 py-2.5 text-sm font-medium",
                        isActive 
                          ? "bg-primary/10 text-primary font-medium shadow-sm" 
                          : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <span className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                        <span className={cn(
                          "flex items-center justify-center", 
                          !collapsed && "mr-3"
                        )}>
                          {item.icon}
                        </span>
                        {!collapsed && <span className="truncate">{item.name}</span>}
                      </span>
                    </NavLink>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" sideOffset={10} className="bg-card text-foreground border border-border shadow-md">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
            
            {/* Expand/collapse button */}
            <div className="mt-auto pt-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-center rounded-md hover:bg-muted/60",
                  !collapsed && "justify-between"
                )}
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <>
                    <span className="text-xs font-medium">Collapse sidebar</span>
                    <ChevronLeft className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </>
  );
};

export default Sidebar;
