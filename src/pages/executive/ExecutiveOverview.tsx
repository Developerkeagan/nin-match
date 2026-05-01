import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, Wallet, TrendingUp, CalendarDays, UserPlus, ArrowUpRight, Mail, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const kpis = [
  { label: "Total Employees", value: "248", change: "+12", icon: Users, color: "text-primary" },
  { label: "Monthly Payroll", value: "₦98.4M", change: "+3.2%", icon: Wallet, color: "text-blue-600 dark:text-blue-400" },
  { label: "Avg. Performance", value: "82%", change: "+4%", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Attendance Today", value: "94%", change: "232/248", icon: CalendarDays, color: "text-yellow-600 dark:text-yellow-400" },
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

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Executive Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Snapshot of your workforce and operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none" onClick={() => navigate("/executive/mailing")}>
            <Mail className="h-4 w-4 mr-2" /> Send Memo
          </Button>
          <Button className="rounded-none" onClick={() => navigate("/executive/workforce")}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="rounded-none border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-none bg-muted ${k.color}`}>
                  <k.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="rounded-none text-[10px] gap-1">
                  <ArrowUpRight className="h-3 w-3" /> {k.change}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">{k.label}</p>
              <p className="text-2xl font-bold font-display text-foreground">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Departments */}
        <Card className="rounded-none border lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Departments
            </CardTitle>
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

        {/* Activity */}
        <Card className="rounded-none border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Recent Activity</CardTitle>
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
    </div>
  );
};

export default ExecutiveOverview;
