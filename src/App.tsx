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
import JobManagement from "./pages/dashboard/JobManagement.tsx";
import CreateJob from "./pages/dashboard/CreateJob.tsx";
import Applications from "./pages/dashboard/Applications.tsx";
import Candidates from "./pages/dashboard/Candidates.tsx";

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
            <Route path="candidates" element={<PlaceholderPage />} />
            <Route path="matches" element={<PlaceholderPage />} />
            <Route path="billing" element={<PlaceholderPage />} />
            <Route path="analytics" element={<PlaceholderPage />} />
            <Route path="notifications" element={<PlaceholderPage />} />
            <Route path="settings" element={<PlaceholderPage />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
