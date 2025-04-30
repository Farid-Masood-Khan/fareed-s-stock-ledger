
import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useSettings();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={cn(
        "flex h-screen relative overflow-hidden",
        isDarkMode ? "bg-zinc-950 text-zinc-50" : "bg-gray-50 text-gray-900"
      )}
    >
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div
        className={cn(
          "flex flex-col flex-1 w-full transition-all duration-200 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <div className="fixed top-0 left-0 right-0 z-20">
          <Navbar onMenuClick={toggleSidebar} sidebarOpen={isSidebarOpen} />
        </div>

        <main className="flex-1 pt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default Layout;
