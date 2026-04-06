import { useState } from "react";
import {
  CreditCard,
  Eye,
  Users,
  UserCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  Filter,
  Sparkles,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";

// --- Mock Data ---
const kpiData = [
  { label: "Credits Spent", value: "2,480", trend: 12.5, icon: CreditCard, up: true },
  { label: "Total Views", value: "18,320", trend: 8.3, icon: Eye, up: true },
  { label: "Users Referred", value: "1,245", trend: -2.1, icon: Users, up: false },
  { label: "Hires Made", value: "38", trend: 15.0, icon: UserCheck, up: true },
  { label: "Conversion Rate", value: "3.05%", trend: 4.2, icon: TrendingUp, up: true },
];

const creditUsageData = [
  { day: "Mon", credits: 120 },
  { day: "Tue", credits: 180 },
  { day: "Wed", credits: 90 },
  { day: "Thu", credits: 250 },
  { day: "Fri", credits: 200 },
  { day: "Sat", credits: 310 },
  { day: "Sun", credits: 150 },
];

const promoPerformanceData = [
  { campaign: "Spring Hiring", views: 4200 },
  { campaign: "Dev Roles Q2", views: 3100 },
  { campaign: "Design Sprint", views: 2800 },
  { campaign: "Backend Surge", views: 5100 },
  { campaign: "Intern Drive", views: 1900 },
];

const trafficSourceData = [
  { name: "Twitter", value: 42, fill: "hsl(var(--primary))" },
  { name: "Instagram", value: 35, fill: "hsl(var(--accent))" },
  { name: "Telegram", value: 23, fill: "hsl(var(--muted-foreground))" },
];

const funnelData = [
  { name: "Views", value: 18320, fill: "hsl(var(--primary) / 0.3)" },
  { name: "Clicks", value: 6540, fill: "hsl(var(--primary) / 0.5)" },
  { name: "Applications", value: 1245, fill: "hsl(var(--primary) / 0.7)" },
  { name: "Hires", value: 38, fill: "hsl(var(--primary))" },
];

const campaignTableData = [
  { name: "Spring Hiring", credits: 480, views: 4200, clicks: 1680, referrals: 320, hires: 12, rate: "3.75%" },
  { name: "Dev Roles Q2", credits: 350, views: 3100, clicks: 1240, referrals: 210, hires: 8, rate: "3.81%" },
  { name: "Design Sprint", credits: 290, views: 2800, clicks: 980, referrals: 180, hires: 5, rate: "2.78%" },
  { name: "Backend Surge", credits: 620, views: 5100, clicks: 2040, referrals: 390, hires: 10, rate: "2.56%" },
  { name: "Intern Drive", credits: 180, views: 1900, clicks: 600, referrals: 145, hires: 3, rate: "2.07%" },
];

const insights = [
  "Your Instagram campaigns perform 35% better than Twitter on average.",
  "Weekend promotions generate 2x more clicks — consider scheduling accordingly.",
  "Backend Surge had the highest views but lower conversion — refine targeting.",
];

const creditChartConfig: ChartConfig = {
  credits: { label: "Credits", color: "hsl(var(--primary))" },
};

const promoChartConfig: ChartConfig = {
  views: { label: "Views", color: "hsl(var(--primary))" },
};

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [campaignFilter, setCampaignFilter] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your performance and growth</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-[170px] h-9 text-sm">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaignTableData.map((c) => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.label} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-1.5 py-0 font-medium ${
                    kpi.up
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {kpi.up ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                  {Math.abs(kpi.trend)}%
                </Badge>
              </div>
              <p className="text-xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Credit Usage Line Chart */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Credit Usage</CardTitle>
            <CardDescription className="text-xs">Credits spent over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={creditChartConfig} className="h-[250px] w-full">
              <LineChart data={creditUsageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="credits"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Promotion Performance Bar Chart */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Promotion Performance</CardTitle>
            <CardDescription className="text-xs">Views by campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={promoChartConfig} className="h-[250px] w-full">
              <BarChart data={promoPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                <XAxis dataKey="campaign" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Traffic Source Pie */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Traffic Sources</CardTitle>
            <CardDescription className="text-xs">Where views come from</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="h-[250px] w-full max-w-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {trafficSourceData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hiring Funnel */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Hiring Funnel</CardTitle>
            <CardDescription className="text-xs">From views to hires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 py-4">
              {funnelData.map((stage, i) => {
                const maxVal = funnelData[0].value;
                const pct = (stage.value / maxVal) * 100;
                return (
                  <div key={stage.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{stage.name}</span>
                      <span className="text-muted-foreground">{stage.value.toLocaleString()}</span>
                    </div>
                    <div className="h-8 w-full rounded bg-muted/50 overflow-hidden">
                      <div
                        className="h-full rounded bg-primary transition-all duration-700"
                        style={{ width: `${pct}%`, opacity: 0.4 + i * 0.2 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Detailed Campaign Table */}
      <Card className="border-border/60">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Campaign Breakdown</CardTitle>
            <CardDescription className="text-xs">Detailed performance per campaign</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Campaign</TableHead>
                  <TableHead className="text-xs text-right">Credits</TableHead>
                  <TableHead className="text-xs text-right">Views</TableHead>
                  <TableHead className="text-xs text-right">Clicks</TableHead>
                  <TableHead className="text-xs text-right">Referrals</TableHead>
                  <TableHead className="text-xs text-right">Hires</TableHead>
                  <TableHead className="text-xs text-right">CVR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignTableData.map((row) => (
                  <TableRow key={row.name} className="cursor-pointer">
                    <TableCell className="font-medium text-sm">{row.name}</TableCell>
                    <TableCell className="text-right text-sm">{row.credits}</TableCell>
                    <TableCell className="text-right text-sm">{row.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{row.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm">{row.referrals}</TableCell>
                    <TableCell className="text-right text-sm">{row.hires}</TableCell>
                    <TableCell className="text-right text-sm">{row.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
