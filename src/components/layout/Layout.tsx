
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSettings } from "@/context/SettingsContext";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { currentUser, logout } = useStore();
  const { toast } = useToast();

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "You've been logged out",
    });
  };

  return (
    <div className={`h-screen flex flex-col ${settings?.theme === "dark" ? "dark" : ""}`}>
      {/* Sidebar for larger screens */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          currentPath={location.pathname}
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Fixed top navbar */}
          <Navbar 
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar} 
          />
          
          {/* Main content with scroll */}
          <main className="flex-1 overflow-auto p-4 md:p-6 pt-20">
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
