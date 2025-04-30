
import React, { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Barcode, ChartBar, Receipt, Users, Wallet, FolderOpen, Settings, LogOut, FileText, Home, Laptop, Phone, Info, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSettings();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { playSound } = useNotificationSound();
  const username = localStorage.getItem("username") || "User";

  const navItems = [
    {
      name: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/",
      badge: null
    }, 
    {
      name: "Inventory",
      icon: <Barcode className="h-5 w-5" />,
      path: "/inventory",
      badge: null
    }, 
    {
      name: "Sales",
      icon: <Receipt className="h-5 w-5" />,
      path: "/sales",
      badge: {
        text: "New",
        variant: "success" as const
      }
    }, 
    {
      name: "Shopkeepers",
      icon: <Users className="h-5 w-5" />,
      path: "/shopkeepers",
      badge: null
    }, 
    {
      name: "Expenses",
      icon: <FileText className="h-5 w-5" />,
      path: "/expenses",
      badge: null
    }, 
    {
      name: "Reports",
      icon: <FolderOpen className="h-5 w-5" />,
      path: "/reports",
      badge: null
    }, 
    {
      name: "Financial",
      icon: <Wallet className="h-5 w-5" />,
      path: "/financial",
      badge: null
    }, 
    {
      name: "Services",
      icon: <Laptop className="h-5 w-5" />,
      path: "/services",
      badge: null
    },
    {
      name: "Contact",
      icon: <Phone className="h-5 w-5" />,
      path: "/contact",
      badge: null
    }, 
    {
      name: "About",
      icon: <Info className="h-5 w-5" />,
      path: "/about",
      badge: null
    }, 
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
      badge: null
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    playSound('alert');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate("/login");
  };

  useEffect(() => {
    if (isMobile && isOpen) {
      const currentPath = location.pathname;
    }
  }, [location, isMobile, isOpen]);

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <aside className={`fixed left-0 top-14 h-full transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-800' 
        : 'bg-gradient-to-b from-white to-gray-50 border-r border-gray-200'
      } shadow-lg ${isOpen ? "w-64" : "w-0"}`}>
      <div className="h-full flex flex-col overflow-y-auto scrollbar-custom">
        {/* User profile at top */}
        <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50/80'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-brand-100'} text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-brand-700'}`}>
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium leading-none">{username}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
        
        {/* Navigation menu */}
        <nav className="mt-4 px-2 flex-1">
          <motion.ul 
            initial="closed"
            animate="open"
            variants={{
              open: {
                transition: { staggerChildren: 0.07, delayChildren: 0.2 }
              },
              closed: {
                transition: { staggerChildren: 0.05, staggerDirection: -1 }
              }
            }}
            className="space-y-1"
          >
            {navItems.map((item, index) => (
              <motion.li 
                key={item.name} 
                variants={sidebarVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink 
                  to={item.path} 
                  className={({isActive}) => `
                    flex items-center justify-between px-4 py-3 rounded-md transition-all
                    ${isActive 
                      ? theme === 'dark' 
                        ? "bg-gray-800 text-brand-400 font-semibold" 
                        : "bg-brand-50 text-brand-800 font-semibold border border-brand-200" 
                      : theme === 'dark' 
                        ? "hover:bg-gray-800 text-gray-300" 
                        : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <div className="flex items-center">
                    <span className={`mr-3 ${location.pathname === item.path ? 'text-brand-500' : ''}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  
                  {item.badge && (
                    <Badge 
                      variant={item.badge.variant === "success" ? "default" : "outline"} 
                      className={
                        item.badge.variant === "success" 
                          ? "bg-green-500 hover:bg-green-600 text-xs" 
                          : "text-xs"
                      }
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* Security alert */}
        <div className={`mx-3 mb-4 p-3 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-brand-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-brand-200'}`}>
          <div className="flex items-start space-x-3">
            <ShieldAlert className={`h-5 w-5 ${theme === 'dark' ? 'text-brand-400' : 'text-brand-600'} mt-0.5`} />
            <div>
              <p className="text-sm font-medium">Daily Backup</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                Last backup: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <motion.button 
            onClick={handleLogout} 
            className={`flex w-full items-center px-4 py-3 text-gray-700 rounded-md transition-all ${theme === 'dark' ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100"}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
