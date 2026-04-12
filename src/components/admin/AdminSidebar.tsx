import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  Bell,
  Settings,
  Megaphone,
  DollarSign,
  ChevronUp,
  LogOut,
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

const navItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard, desc: "Platform analytics at a glance" },
  { title: "Users", url: "/admin/users", icon: Users, desc: "Manage registered users" },
  { title: "Companies", url: "/admin/companies", icon: Building2, desc: "View & manage companies" },
  { title: "Partners", url: "/admin/partners", icon: Handshake, desc: "Partner management" },
  { title: "Notify", url: "/admin/notify", icon: Bell, desc: "Send platform notifications" },
  { title: "Admin Settings", url: "/admin/settings", icon: Settings, desc: "System configuration" },
  { title: "Promotion Plans", url: "/admin/promotions", icon: Megaphone, desc: "Manage promotion tiers" },
  { title: "Revenue Overview", url: "/admin/revenue", icon: DollarSign, desc: "Financial reports" },
];

export function AdminSidebar() {
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
        <a href="/admin" className="font-display text-xl font-bold text-foreground tracking-tight">
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
                      end={item.url === "/admin"}
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
              <div className="w-8 h-8 rounded-full bg-destructive/15 text-destructive flex items-center justify-center text-xs font-bold shrink-0">
                AD
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">Admin</p>
                  <p className="text-xs text-muted-foreground truncate">admin@gmail.com</p>
                </div>
              )}
              {!collapsed && <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Admin Settings
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
