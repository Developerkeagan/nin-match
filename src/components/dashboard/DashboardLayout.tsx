import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopNav } from "./DashboardTopNav";
import { FloatingAIChat } from "./FloatingAIChat";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopNav />
          <main className="flex-1 overflow-y-auto p-6 pt-4 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
      <FloatingAIChat />
    </SidebarProvider>
  );
};

export default DashboardLayout;
