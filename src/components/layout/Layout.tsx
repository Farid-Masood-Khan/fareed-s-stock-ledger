
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettings } from "@/context/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  const { theme } = useSettings();

  useEffect(() => {
    // Apply theme class
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, location.pathname]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={isMobile ? "fixed z-50" : ""}
            >
              <Sidebar isOpen={true} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
            sidebarOpen && !isMobile ? "md:ml-64" : ""
          }`}
        >
          {children}
        </motion.main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
