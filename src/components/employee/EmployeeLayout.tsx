import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Bell, LogOut, ChevronDown, BadgeCheck } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { EmployeeSidebar } from "./EmployeeSidebar";
import { EmployeeSupportChat } from "./EmployeeSupportChat";

const EmployeeLayout = () => {
  const [dark, setDark] = useState(() => typeof window !== "undefined" && document.documentElement.classList.contains("dark"));
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <EmployeeSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-[70px] border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="mr-2" />
              <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
                <BadgeCheck className="h-3 w-3" /> Employee
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground relative" onClick={() => navigate("/employee/notifications")}>
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="text-muted-foreground">
                {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full hover:bg-accent p-1.5 pr-3 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">EM</div>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-semibold">Employee</p>
                    <p className="text-xs text-muted-foreground">Acme Corp · Engineering</p>
                    <p className="text-xs text-muted-foreground">employee@gmail.com</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/employee/profile")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { toast.success("Logged out"); navigate("/auth"); }} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 pt-4 bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
      <EmployeeSupportChat />
    </SidebarProvider>
  );
};

export default EmployeeLayout;
