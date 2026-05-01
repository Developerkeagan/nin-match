import { useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Building2, ChevronsUpDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";

const dashboards = [
  {
    key: "hiring",
    label: "Hiring Dashboard",
    desc: "Jobs, applicants & talent",
    icon: Briefcase,
    path: "/dashboard",
    matcher: (p: string) => p.startsWith("/dashboard"),
  },
  {
    key: "executive",
    label: "Executive Dashboard",
    desc: "Manage your workforce",
    icon: Building2,
    path: "/executive",
    matcher: (p: string) => p.startsWith("/executive"),
  },
];

export function DashboardSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const current = dashboards.find((d) => d.matcher(pathname)) ?? dashboards[0];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 w-full rounded-md p-2 border border-border bg-background hover:bg-accent transition-colors text-left">
          <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon className="h-3.5 w-3.5" />
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate leading-tight">{current.label}</p>
                <p className="text-[10px] text-muted-foreground truncate leading-tight">Switch dashboard</p>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-64">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Switch dashboard
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dashboards.map((d) => {
          const isActive = d.key === current.key;
          const DIcon = d.icon;
          return (
            <DropdownMenuItem
              key={d.key}
              onClick={() => {
                if (isActive) return;
                navigate(d.path);
                toast({ title: `Switched to ${d.label}` });
              }}
              className="gap-3 py-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <DIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{d.label}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">{d.desc}</p>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
