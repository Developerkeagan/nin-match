import { SidebarProvider } from "@/components/ui/sidebar";
import { ExecutiveSidebar } from "./ExecutiveSidebar";
import { DashboardTopNav } from "@/components/dashboard/DashboardTopNav";
import { Outlet } from "react-router-dom";

const ExecutiveLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ExecutiveSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopNav />
          <main className="flex-1 overflow-y-auto p-6 pt-4 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ExecutiveLayout;
