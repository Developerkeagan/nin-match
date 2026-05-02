import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  DollarSign,
  Users,
  Coins,
  Megaphone,
  Crown,
  Building2,
  Wallet,
} from "lucide-react";

/* ──────────── Mock data ──────────── */
const monthly = [
  { m: "Jan", subs: 4200000, credits: 1800000, ads: 900000 },
  { m: "Feb", subs: 4800000, credits: 2100000, ads: 1100000 },
  { m: "Mar", subs: 5300000, credits: 2400000, ads: 1500000 },
  { m: "Apr", subs: 5800000, credits: 2900000, ads: 1700000 },
  { m: "May", subs: 6500000, credits: 3300000, ads: 2100000 },
  { m: "Jun", subs: 7100000, credits: 3700000, ads: 2400000 },
  { m: "Jul", subs: 7800000, credits: 4200000, ads: 2900000 },
  { m: "Aug", subs: 8400000, credits: 4500000, ads: 3200000 },
  { m: "Sep", subs: 9100000, credits: 4900000, ads: 3500000 },
  { m: "Oct", subs: 9700000, credits: 5300000, ads: 3800000 },
  { m: "Nov", subs: 10400000, credits: 5800000, ads: 4100000 },
  { m: "Dec", subs: 11200000, credits: 6400000, ads: 4500000 },
];

const planMix = [
  { name: "Starter", value: 18 },
  { name: "Business", value: 56 },
  { name: "Enterprise", value: 26 },
];

const planColors = ["hsl(var(--muted-foreground))", "hsl(var(--primary))", "hsl(var(--foreground))"];

const topCompanies = [
  { name: "Andela", plan: "Enterprise", spend: 4_200_000, growth: 12 },
  { name: "Flutterwave", plan: "Enterprise", spend: 3_850_000, growth: 8 },
  { name: "Paystack", plan: "Business", spend: 2_140_000, growth: 22 },
  { name: "Interswitch", plan: "Business", spend: 1_980_000, growth: -3 },
  { name: "MTN Group", plan: "Enterprise", spend: 1_640_000, growth: 5 },
  { name: "Microsoft NG", plan: "Business", spend: 1_280_000, growth: 18 },
];

const recentTx = [
  { id: "TX-9421", company: "Andela", type: "Subscription", amount: 450000, date: "2026-04-28", status: "paid" },
  { id: "TX-9420", company: "Paystack", type: "Credit Pack — Surge", amount: 60000, date: "2026-04-28", status: "paid" },
  { id: "TX-9419", company: "Flutterwave", type: "Promotion Boost", amount: 22500, date: "2026-04-27", status: "paid" },
  { id: "TX-9418", company: "Interswitch", type: "Subscription", amount: 350000, date: "2026-04-27", status: "refund" },
  { id: "TX-9417", company: "MTN Group", type: "Credit Pack — Empire", amount: 180000, date: "2026-04-26", status: "paid" },
  { id: "TX-9416", company: "Dangote Tech", type: "Subscription", amount: 45000, date: "2026-04-26", status: "pending" },
];

const fmt = (n: number) => `₦${(n / 1_000_000).toFixed(1)}M`;
const fmtFull = (n: number) => `₦${n.toLocaleString()}`;

/* ──────────── Page ──────────── */
const AdminRevenue = () => {
  const [range, setRange] = useState("ytd");

  const totals = useMemo(() => {
    const subs = monthly.reduce((s, m) => s + m.subs, 0);
    const credits = monthly.reduce((s, m) => s + m.credits, 0);
    const ads = monthly.reduce((s, m) => s + m.ads, 0);
    const total = subs + credits + ads;
    return { subs, credits, ads, total };
  }, []);

  const breakdown = [
    { name: "Subscriptions", value: totals.subs, color: "hsl(var(--primary))" },
    { name: "Credit Packs", value: totals.credits, color: "hsl(var(--foreground))" },
    { name: "Ad Boosts", value: totals.ads, color: "hsl(var(--muted-foreground))" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue Overview</h1>
          <p className="text-sm text-muted-foreground">
            Live financial pulse across subscriptions, credits and promotions.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="qtd">Quarter to date</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi
          icon={DollarSign}
          label="Total revenue"
          value={fmt(totals.total)}
          delta={18.2}
          tone="primary"
        />
        <Kpi
          icon={Wallet}
          label="Subscriptions"
          value={fmt(totals.subs)}
          delta={12.4}
        />
        <Kpi
          icon={Coins}
          label="Credit packs"
          value={fmt(totals.credits)}
          delta={24.1}
        />
        <Kpi
          icon={Megaphone}
          label="Promotion boosts"
          value={fmt(totals.ads)}
          delta={31.7}
        />
      </div>

      {/* Trend + breakdown */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Revenue trend</CardTitle>
              <Badge variant="secondary" className="text-[11px]">12-month view</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v / 1_000_000}M`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }}
                    formatter={(v: number) => fmtFull(v)}
                  />
                  <Area type="monotone" dataKey="subs" stroke="hsl(var(--primary))" fill="url(#g1)" name="Subscriptions" />
                  <Area type="monotone" dataKey="credits" stroke="hsl(var(--foreground))" fill="url(#g2)" name="Credits" />
                  <Area type="monotone" dataKey="ads" stroke="hsl(var(--muted-foreground))" fillOpacity={0.1} name="Promotions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Revenue mix</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {breakdown.map((b) => <Cell key={b.name} fill={b.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtFull(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {breakdown.map((b) => {
                const pct = (b.value / totals.total) * 100;
                return (
                  <div key={b.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: b.color }} />
                    <span className="flex-1">{b.name}</span>
                    <span className="font-semibold">{pct.toFixed(1)}%</span>
                    <span className="text-muted-foreground w-16 text-right">{fmt(b.value)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans + top companies */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Plan distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={planMix}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {planMix.map((_, i) => <Cell key={i} fill={planColors[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">% of paying companies on each plan</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Top spending companies</CardTitle>
              <Badge variant="secondary" className="text-[11px]"><Crown className="h-3 w-3" /> YTD</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCompanies.map(c => (
                  <TableRow key={c.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <Building2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{c.plan}</Badge></TableCell>
                    <TableCell className="text-right font-semibold">{fmtFull(c.spend)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${c.growth >= 0 ? "text-primary" : "text-destructive"}`}>
                        {c.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(c.growth)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Tx + funnel */}
      <Tabs defaultValue="tx">
        <TabsList>
          <TabsTrigger value="tx">Recent transactions</TabsTrigger>
          <TabsTrigger value="health">Account health</TabsTrigger>
        </TabsList>
        <TabsContent value="tx" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tx ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTx.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="font-medium">{t.company}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.type}</TableCell>
                      <TableCell className="text-sm">{t.date}</TableCell>
                      <TableCell className="text-right font-semibold">{fmtFull(t.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={t.status === "paid" ? "default" : t.status === "pending" ? "secondary" : "destructive"}
                          className="capitalize text-[10px]"
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <HealthCard label="MRR" value="₦12.4M" sub="Monthly recurring" />
            <HealthCard label="ARPU" value="₦48,200" sub="Per paying account" />
            <HealthCard label="Churn rate" value="2.1%" sub="Last 30 days" />
            <HealthCard label="LTV" value="₦586k" sub="Avg customer lifetime" />
            <HealthCard label="Active payers" value="2,431" sub="Companies billing" />
            <HealthCard label="Refunds" value="₦210k" sub="Last 30 days" />
            <HealthCard label="Failed charges" value="38" sub="Awaiting retry" />
            <HealthCard label="Outstanding" value="₦1.8M" sub="Receivables" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ──────────── helpers ──────────── */
function Kpi({
  icon: Icon, label, value, delta, tone,
}: { icon: any; label: string; value: string; delta: number; tone?: "primary" }) {
  const positive = delta >= 0;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`w-9 h-9 rounded-md flex items-center justify-center ${tone === "primary" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
            <Icon className="h-4 w-4" />
          </div>
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${positive ? "text-primary" : "text-destructive"}`}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold leading-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

function HealthCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-display text-xl font-bold mt-1">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default AdminRevenue;
