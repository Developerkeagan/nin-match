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
import { useNavigate } from "react-router-dom";
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
import { DashboardSwitcher } from "./DashboardSwitcher";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, desc: "Overview & quick stats" },
  { title: "Job Management", url: "/dashboard/jobs", icon: Briefcase, desc: "View & manage your jobs" },
  { title: "Create Job", url: "/dashboard/jobs/create", icon: PlusCircle, desc: "Post a new job listing" },
  { title: "Applications", url: "/dashboard/applications", icon: Users, desc: "Review applications" },
  { title: "Talent Pool", url: "/dashboard/candidates", icon: UserSearch, desc: "Discover matched talent" },
  { title: "Promotions", url: "/dashboard/promotions", icon: Megaphone, desc: "Boost your job visibility" },
  { title: "Billing", url: "/dashboard/billing", icon: CreditCard, desc: "Plans, credits & invoices" },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, desc: "Performance insights" },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell, desc: "Stay updated on activity" },
  { title: "Settings", url: "/dashboard/settings", icon: Settings, desc: "Account preferences" },
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
            <span className="text-primary">H</span>
          ) : (
            <>Hire<span className="text-primary">On</span></>
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
                      className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && (
                        <div className="min-w-0">
                          <span className="block leading-tight">{item.title}</span>
                          <span className="block text-[11px] text-muted-foreground/60 leading-tight mt-0.5 font-normal">{item.desc}</span>
                        </div>
                      )}
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
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
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
