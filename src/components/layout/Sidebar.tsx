
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Package, Receipt, User, Users, 
  CircleDollarSign, PieChart, Settings, FileBarChart, 
  ClipboardList, Info, Phone, X, 
  ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  // Auto-collapse sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);
  
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: <Package className="h-5 w-5" />,
      badge: "12"
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
      icon: <Users className="h-5 w-5" />,
      badge: "New"
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
      icon: <ClipboardList className="h-5 w-5" />,
      badge: "5"
    }
  ];

  // Group menu items by category
  const mainMenuItems = menuItems.slice(0, 9);
  const secondaryMenuItems = [
    {
      name: "About",
      path: "/about",
      icon: <Info className="h-5 w-5" />
    },
    {
      name: "Contact",
      path: "/contact",
      icon: <Phone className="h-5 w-5" />
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 lg:hidden backdrop-blur-sm" 
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
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r overflow-hidden pt-20 lg:translate-x-0 lg:static lg:z-0 shadow-sm",
          settings?.theme === "dark" ? "dark border-gray-800" : "border-gray-200"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Subhan Computer</h2>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="rounded-full h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="px-3 py-2 flex flex-col min-h-[calc(100vh-120px)]">
            {/* Header */}
            <div className={cn(
              "flex items-center px-2 py-3", 
              collapsed ? "justify-center" : "justify-between"
            )}>
              {!collapsed && (
                <span className="font-medium text-blue-600 dark:text-blue-400">Subhan Computer</span>
              )}
            </div>

            {/* Main navigation */}
            <div className="space-y-1 mt-2">
              {mainMenuItems.map((item) => (
                <Tooltip key={item.path} delayDuration={collapsed ? 300 : 1000}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center rounded-lg transition-all duration-200 ease-in-out",
                        collapsed 
                          ? "justify-center p-2.5" 
                          : "px-3 py-2.5 text-sm font-medium",
                        isActive 
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium" 
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60"
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleSidebar();
                        }
                      }}
                    >
                      <span className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                        <span className={cn(
                          "flex items-center justify-center transition-transform", 
                          !collapsed && "mr-3"
                        )}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <div className="flex justify-between items-center w-full">
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <Badge variant="outline" className="ml-2 h-5 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </span>
                    </NavLink>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" sideOffset={10} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 shadow-lg">
                      <span className="flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <Badge variant="outline" className="h-5 bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </span>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
            
            {/* Divider */}
            <div className={cn("my-3 border-t border-gray-200 dark:border-gray-800", collapsed && "mx-2")} />

            {/* Secondary navigation */}
            <div className="space-y-1">
              {secondaryMenuItems.map((item) => (
                <Tooltip key={item.path} delayDuration={collapsed ? 300 : 1000}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center rounded-lg transition-all duration-200 ease-in-out",
                        collapsed 
                          ? "justify-center p-2.5" 
                          : "px-3 py-2.5 text-sm font-medium",
                        isActive 
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium" 
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60"
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
                    <TooltipContent side="right" sideOffset={10} className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 shadow-lg">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-auto pt-4 text-xs text-center text-gray-500 dark:text-gray-500">
              {!collapsed && (
                <div>Subhan Computer © 2023</div>
              )}
            </div>
            
            {/* Expand/collapse button */}
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 group transition-all duration-200",
                  !collapsed && "justify-between"
                )}
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                ) : (
                  <>
                    <span className="text-xs font-medium">Collapse sidebar</span>
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
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
