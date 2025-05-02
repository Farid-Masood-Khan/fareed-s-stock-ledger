
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSettings } from "@/context/SettingsContext";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    handleRouteChange();
    
    // Listen for route changes
    return () => {
      handleRouteChange();
    };
  }, [location.pathname]);
  
  // Handle window resize to auto-close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };
  
  return (
    <div className={`h-screen flex flex-col ${settings?.theme === "dark" ? "dark" : ""}`}>
      {/* Fixed top navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm border-b">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden pt-16"> {/* Add pt-16 to account for fixed navbar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={location.pathname} />
        
        {/* Main content with scroll */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
          <ScrollArea className="flex-1">
            <AnimatePresence mode="wait">
              <motion.main
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={cn(
                  "px-4 py-6 md:p-6 lg:p-8 min-h-[calc(100vh-64px)]",
                  "flex-1 w-full mx-auto max-w-7xl"
                )}
              >
                {children}
              </motion.main>
            </AnimatePresence>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Layout;
