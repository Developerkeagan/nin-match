import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Users, Wallet, TrendingUp, CalendarDays, UserPlus, ArrowUpRight, Mail, Briefcase,
  PiggyBank, Receipt, Award, ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ANNUAL_BUDGET = 1_400_000_000;
const monthlyPayroll = 98_400_000;
const monthlyBudget = ANNUAL_BUDGET / 12;
const ytdSpend = monthlyPayroll * 10;
const ytdBudget = monthlyBudget * 10;

const kpis = [
  { label: "Total Employees", value: "248", change: "+12", icon: Users, color: "text-primary", to: "/executive/workforce" },
  { label: "Monthly Payroll", value: "₦98.4M", change: "+3.2%", icon: Wallet, color: "text-blue-600 dark:text-blue-400", to: "/executive/salary" },
  { label: "Avg. Performance", value: "82%", change: "+4%", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", to: "/executive/performance" },
  { label: "Attendance Today", value: "94%", change: "232/248", icon: CalendarDays, color: "text-yellow-600 dark:text-yellow-400", to: "/executive/attendance" },
];

const budgetBreakdown = [
  { label: "Engineering", spent: 38_400_000, budget: 42_000_000 },
  { label: "Sales", spent: 18_900_000, budget: 22_000_000 },
  { label: "Marketing", spent: 11_500_000, budget: 13_000_000 },
  { label: "Operations", spent: 14_200_000, budget: 15_000_000 },
  { label: "Customer Support", spent: 9_800_000, budget: 11_000_000 },
  { label: "Finance", spent: 5_600_000, budget: 6_500_000 },
];

const departments = [
  { name: "Engineering", count: 78, headcount: 80, lead: "Chinedu Okoro" },
  { name: "Sales", count: 42, headcount: 50, lead: "Tolu Adeyinka" },
  { name: "Marketing", count: 28, headcount: 30, lead: "Halima Sani" },
  { name: "Operations", count: 35, headcount: 35, lead: "Kunle Adebanjo" },
  { name: "Customer Support", count: 40, headcount: 45, lead: "Mary Johnson" },
  { name: "Finance", count: 12, headcount: 15, lead: "Sade Olawale" },
];

const recentActivity = [
  { who: "HR", what: "Onboarded 3 new engineers", when: "2 hours ago", icon: UserPlus },
  { who: "Payroll", what: "October salaries processed", when: "Yesterday", icon: Wallet },
  { who: "Comms", what: "Q4 town hall memo sent to all staff", when: "Yesterday", icon: Mail },
  { who: "HR", what: "5 leave requests approved", when: "2 days ago", icon: CalendarDays },
];

const ExecutiveOverview = () => {
  const navigate = useNavigate();
  const ytdPct = (ytdSpend / ytdBudget) * 100;

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Executive Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Snapshot of your workforce, payroll and operations</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-none" onClick={() => navigate("/executive/mailing")}>
            <Mail className="h-4 w-4 mr-2" /> Send Memo
          </Button>
          <Button variant="outline" className="rounded-none" onClick={() => { toast.success("Payroll run started for this month"); navigate("/executive/salary"); }}>
            <Receipt className="h-4 w-4 mr-2" /> Run Payroll
          </Button>
          <Button className="rounded-none" onClick={() => navigate("/executive/workforce")}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <button key={k.label} onClick={() => navigate(k.to)} className="text-left">
            <Card className="rounded-none border hover:border-primary/50 transition-colors h-full">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-none bg-muted ${k.color}`}><k.icon className="h-5 w-5" /></div>
                  <Badge variant="outline" className="rounded-none text-[10px] gap-1">
                    <ArrowUpRight className="h-3 w-3" /> {k.change}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{k.label}</p>
                <p className="text-2xl font-bold font-display text-foreground">{k.value}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {[
          { label: "Annual Budget", value: `₦${(ANNUAL_BUDGET / 1_000_000_000).toFixed(2)}B`, sub: "FY 2026", icon: PiggyBank, color: "text-emerald-600" },
          { label: "Monthly Payroll", value: `₦${(monthlyPayroll / 1_000_000).toFixed(1)}M`, sub: `of ₦${(monthlyBudget / 1_000_000).toFixed(1)}M monthly cap`, icon: Wallet, color: "text-primary" },
          { label: "YTD Spend", value: `₦${(ytdSpend / 1_000_000).toFixed(0)}M`, sub: `${ytdPct.toFixed(0)}% of YTD budget`, icon: Receipt, color: "text-blue-600" },
        ].map((b) => (
          <Card key={b.label} className="rounded-none border">
            <CardContent className="p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{b.label}</p>
                <p className="text-xl font-bold font-display text-foreground mt-1">{b.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{b.sub}</p>
              </div>
              <div className={`p-2 bg-muted rounded-none ${b.color}`}><b.icon className="h-5 w-5" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-none border lg:col-span-2">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" /> Salary Budget by Department
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => navigate("/executive/salary")}>
              View payroll <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {budgetBreakdown.map((d) => {
              const pct = (d.spent / d.budget) * 100;
              const over = pct > 95;
              return (
                <div key={d.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">{d.label}</span>
                    <span className={over ? "text-destructive font-medium" : "text-muted-foreground"}>
                      ₦{(d.spent / 1_000_000).toFixed(1)}M <span className="text-muted-foreground/70">/ ₦{(d.budget / 1_000_000).toFixed(1)}M</span>
                    </span>
                  </div>
                  <Progress value={pct} className={`h-1.5 rounded-none [&>div]:rounded-none ${over ? "[&>div]:bg-destructive" : ""}`} />
                </div>
              );
            })}
            <div className="pt-3 mt-2 border-t flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Total Monthly</span>
              <span className="font-bold text-foreground">
                ₦{(budgetBreakdown.reduce((s, d) => s + d.spent, 0) / 1_000_000).toFixed(1)}M
                <span className="text-muted-foreground font-normal"> / ₦{(budgetBreakdown.reduce((s, d) => s + d.budget, 0) / 1_000_000).toFixed(1)}M</span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-display">Recent Activity</CardTitle>
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => toast.info("Activity feed refreshed")}>Refresh</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-tight">{a.what}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.who} · {a.when}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-none border lg:col-span-2">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Departments
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => navigate("/executive/workforce")}>
              View all <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {departments.map((d) => {
              const pct = (d.count / d.headcount) * 100;
              return (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{d.name}</p>
                      <p className="text-[11px] text-muted-foreground">Lead: {d.lead}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {d.count}<span className="text-muted-foreground">/{d.headcount}</span>
                    </p>
                  </div>
                  <Progress value={pct} className="h-1.5 rounded-none [&>div]:rounded-none" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-none border">
          <CardHeader className="pb-3"><CardTitle className="text-base font-display">Quick Links</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { label: "Workforce", icon: Users, to: "/executive/workforce" },
              { label: "Mailing", icon: Mail, to: "/executive/mailing" },
              { label: "Salary", icon: Wallet, to: "/executive/salary" },
              { label: "Attendance", icon: CalendarDays, to: "/executive/attendance" },
              { label: "Performance", icon: Award, to: "/executive/performance" },
              { label: "Tasks", icon: ClipboardList, to: "/executive/tasks" },
            ].map((l) => (
              <Button key={l.label} variant="outline" className="rounded-none flex-col h-auto py-3 gap-1" onClick={() => navigate(l.to)}>
                <l.icon className="h-4 w-4" />
                <span className="text-[11px]">{l.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveOverview;
