import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Coins,
  Twitter,
  Instagram,
  Send,
  Plus,
  Pencil,
  Image as ImageIcon,
  Video,
  Repeat,
  CalendarDays,
  Sparkles,
  Save,
  Layers,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* ──────────────── Types ──────────────── */
interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceNgn: number;
  bonus: number;
  popular?: boolean;
}

interface CostConfig {
  platforms: { twitter: number; instagram: number; telegram: number };
  media: { image: number; video: number };
  frequency: { "1": number; "3": number; "5": number; "7": number };
  duration: { "3": number; "7": number; "14": number; "30": number };
}

interface PromoPlan {
  id: string;
  name: string;
  description: string;
  baseCredits: number;
  features: string[];
  active: boolean;
  highlight?: boolean;
}

/* ──────────────── Initial data ──────────────── */
const initialPacks: CreditPack[] = [
  { id: "p1", name: "Spark", credits: 100, priceNgn: 5000, bonus: 0 },
  { id: "p2", name: "Boost", credits: 500, priceNgn: 22500, bonus: 50, popular: true },
  { id: "p3", name: "Surge", credits: 1500, priceNgn: 60000, bonus: 250 },
  { id: "p4", name: "Empire", credits: 5000, priceNgn: 180000, bonus: 1200 },
];

const initialPlans: PromoPlan[] = [
  {
    id: "pl1",
    name: "Quick Promote",
    description: "Single platform, single post — fastest reach.",
    baseCredits: 15,
    features: ["1 platform", "1 post", "3-day visibility"],
    active: true,
  },
  {
    id: "pl2",
    name: "Multi-Channel",
    description: "Cross-post across 3 platforms with smart scheduling.",
    baseCredits: 65,
    features: ["3 platforms", "3 posts/week", "14-day visibility", "AI caption assist"],
    active: true,
    highlight: true,
  },
  {
    id: "pl3",
    name: "Brand Takeover",
    description: "Premium 30-day saturation across the entire network.",
    baseCredits: 220,
    features: ["All platforms", "Daily posts", "30-day visibility", "Featured slot", "Analytics report"],
    active: true,
  },
];

const defaultCosts: CostConfig = {
  platforms: { twitter: 5, instagram: 6, telegram: 4 },
  media: { image: 2, video: 5 },
  frequency: { "1": 1, "3": 2.5, "5": 4, "7": 6 },
  duration: { "3": 1, "7": 2, "14": 3.5, "30": 6 },
};

/* ──────────────── Page ──────────────── */
const AdminPromotionPlans = () => {
  const [packs, setPacks] = useState<CreditPack[]>(initialPacks);
  const [plans, setPlans] = useState<PromoPlan[]>(initialPlans);
  const [costs, setCosts] = useState<CostConfig>(defaultCosts);

  const totalRevenuePotential = useMemo(
    () => packs.reduce((s, p) => s + p.priceNgn, 0),
    [packs],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotion Plans</h1>
          <p className="text-sm text-muted-foreground">
            Manage credit packs, promotion bundles and per-feature pricing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Settings exported" })}>
            Export Config
          </Button>
          <Button size="sm" onClick={() => toast({ title: "Pricing saved", description: "Live across all dashboards." })}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiTile icon={Coins} label="Active credit packs" value={packs.length.toString()} />
        <KpiTile icon={Layers} label="Promotion plans" value={plans.filter(p => p.active).length.toString()} />
        <KpiTile icon={Sparkles} label="Cheapest pack" value={`₦${Math.min(...packs.map(p => p.priceNgn)).toLocaleString()}`} />
        <KpiTile icon={TrendingUp} label="Revenue potential" value={`₦${(totalRevenuePotential/1000).toFixed(0)}k`} />
      </div>

      <Tabs defaultValue="packs" className="w-full">
        <TabsList>
          <TabsTrigger value="packs">Credit Packs</TabsTrigger>
          <TabsTrigger value="plans">Promotion Plans</TabsTrigger>
          <TabsTrigger value="costs">Per-Option Pricing</TabsTrigger>
        </TabsList>

        {/* Credit packs */}
        <TabsContent value="packs" className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Packs companies buy to top up their credit balance.
            </p>
            <NewPackDialog onCreate={(p) => setPacks([...packs, p])} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packs.map((p) => (
              <Card key={p.id} className={p.popular ? "border-primary shadow-md" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    {p.popular && <Badge>Popular</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-display text-2xl font-bold">
                      {p.credits.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground"> credits</span>
                    </div>
                    {p.bonus > 0 && (
                      <div className="text-xs text-primary font-medium">+{p.bonus} bonus</div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sells for <span className="text-foreground font-semibold">₦{p.priceNgn.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    ≈ ₦{(p.priceNgn / (p.credits + p.bonus)).toFixed(1)} per credit
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: `Editing ${p.name}` })}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPacks(packs.filter(x => x.id !== p.id))}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Promotion plans */}
        <TabsContent value="plans" className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Bundled promotion offerings shown in the company dashboard.
            </p>
            <Button size="sm" onClick={() => toast({ title: "Open plan builder" })}>
              <Plus className="h-4 w-4" /> New Plan
            </Button>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {plans.map((pl) => (
              <Card key={pl.id} className={pl.highlight ? "border-primary shadow-lg" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{pl.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{pl.description}</p>
                    </div>
                    <Switch
                      checked={pl.active}
                      onCheckedChange={(v) => setPlans(plans.map(x => x.id === pl.id ? { ...x, active: v } : x))}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold">{pl.baseCredits}</span>
                    <span className="text-sm text-muted-foreground">credits / run</span>
                  </div>
                  <ul className="text-sm space-y-1.5">
                    {pl.features.map(f => (
                      <li key={f} className="flex gap-2">
                        <span className="text-primary">•</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Plan duplicated" })}>
                      Duplicate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Per-option pricing */}
        <TabsContent value="costs" className="mt-5 space-y-5">
          <p className="text-sm text-muted-foreground">
            Fine-tune credit cost for each option in the company promotion builder.
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Per platform</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead className="w-40">Cost (credits)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(["twitter", "instagram", "telegram"] as const).map((k) => {
                    const Icon = k === "twitter" ? Twitter : k === "instagram" ? Instagram : Send;
                    return (
                      <TableRow key={k}>
                        <TableCell className="capitalize font-medium">{k}</TableCell>
                        <TableCell><Icon className="h-4 w-4 text-muted-foreground" /></TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={costs.platforms[k]}
                            onChange={(e) => setCosts({ ...costs, platforms: { ...costs.platforms, [k]: +e.target.value } })}
                            className="h-9"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <CostBlock
              icon={ImageIcon}
              title="Media type"
              entries={[
                { label: "Image", value: costs.media.image, set: (v) => setCosts({ ...costs, media: { ...costs.media, image: v } }) },
                { label: "Video", value: costs.media.video, set: (v) => setCosts({ ...costs, media: { ...costs.media, video: v } }) },
              ]}
            />
            <CostBlock
              icon={Repeat}
              title="Frequency multiplier"
              entries={(["1","3","5","7"] as const).map(k => ({
                label: `${k}× / week`,
                value: costs.frequency[k],
                set: (v) => setCosts({ ...costs, frequency: { ...costs.frequency, [k]: v } }),
              }))}
            />
            <CostBlock
              icon={CalendarDays}
              title="Duration multiplier"
              entries={(["3","7","14","30"] as const).map(k => ({
                label: `${k} days`,
                value: costs.duration[k],
                set: (v) => setCosts({ ...costs, duration: { ...costs.duration, [k]: v } }),
              }))}
            />
          </div>

          <Card className="bg-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Live formula</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="block text-xs sm:text-sm font-mono text-muted-foreground bg-background border border-border rounded p-3">
                credits = ((platforms × cost) + media) × frequency × duration
              </code>
              <p className="mt-2 text-xs text-muted-foreground">
                Example: 2 platforms (Twitter + Instagram) with a video, 3×/week, 7 days =
                <span className="text-foreground font-semibold ml-1">
                  {Math.round(((costs.platforms.twitter + costs.platforms.instagram) + costs.media.video) * costs.frequency["3"] * costs.duration["7"])} credits
                </span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ──────────────── Sub-components ──────────────── */
function KpiTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="font-display text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CostBlock({
  icon: Icon,
  title,
  entries,
}: {
  icon: any;
  title: string;
  entries: { label: string; value: number; set: (v: number) => void }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.map((e) => (
          <div key={e.label} className="flex items-center gap-2">
            <Label className="flex-1 text-xs">{e.label}</Label>
            <Input
              type="number"
              step="0.5"
              value={e.value}
              onChange={(ev) => e.set(+ev.target.value)}
              className="h-8 w-24"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function NewPackDialog({ onCreate }: { onCreate: (p: CreditPack) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", credits: 100, priceNgn: 5000, bonus: 0 });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4" /> New Pack</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create credit pack</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mega" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Credits</Label>
              <Input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: +e.target.value })} />
            </div>
            <div>
              <Label>Bonus</Label>
              <Input type="number" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: +e.target.value })} />
            </div>
            <div>
              <Label>Price (₦)</Label>
              <Input type="number" value={form.priceNgn} onChange={(e) => setForm({ ...form, priceNgn: +e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (!form.name) return toast({ title: "Name required" });
              onCreate({ id: crypto.randomUUID(), ...form });
              setOpen(false);
              toast({ title: "Pack created" });
            }}
          >Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminPromotionPlans;
