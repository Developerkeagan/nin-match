import { useState, useMemo } from "react";
import {
  Handshake, Search, Filter, MapPin, Calendar, DollarSign, Clock,
  MoreHorizontal, Eye, Trash2, Mail, Phone, Globe, Star, TrendingUp,
  Users, Building2, CheckCircle2, XCircle, Pause, Play, AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";

type PartnerStatus = "active" | "paused" | "expired";
type PartnerTier = "bronze" | "silver" | "gold" | "platinum";

interface Partner {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  tier: PartnerTier;
  status: PartnerStatus;
  partnershipAmount: number;
  monthlyRevShare: number;
  startDate: string;
  endDate: string;
  durationMonths: number;
  referrals: number;
  conversions: number;
  totalEarnings: number;
  rating: number;
  industry: string;
  notes: string;
}

const industries = ["Recruitment", "HR Tech", "Education", "Staffing", "Marketing", "Technology", "Finance", "Healthcare"];
const locations = ["Lagos, Nigeria", "Accra, Ghana", "Nairobi, Kenya", "Cape Town, SA", "London, UK", "Dubai, UAE", "New York, USA", "Toronto, Canada"];
const firstNames = ["Adewale", "Chidinma", "Kwame", "Fatima", "Oluwaseun", "Amina", "Emeka", "Zainab", "Kofi", "Ngozi"];
const lastNames = ["Okonkwo", "Mensah", "Ibrahim", "Adeyemi", "Osei", "Bello", "Nwosu", "Abubakar", "Asante", "Eze"];
const companyPrefixes = ["Global", "Prime", "Elite", "Apex", "Nexus", "Core", "Peak", "Stellar", "Quantum", "Vanguard"];
const companySuffixes = ["Solutions", "Partners", "Group", "Associates", "Consulting", "Agency", "Networks", "Ventures", "Services", "Labs"];

function generatePartners(count: number): Partner[] {
  const tiers: PartnerTier[] = ["bronze", "silver", "gold", "platinum"];
  const statuses: PartnerStatus[] = ["active", "paused", "expired"];
  return Array.from({ length: count }, (_, i) => {
    const tier = tiers[i % 4];
    const amounts = { bronze: 50000, silver: 150000, gold: 350000, platinum: 750000 };
    const revShares = { bronze: 5, silver: 10, gold: 15, platinum: 20 };
    const duration = [6, 12, 18, 24][i % 4];
    const start = new Date(2023, i % 12, (i % 28) + 1);
    const end = new Date(start);
    end.setMonth(end.getMonth() + duration);
    const referrals = Math.floor(Math.random() * 200) + 10;
    const conversions = Math.floor(referrals * (0.1 + Math.random() * 0.4));
    return {
      id: `PTR-${String(i + 1).padStart(4, "0")}`,
      companyName: `${companyPrefixes[i % 10]} ${companySuffixes[(i + 3) % 10]}`,
      contactName: `${firstNames[i % 10]} ${lastNames[(i + 5) % 10]}`,
      email: `partner${i + 1}@${companyPrefixes[i % 10].toLowerCase()}.com`,
      phone: `+234 ${800 + (i % 100)} ${1000 + i}`,
      website: `https://${companyPrefixes[i % 10].toLowerCase()}${companySuffixes[(i + 3) % 10].toLowerCase()}.com`,
      location: locations[i % locations.length],
      tier,
      status: statuses[i % 3],
      partnershipAmount: amounts[tier] + Math.floor(Math.random() * 50000),
      monthlyRevShare: revShares[tier],
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      durationMonths: duration,
      referrals,
      conversions,
      totalEarnings: conversions * (500 + Math.floor(Math.random() * 2000)),
      rating: Math.round((3 + Math.random() * 2) * 10) / 10,
      industry: industries[i % industries.length],
      notes: "Partnership in good standing.",
    };
  });
}

const allPartners = generatePartners(85);

const tierColors: Record<PartnerTier, string> = {
  bronze: "bg-orange-100 text-orange-700 border-orange-200",
  silver: "bg-slate-100 text-slate-700 border-slate-200",
  gold: "bg-yellow-100 text-yellow-700 border-yellow-200",
  platinum: "bg-violet-100 text-violet-700 border-violet-200",
};

const statusConfig: Record<PartnerStatus, { color: string; icon: React.ElementType }> = {
  active: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  paused: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Pause },
  expired: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

const PER_PAGE = 100;

const AdminPartners = () => {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);

  const filtered = useMemo(() => {
    return allPartners.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.companyName.toLowerCase().includes(q) || p.contactName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
      const matchTier = tierFilter === "all" || p.tier === tierFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchTier && matchStatus;
    });
  }, [search, tierFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const fmt = (n: number) => "₦" + n.toLocaleString();

  const openDetails = (p: Partner) => { setSelectedPartner(p); setSheetOpen(true); };

  const handleDelete = () => {
    if (!deleteTarget) return;
    toast({ title: "Partner removed", description: `${deleteTarget.companyName} has been removed.` });
    setDeleteTarget(null);
  };

  const handleStatusToggle = (p: Partner) => {
    const next = p.status === "active" ? "paused" : "active";
    toast({ title: "Status updated", description: `${p.companyName} is now ${next}.` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Handshake className="h-6 w-6 text-primary" /> Partner Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">View, manage, and track all platform partnerships</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Partners", value: allPartners.length, icon: Users },
          { label: "Active", value: allPartners.filter(p => p.status === "active").length, icon: CheckCircle2 },
          { label: "Total Revenue", value: fmt(allPartners.reduce((s, p) => s + p.totalEarnings, 0)), icon: DollarSign },
          { label: "Avg Rating", value: (allPartners.reduce((s, p) => s + p.rating, 0) / allPartners.length).toFixed(1), icon: Star },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search partners..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={tierFilter} onValueChange={(v) => { setTierFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[140px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Tier" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="bronze">Bronze</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">{filtered.length} partner{filtered.length !== 1 ? "s" : ""} found</p>

      {/* Accordion list */}
      <Accordion type="multiple" className="space-y-2">
        {paginated.map((p) => {
          const StatusIcon = statusConfig[p.status].icon;
          return (
            <AccordionItem key={p.id} value={p.id} className="border rounded-xl bg-card px-4 overflow-hidden">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 w-full text-left pr-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {p.companyName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{p.companyName}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.contactName} · {p.email}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] capitalize ${tierColors[p.tier]}`}>{p.tier}</Badge>
                    <Badge variant="outline" className={`text-[10px] capitalize ${statusConfig[p.status].color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />{p.status}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /><span>{p.location}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Building2 className="h-3.5 w-3.5 text-muted-foreground" /><span>{p.industry}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Star className="h-3.5 w-3.5 text-amber-500" /><span>{p.rating} / 5.0</span></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm"><DollarSign className="h-3.5 w-3.5 text-muted-foreground" /><span>Deal: {fmt(p.partnershipAmount)}</span></div>
                    <div className="flex items-center gap-2 text-sm"><TrendingUp className="h-3.5 w-3.5 text-muted-foreground" /><span>{p.monthlyRevShare}% rev share</span></div>
                    <div className="flex items-center gap-2 text-sm"><Clock className="h-3.5 w-3.5 text-muted-foreground" /><span>{p.durationMonths} months</span></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span>{p.referrals} referrals · {p.conversions} converted</span></div>
                    <div className="flex items-center gap-2 text-sm"><DollarSign className="h-3.5 w-3.5 text-emerald-500" /><span>Earned: {fmt(p.totalEarnings)}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /><span>{p.startDate} → {p.endDate}</span></div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`capitalize sm:hidden ${tierColors[p.tier]}`}>{p.tier}</Badge>
                  <Badge variant="outline" className={`capitalize sm:hidden ${statusConfig[p.status].color}`}>{p.status}</Badge>
                  <div className="flex-1" />
                  <Button size="sm" variant="outline" onClick={() => openDetails(p)}>
                    <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusToggle(p)}>
                        {p.status === "active" ? <><Pause className="mr-2 h-4 w-4" /> Pause Partnership</> : <><Play className="mr-2 h-4 w-4" /> Activate Partnership</>}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setDeleteTarget(p)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Partner
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }} /></PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}><PaginationLink href="#" isActive={page === i + 1} onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>{i + 1}</PaginationLink></PaginationItem>
            ))}
            <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }} /></PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedPartner && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {selectedPartner.companyName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <SheetTitle>{selectedPartner.companyName}</SheetTitle>
                    <SheetDescription>{selectedPartner.id} · {selectedPartner.industry}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline" className={`capitalize ${tierColors[selectedPartner.tier]}`}>{selectedPartner.tier}</Badge>
                <Badge variant="outline" className={`capitalize ${statusConfig[selectedPartner.status].color}`}>{selectedPartner.status}</Badge>
              </div>
              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <h4 className="font-semibold text-sm text-foreground">Partnership Details</h4>
                    {[
                      ["Deal Amount", fmt(selectedPartner.partnershipAmount)],
                      ["Revenue Share", `${selectedPartner.monthlyRevShare}%`],
                      ["Duration", `${selectedPartner.durationMonths} months`],
                      ["Start Date", selectedPartner.startDate],
                      ["End Date", selectedPartner.endDate],
                      ["Location", selectedPartner.location],
                      ["Industry", selectedPartner.industry],
                      ["Rating", `${selectedPartner.rating} / 5.0`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border bg-card p-4 space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">Contract Progress</h4>
                    {(() => {
                      const start = new Date(selectedPartner.startDate).getTime();
                      const end = new Date(selectedPartner.endDate).getTime();
                      const now = Date.now();
                      const pct = Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
                      return (
                        <>
                          <Progress value={pct} className="h-2" />
                          <p className="text-xs text-muted-foreground text-right">{pct}% elapsed</p>
                        </>
                      );
                    })()}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Referrals", value: selectedPartner.referrals, icon: Users },
                      { label: "Conversions", value: selectedPartner.conversions, icon: TrendingUp },
                      { label: "Conv. Rate", value: `${((selectedPartner.conversions / selectedPartner.referrals) * 100).toFixed(1)}%`, icon: CheckCircle2 },
                      { label: "Total Earned", value: fmt(selectedPartner.totalEarnings), icon: DollarSign },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg border bg-card p-3 text-center">
                        <m.icon className="h-5 w-5 mx-auto text-primary mb-1" />
                        <p className="text-lg font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border bg-card p-4 space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">Monthly Breakdown</h4>
                    {[
                      { month: "Jan 2024", refs: 18, conv: 6, earned: fmt(12000) },
                      { month: "Feb 2024", refs: 24, conv: 9, earned: fmt(18500) },
                      { month: "Mar 2024", refs: 31, conv: 12, earned: fmt(24000) },
                    ].map((row) => (
                      <div key={row.month} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                        <span className="text-muted-foreground">{row.month}</span>
                        <span className="text-foreground">{row.refs} refs · {row.conv} conv · {row.earned}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 mt-4">
                  <div className="rounded-lg border bg-card p-4 space-y-3">
                    <h4 className="font-semibold text-sm text-foreground">Contact Person</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {selectedPartner.contactName.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{selectedPartner.contactName}</p>
                        <p className="text-xs text-muted-foreground">Partnership Manager</p>
                      </div>
                    </div>
                    <Separator />
                    {[
                      { icon: Mail, label: selectedPartner.email },
                      { icon: Phone, label: selectedPartner.phone },
                      { icon: Globe, label: selectedPartner.website },
                      { icon: MapPin, label: selectedPartner.location },
                    ].map((c) => (
                      <div key={c.label} className="flex items-center gap-2 text-sm">
                        <c.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground truncate">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Remove Partner</DialogTitle>
            <DialogDescription>Are you sure you want to remove <strong>{deleteTarget?.companyName}</strong>? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartners;
