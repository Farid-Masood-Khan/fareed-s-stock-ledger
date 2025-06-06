
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSettings } from "@/context/SettingsContext";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const isMobile = useIsMobile();

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Apply font size and theme data attributes based on settings
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Apply animations class if enabled
    if (settings.animationsEnabled) {
      document.documentElement.classList.add('animations-enabled');
    } else {
      document.documentElement.classList.remove('animations-enabled');
    }
  }, [settings.fontSize, settings.theme, settings.animationsEnabled]);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 5
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };
  
  return (
    <div 
      className={cn(
        "h-screen flex flex-col",
        settings?.theme === "dark" ? "dark" : ""
      )}
      data-theme={settings?.theme}
      aria-live="polite"
    >
      {/* Fixed top navbar with glassmorphism effect */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800/50">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </header>
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden pt-16"> {/* pt-16 to account for fixed navbar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentPath={location.pathname} />
        
        {/* Main content with scroll */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <ScrollArea className="flex-1 scrollbar-custom">
            <AnimatePresence mode="wait">
              <motion.main
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                className={cn(
                  "px-3 py-4 sm:px-4 sm:py-6 md:p-6 lg:p-8 min-h-[calc(100vh-64px)]",
                  "flex-1 w-full mx-auto max-w-7xl"
                )}
                role="main"
                aria-label={`Page: ${location.pathname.substring(1) || 'Dashboard'}`}
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
