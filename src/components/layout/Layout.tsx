
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettings } from "@/context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { theme, animationsEnabled } = useSettings();
  const location = useLocation();

  useEffect(() => {
    // Apply theme class
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      // On desktop, restore sidebar state
      setSidebarOpen(true);
    }
  }, [isMobile, location.pathname]);

  // Handle click outside sidebar to close it on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMobile) return;
      const sidebarElement = document.getElementById('sidebar');
      const targetElement = e.target as HTMLElement;
      
      if (sidebarElement && 
          sidebarOpen && 
          !sidebarElement.contains(targetElement) && 
          !targetElement.closest('button[aria-label="Toggle sidebar"]')) {
        setSidebarOpen(false);
      }
    };

    if (isMobile && sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  const mainContentVariants = {
    expanded: { marginLeft: isMobile ? 0 : "16rem" },
    collapsed: { marginLeft: 0 }
  };

  const pageTransitionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex relative">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              id="sidebar"
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: animationsEnabled ? 0.3 : 0, ease: "easeInOut" }}
              className={isMobile ? "fixed z-50" : ""}
            >
              <Sidebar isOpen={true} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile overlay when sidebar is open */}
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            marginLeft: animationsEnabled ? (sidebarOpen && !isMobile ? "16rem" : 0) : (sidebarOpen && !isMobile ? "16rem" : 0)
          }}
          transition={{ duration: animationsEnabled ? 0.5 : 0 }}
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
            sidebarOpen && !isMobile ? "ml-64" : ""
          } w-full max-w-full`}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname}
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
