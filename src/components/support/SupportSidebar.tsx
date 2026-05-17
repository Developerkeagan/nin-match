import { MessagesSquare, Archive, User, LogOut, ChevronUp, Headset } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const navItems = [
  { title: "Open Chats", url: "/support", icon: MessagesSquare, desc: "Active customer conversations" },
  { title: "Closed Chats", url: "/support/closed", icon: Archive, desc: "Archived & resolved tickets" },
  { title: "Profile", url: "/support/profile", icon: User, desc: "Account & preferences" },
];

export function SupportSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const handleLogout = () => { toast({ title: "Logged out" }); navigate("/auth"); };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <div className="h-[70px] flex items-center px-4 border-b shrink-0">
        <a href="/support" className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <Headset className="h-5 w-5 text-primary" />
          {!collapsed && <>Hira<span className="text-primary">vel</span></>}
        </a>
      </div>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end
                      className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold">
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
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">CC</div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">Customer Care</p>
                  <p className="text-xs text-muted-foreground truncate">customercare@gmail.com</p>
                </div>
              )}
              {!collapsed && <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/support/profile")}><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
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
