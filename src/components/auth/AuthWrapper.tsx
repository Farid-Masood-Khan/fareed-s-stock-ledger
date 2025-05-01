
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/hooks/use-toast";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useStore();
  const { toast } = useToast();
  
  // Initialize authentication when component mounts
  useEffect(() => {
    // Since initAuth doesn't exist in StoreContext, we'll just check authentication status here
    // You can add further initialization logic if needed
  }, []);

  // If authentication is in progress, show loading indicator
  if (location.pathname !== "/login" && currentUser === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Authenticating...</span>
      </div>
    );
  }

  // If user is not logged in and not on login page, redirect to login
  if (!currentUser && location.pathname !== "/login") {
    // Show toast notification only when redirecting from a protected page
    if (location.pathname !== "/") {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // If user is logged in and on login page, redirect to home
  if (currentUser && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
