
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  // If user is not logged in and not on login page, redirect to login
  if (!isLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in and on login page, redirect to home
  if (isLoggedIn && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
