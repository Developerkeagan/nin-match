import {
  LayoutDashboard,
  Users,
  Mail,
  Wallet,
  CalendarDays,
  ClipboardList,
  TrendingUp,
  Settings,
  ChevronUp,
  LogOut,
  CreditCard,
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
import { DashboardSwitcher } from "@/components/dashboard/DashboardSwitcher";

const navItems = [
  { title: "Overview", url: "/executive", icon: LayoutDashboard, desc: "Company snapshot & KPIs" },
  { title: "Workforce", url: "/executive/workforce", icon: Users, desc: "Employees & departments" },
  { title: "Mailing", url: "/executive/mailing", icon: Mail, desc: "Internal comms & memos" },
  { title: "Salary", url: "/executive/salary", icon: Wallet, desc: "Payroll & compensation" },
  { title: "Attendance", url: "/executive/attendance", icon: CalendarDays, desc: "Time, leave & shifts" },
  { title: "Performance", url: "/executive/performance", icon: TrendingUp, desc: "Reviews & goals" },
  { title: "Tasks", url: "/executive/tasks", icon: ClipboardList, desc: "Assignments & projects" },
  { title: "Settings", url: "/executive/settings", icon: Settings, desc: "Workspace preferences" },
];

export function ExecutiveSidebar() {
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
        <a href="/executive" className="font-display text-xl font-bold text-foreground tracking-tight">
          {collapsed ? (
            <span className="text-primary">H</span>
          ) : (
            <>Hira<span className="text-primary">vel</span></>
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
                      end={item.url === "/executive"}
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

      <SidebarFooter className="border-t p-3 space-y-2">
        <DashboardSwitcher />
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
            <DropdownMenuItem onClick={() => navigate("/executive/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Workspace Settings
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
      </SidebarFooter>
    </Sidebar>
  );
}
