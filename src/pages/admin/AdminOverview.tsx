import {
  DollarSign,
  Briefcase,
  BriefcaseBusiness,
  Users,
  Building2,
  UserCheck,
  CreditCard,
  Handshake,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Revenue",
    value: "₦12,450,000",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    title: "All Jobs",
    value: "1,284",
    subtitle: "142 this month",
    change: "+12%",
    trend: "up",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    title: "Active Jobs",
    value: "847",
    change: "+5.3%",
    trend: "up",
    icon: BriefcaseBusiness,
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  {
    title: "Candidates Matched",
    value: "3,621",
    subtitle: "489 this month",
    change: "+22%",
    trend: "up",
    icon: UserCheck,
    color: "text-cyan-600",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Companies",
    value: "256",
    change: "+8%",
    trend: "up",
    icon: Building2,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    title: "Users",
    value: "15,842",
    change: "+14%",
    trend: "up",
    icon: Users,
    color: "text-pink-600",
    bg: "bg-pink-500/10",
  },
  {
    title: "Active Payment Plans",
    value: "198",
    change: "-2.1%",
    trend: "down",
    icon: CreditCard,
    color: "text-orange-600",
    bg: "bg-orange-500/10",
  },
  {
    title: "Partners",
    value: "34",
    change: "+6%",
    trend: "up",
    icon: Handshake,
    color: "text-teal-600",
    bg: "bg-teal-500/10",
  },
  {
    title: "Hires Made",
    value: "2,103",
    subtitle: "287 this month",
    change: "+19%",
    trend: "up",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
];

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`${stat.bg} ${stat.color} p-2.5 rounded-lg`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={`text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-destructive"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
