import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  UserSearch,
  Megaphone,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Job Management", url: "/dashboard/jobs", icon: Briefcase },
  { title: "Create Job", url: "/dashboard/jobs/create", icon: PlusCircle },
  { title: "Applications", url: "/dashboard/applications", icon: Users },
  { title: "Talent Pool", url: "/dashboard/candidates", icon: UserSearch },
  { title: "Promotions", url: "/dashboard/promotions", icon: Megaphone },
  { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({ title: "Logged out", description: "You have been logged out." });
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <div className="h-[70px] flex items-center px-4 border-b shrink-0">
        <a href="/dashboard" className="font-display text-xl font-bold text-foreground tracking-tight">
          {collapsed ? (
            <span className="text-primary">N</span>
          ) : (
            <>NIN<span className="text-primary">Jobs</span></>
          )}
        </a>
      </div>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full rounded-md p-2 hover:bg-accent transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                AC
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">Acme Corp</p>
                  <p className="text-xs text-muted-foreground truncate">hello@acmecorp.io</p>
                </div>
              )}
              {!collapsed && <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <Settings className="mr-2 h-4 w-4" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <Settings className="mr-2 h-4 w-4" /> Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/billing")}>
              <CreditCard className="mr-2 h-4 w-4" /> Subscription Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
