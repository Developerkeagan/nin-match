import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import VerifyOTP from "./pages/VerifyOTP.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import DashboardOverview from "./pages/dashboard/DashboardOverview.tsx";
import PlaceholderPage from "./pages/dashboard/PlaceholderPage.tsx";
import Settings from "./pages/dashboard/Settings.tsx";
import JobManagement from "./pages/dashboard/JobManagement.tsx";
import CreateJob from "./pages/dashboard/CreateJob.tsx";
import Applications from "./pages/dashboard/Applications.tsx";
import Candidates from "./pages/dashboard/Candidates.tsx";
import Promotions from "./pages/dashboard/Promotions.tsx";
import Billing from "./pages/dashboard/Billing.tsx";
import Analytics from "./pages/dashboard/Analytics.tsx";
import Notifications from "./pages/dashboard/Notifications.tsx";
import CompanyProfile from "./pages/dashboard/CompanyProfile.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder.tsx";
import AdminNotify from "./pages/admin/AdminNotify.tsx";
import AdminPartners from "./pages/admin/AdminPartners.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminCompanies from "./pages/admin/AdminCompanies.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import ExecutiveLayout from "./components/executive/ExecutiveLayout.tsx";
import ExecutiveOverview from "./pages/executive/ExecutiveOverview.tsx";
import ExecutivePlaceholder from "./pages/executive/ExecutivePlaceholder.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="applications" element={<Applications />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="billing" element={<Billing />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="notify" element={<AdminNotify />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="promotions" element={<AdminPlaceholder />} />
            <Route path="revenue" element={<AdminPlaceholder />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
