import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import {
  Eye, MousePointerClick, Users, Coins, TrendingUp, Play, Pause, Twitter, Instagram, Send,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface Campaign {
  id: string;
  name: string;
  platforms: ("twitter" | "instagram" | "telegram")[];
  status: "active" | "paused" | "completed";
  startedAt: string;
  duration: string;
  credits: number;
  impressions: number;
  clicks: number;
  applications: number;
  daily: { day: string; impressions: number; clicks: number }[];
}

const mkDaily = (base: number) =>
  Array.from({ length: 7 }, (_, i) => ({
    day: `D${i + 1}`,
    impressions: Math.round(base * (0.6 + Math.random() * 0.8)),
    clicks: Math.round(base * 0.06 * (0.5 + Math.random())),
  }));

const seedCampaigns: Campaign[] = [
  { id: "p1", name: "Senior Backend Engineer — Boost", platforms: ["twitter", "instagram"], status: "active", startedAt: "12 Apr 2026", duration: "14 days", credits: 210, impressions: 48210, clicks: 3120, applications: 214, daily: mkDaily(7000) },
  { id: "p2", name: "Product Designer Hiring Push", platforms: ["instagram", "telegram"], status: "active", startedAt: "20 Apr 2026", duration: "7 days", credits: 120, impressions: 21980, clicks: 1490, applications: 96, daily: mkDaily(3100) },
  { id: "p3", name: "Graduate Trainee Campaign", platforms: ["twitter", "instagram", "telegram"], status: "paused", startedAt: "02 Apr 2026", duration: "30 days", credits: 540, impressions: 96450, clicks: 5310, applications: 402, daily: mkDaily(13000) },
  { id: "p4", name: "Customer Support Roles — Lagos", platforms: ["telegram"], status: "completed", startedAt: "01 Mar 2026", duration: "14 days", credits: 90, impressions: 15320, clicks: 810, applications: 58, daily: mkDaily(2200) },
  { id: "p5", name: "Brand Awareness — Hiring at Scale", platforms: ["twitter"], status: "completed", startedAt: "08 Feb 2026", duration: "30 days", credits: 300, impressions: 74110, clicks: 3980, applications: 141, daily: mkDaily(10500) },
];

const platformIcon = {
  twitter: <Twitter className="h-3 w-3" />,
  instagram: <Instagram className="h-3 w-3" />,
  telegram: <Send className="h-3 w-3" />,
};

const statusStyle: Record<Campaign["status"], string> = {
  active: "border-primary/40 text-primary",
  paused: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  completed: "border-border text-muted-foreground",
};

const fmt = (n: number) => n.toLocaleString();

const PromotionsAnalytics = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(seedCampaigns);
  const [filter, setFilter] = useState<"all" | Campaign["status"]>("all");
  const [selected, setSelected] = useState<Campaign | null>(null);

  const totals = useMemo(() => {
    const impressions = campaigns.reduce((s, c) => s + c.impressions, 0);
    const clicks = campaigns.reduce((s, c) => s + c.clicks, 0);
    const applications = campaigns.reduce((s, c) => s + c.applications, 0);
    const credits = campaigns.reduce((s, c) => s + c.credits, 0);
    return { impressions, clicks, applications, credits, ctr: clicks ? (clicks / impressions) * 100 : 0 };
  }, [campaigns]);

  const trend = useMemo(() => {
    const days = campaigns[0]?.daily.map((_, i) => ({
      day: `Day ${i + 1}`,
      impressions: campaigns.reduce((s, c) => s + (c.daily[i]?.impressions ?? 0), 0),
      clicks: campaigns.reduce((s, c) => s + (c.daily[i]?.clicks ?? 0), 0),
    }));
    return days ?? [];
  }, [campaigns]);

  const list = campaigns.filter((c) => filter === "all" || c.status === filter);

  const toggleStatus = (c: Campaign) => {
    const next = c.status === "active" ? "paused" : "active";
    setCampaigns((p) => p.map((x) => (x.id === c.id ? { ...x, status: next } : x)));
    setSelected((s) => (s && s.id === c.id ? { ...s, status: next } : s));
    toast({ title: next === "active" ? "Campaign resumed" : "Campaign paused", description: c.name });
  };

  const kpis = [
    { label: "Total impressions", value: fmt(totals.impressions), icon: Eye },
    { label: "Total clicks", value: fmt(totals.clicks), icon: MousePointerClick },
    { label: "Applications driven", value: fmt(totals.applications), icon: Users },
    { label: "Credits spent", value: fmt(totals.credits), icon: Coins },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <k.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Turn-up across all campaigns
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Average CTR {totals.ctr.toFixed(2)}% · {campaigns.filter((c) => c.status === "active").length} running now
          </p>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Area type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" fill="url(#impGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "active", "paused", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium border capitalize transition-colors ${
              filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f} ({f === "all" ? campaigns.length : campaigns.filter((c) => c.status === f).length})
          </button>
        ))}
      </div>

      {/* Campaign list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {list.map((c) => {
          const ctr = (c.clicks / c.impressions) * 100;
          return (
            <Card key={c.id} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Started {c.startedAt} · {c.duration} · {c.credits} credits
                    </p>
                  </div>
                  <Badge variant="outline" className={`rounded-none text-[10px] capitalize shrink-0 ${statusStyle[c.status]}`}>
                    {c.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5">
                  {c.platforms.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-muted text-muted-foreground capitalize">
                      {platformIcon[p]} {p}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-muted/50 py-2">
                    <p className="text-sm font-bold text-foreground">{fmt(c.impressions)}</p>
                    <p className="text-[10px] text-muted-foreground">Impressions</p>
                  </div>
                  <div className="bg-muted/50 py-2">
                    <p className="text-sm font-bold text-foreground">{fmt(c.clicks)}</p>
                    <p className="text-[10px] text-muted-foreground">Clicks</p>
                  </div>
                  <div className="bg-muted/50 py-2">
                    <p className="text-sm font-bold text-foreground">{c.applications}</p>
                    <p className="text-[10px] text-muted-foreground">Applications</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Click-through rate</span>
                    <span className="text-foreground font-medium">{ctr.toFixed(2)}%</span>
                  </div>
                  <Progress value={Math.min(ctr * 10, 100)} className="h-1.5" />
                </div>

                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(c)}>
                    View details
                  </Button>
                  {c.status !== "completed" && (
                    <Button size="sm" variant="ghost" onClick={() => toggleStatus(c)}>
                      {c.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Details sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left">{selected.name}</SheetTitle>
                <SheetDescription className="text-left">
                  {selected.startedAt} · {selected.duration} · {selected.credits} credits spent
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border p-3">
                    <p className="text-[11px] text-muted-foreground">Impressions</p>
                    <p className="text-lg font-bold">{fmt(selected.impressions)}</p>
                  </div>
                  <div className="border p-3">
                    <p className="text-[11px] text-muted-foreground">Clicks</p>
                    <p className="text-lg font-bold">{fmt(selected.clicks)}</p>
                  </div>
                  <div className="border p-3">
                    <p className="text-[11px] text-muted-foreground">Applications</p>
                    <p className="text-lg font-bold">{selected.applications}</p>
                  </div>
                  <div className="border p-3">
                    <p className="text-[11px] text-muted-foreground">Cost per application</p>
                    <p className="text-lg font-bold">
                      {(selected.credits / Math.max(selected.applications, 1)).toFixed(2)} cr
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Daily turn-up</p>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selected.daily}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                        <Area type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selected.status !== "completed" && (
                    <Button variant="outline" className="flex-1" onClick={() => toggleStatus(selected)}>
                      {selected.status === "active" ? "Pause campaign" : "Resume campaign"}
                    </Button>
                  )}
                  <Button
                    variant="cta"
                    className="flex-1"
                    onClick={() => toast({ title: "Report exported", description: `${selected.name} analytics downloaded.` })}
                  >
                    Export report
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PromotionsAnalytics;
