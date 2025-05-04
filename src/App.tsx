
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import CustomersPage from "./pages/CustomersPage";
import ShopkeepersPage from "./pages/ShopkeepersPage";
import ReportsPage from "./pages/ReportsPage";
import FinancialPage from "./pages/FinancialPage";
import SettingsPage from "./pages/SettingsPage";
import ExpensesPage from "./pages/ExpensesPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import { StoreProvider } from "./context/StoreContext";
import { SettingsProvider } from "./context/SettingsContext";
import AuthWrapper from "./components/auth/AuthWrapper";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import { LoadingProvider } from "./hooks/use-loading-state";

// Create a new QueryClient with better error handling and security
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors (unauthorized/forbidden)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Retry a maximum of 1 time for other errors
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Global error handler using meta for newer versions of react-query
      meta: {
        onError: (error: any) => {
          console.error("Query error:", error);
          // Avoid logging sensitive information
          const safeErrorMessage = error?.message || "An error occurred";
          
          // Handle unauthorized errors by redirecting to login
          if (error?.response?.status === 401) {
            sessionStorage.removeItem("isLoggedIn");
            window.location.href = "/login";
          }
        }
      }
    },
    mutations: {
      // Use meta for mutation error handling in newer versions
      meta: {
        onError: (error: any) => {
          console.error("Mutation error:", error);
        }
      }
    }
  },
});

// Skip link for keyboard accessibility
const SkipToContent = () => (
  <a href="#main-content" className="skip-link">
    Skip to content
  </a>
);

// Animation wrapper for route transitions
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <ErrorBoundary>
            <LoginPage />
          </ErrorBoundary>
        } />
        <Route path="*" element={
          <AuthWrapper>
            <Layout>
              <Routes>
                <Route path="/" element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                } />
                <Route path="/inventory" element={
                  <ErrorBoundary>
                    <Inventory />
                  </ErrorBoundary>
                } />
                <Route path="/sales" element={
                  <ErrorBoundary>
                    <Sales />
                  </ErrorBoundary>
                } />
                <Route path="/customers" element={
                  <ErrorBoundary>
                    <CustomersPage />
                  </ErrorBoundary>
                } />
                <Route path="/shopkeepers" element={
                  <ErrorBoundary>
                    <ShopkeepersPage />
                  </ErrorBoundary>
                } />
                <Route path="/reports" element={
                  <ErrorBoundary>
                    <ReportsPage />
                  </ErrorBoundary>
                } />
                <Route path="/financial" element={
                  <ErrorBoundary>
                    <FinancialPage />
                  </ErrorBoundary>
                } />
                <Route path="/services" element={
                  <ErrorBoundary>
                    <ServicesPage />
                  </ErrorBoundary>
                } />
                <Route path="/about" element={
                  <ErrorBoundary>
                    <AboutPage />
                  </ErrorBoundary>
                } />
                <Route path="/contact" element={
                  <ErrorBoundary>
                    <ContactPage />
                  </ErrorBoundary>
                } />
                <Route path="/settings" element={
                  <ErrorBoundary>
                    <SettingsPage />
                  </ErrorBoundary>
                } />
                <Route path="/expenses" element={
                  <ErrorBoundary>
                    <ExpensesPage />
                  </ErrorBoundary>
                } />
                <Route path="*" element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                } />
              </Routes>
            </Layout>
          </AuthWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <LoadingProvider>
            <StoreProvider>
              <SkipToContent />
              <Toaster />
              <Sonner position="top-right" closeButton={true} expand={false} richColors />
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </StoreProvider>
          </LoadingProvider>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
