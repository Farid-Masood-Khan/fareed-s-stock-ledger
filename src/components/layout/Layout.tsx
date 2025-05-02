
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSettings } from "@/context/SettingsContext";

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
          <main className="flex-1 overflow-auto p-4 md:p-6 scrollbar-custom">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
