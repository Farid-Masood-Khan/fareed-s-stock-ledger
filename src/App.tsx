
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import ShopkeepersPage from "./pages/ShopkeepersPage";
import ReportsPage from "./pages/ReportsPage";
import FinancialPage from "./pages/FinancialPage";
import SettingsPage from "./pages/SettingsPage";
import ExpensesPage from "./pages/ExpensesPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { StoreProvider } from "./context/StoreContext";
import { SettingsProvider } from "./context/SettingsContext";
import AuthWrapper from "./components/auth/AuthWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SettingsProvider>
        <StoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={
                <AuthWrapper>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/shopkeepers" element={<ShopkeepersPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/financial" element={<FinancialPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/expenses" element={<ExpensesPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </AuthWrapper>
              } />
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
