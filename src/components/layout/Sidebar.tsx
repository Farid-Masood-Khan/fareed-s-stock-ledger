import React, { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Barcode, ChartBar, Receipt, Users, Wallet, FolderOpen, Settings, LogOut, FileText, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useNotificationSound } from "@/hooks/use-notification-sound";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    theme
  } = useSettings();
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  const {
    playSound
  } = useNotificationSound();

  const navItems = [{
    name: "Dashboard",
    icon: <Home className="h-5 w-5" />,
    path: "/"
  }, {
    name: "Inventory",
    icon: <Barcode className="h-5 w-5" />,
    path: "/inventory"
  }, {
    name: "Sales",
    icon: <Receipt className="h-5 w-5" />,
    path: "/sales"
  }, {
    name: "Shopkeepers",
    icon: <Users className="h-5 w-5" />,
    path: "/shopkeepers"
  }, {
    name: "Expenses",
    icon: <FileText className="h-5 w-5" />,
    path: "/expenses"
  }, {
    name: "Reports",
    icon: <FolderOpen className="h-5 w-5" />,
    path: "/reports"
  }, {
    name: "Financial",
    icon: <Wallet className="h-5 w-5" />,
    path: "/financial"
  }, {
    name: "Settings",
    icon: <Settings className="h-5 w-5" />,
    path: "/settings"
  }];

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

  return <aside className={`fixed left-0 top-14 h-full z-50 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'} shadow-lg ${isOpen ? "w-64" : "w-0"}`}>
      <div className="h-full flex flex-col overflow-y-auto scrollbar-custom mx-0 px-px py-0">
        <nav className="mt-4 px-2 flex-1">
          <ul className="space-y-1">
            {navItems.map(item => <motion.li key={item.name} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.2
          }} whileHover={{
            scale: 1.02
          }}>
                <NavLink to={item.path} onClick={() => {
              if (isMobile) {
                // Let the Layout component handle closing
              }
            }} className={({
              isActive
            }) => `flex items-center px-4 py-3 text-gray-700 rounded-md transition-all ${isActive ? theme === 'dark' ? "bg-gray-800 text-brand-400 font-semibold" : "bg-brand-100 text-brand-800 font-semibold" : theme === 'dark' ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100"}`}>
                  <span className={`mr-3 ${location.pathname === item.path ? 'text-brand-500' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </NavLink>
              </motion.li>)}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button onClick={handleLogout} className={`flex w-full items-center px-4 py-3 text-gray-700 rounded-md transition-all ${theme === 'dark' ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100"}`}>
            <LogOut className="h-5 w-5 mr-3 text-red-500" />
            <span>Logout</span>
          </button>
          
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Logged in as</p>
            <p className="font-medium">{localStorage.getItem("username") || "User"}</p>
          </div>
        </div>
      </div>
    </aside>;
};

export default Sidebar;
