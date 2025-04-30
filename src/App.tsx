
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LazyMotion features={domAnimation}>
      <TooltipProvider>
        <SettingsProvider>
          <StoreProvider>
            <Toaster />
            <Sonner position="top-right" closeButton={true} />
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={
                    <AuthWrapper>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/inventory" element={<Inventory />} />
                          <Route path="/sales" element={<Sales />} />
                          <Route path="/customers" element={<CustomersPage />} />
                          <Route path="/shopkeepers" element={<ShopkeepersPage />} />
                          <Route path="/reports" element={<ReportsPage />} />
                          <Route path="/financial" element={<FinancialPage />} />
                          <Route path="/services" element={<ServicesPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/expenses" element={<ExpensesPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Layout>
                    </AuthWrapper>
                  } />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
          </StoreProvider>
        </SettingsProvider>
      </TooltipProvider>
    </LazyMotion>
  </QueryClientProvider>
);

export default App;
