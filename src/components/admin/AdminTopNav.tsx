import { Moon, Sun, LogOut, ChevronDown, Shield } from "lucide-react";
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

export function AdminTopNav() {
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
      <div className="flex items-center gap-3">
        <SidebarTrigger className="mr-2" />
        <Badge variant="outline" className="gap-1.5 border-destructive/30 text-destructive">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="text-muted-foreground">
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:bg-accent p-1.5 pr-3 transition-colors">
              <div className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold">
                AD
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-muted-foreground">admin@gmail.com</p>
            </div>
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
