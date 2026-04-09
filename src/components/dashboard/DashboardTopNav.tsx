import { Moon, Sun, User, LogOut, CreditCard, ChevronDown, Bell, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function DashboardTopNav() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    toast.success("You have been logged out.");
    navigate("/auth");
  };

  return (
    <header className="h-[70px] border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 sticky top-0 z-40">
      <SidebarTrigger className="mr-2" />

      <div className="flex items-center gap-2 ml-auto">
        {/* Credits */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-semibold">67</span>
              <span className="text-xs hidden sm:inline">credits</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold">Credit Balance</p>
              <p className="text-2xl font-bold text-primary">67</p>
              <p className="text-xs text-muted-foreground mt-1">67 of 100 credits remaining</p>
            </div>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Today</span><span>-5 credits</span></div>
              <div className="flex justify-between"><span>Yesterday</span><span>-12 credits</span></div>
              <div className="flex justify-between"><span>Apr 7</span><span>-8 credits</span></div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/billing")}>
              <CreditCard className="mr-2 h-4 w-4" /> Buy More Credits
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground relative"
          onClick={() => navigate("/dashboard/notifications")}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* Dark mode toggle */}
        <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="text-muted-foreground">
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:bg-accent p-1.5 pr-3 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                AC
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold">Acme Corp</p>
              <p className="text-xs text-muted-foreground">Business Plan</p>
              <p className="text-xs text-muted-foreground">hello@acmecorp.io</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/billing")}>
              <CreditCard className="mr-2 h-4 w-4" /> Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
