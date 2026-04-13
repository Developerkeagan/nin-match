import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Eye, MoreVertical, Trash2, Building2, MapPin, Globe, Users,
  Calendar, Mail, Phone, CreditCard, Briefcase, TrendingUp, Award,
  Ban, CheckCircle, Star, Hash, ArrowUpRight, BarChart3,
} from "lucide-react";

type CompanyStatus = "active" | "suspended" | "pending";
type PlanType = "free" | "starter" | "business" | "enterprise";

interface MockCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CompanyStatus;
  industry: string;
  size: string;
  location: string;
  website: string;
  refNumber: string;
  joinDate: string;
  lastActive: string;
  plan: PlanType;
  planPrice: number;
  subscriptionHistory: number;
  creditsTotal: number;
  creditsUsed: number;
  jobsPosted: number;
  activeJobs: number;
  totalApplications: number;
  hiresMade: number;
  promotionsRun: number;
  promotionSpend: number;
  aiMatchesUsed: number;
  rating: number;
  contactPerson: string;
  contactRole: string;
  description: string;
  billingHistory: { date: string; amount: number; plan: string; status: string }[];
}

const industries = [
  "Technology", "Finance", "Healthcare", "Education", "Retail",
  "Manufacturing", "Media", "Logistics", "Real Estate", "Agriculture",
];

const companyNames = [
  "Paystack", "Flutterwave", "Andela", "Kuda Bank", "Interswitch",
  "PiggyVest", "Cowrywise", "Bamboo", "Mono", "Carbon",
  "TeamApt", "Paga", "Opay", "PalmPay", "Chipper Cash",
  "TalentQL", "AltSchool", "Decagon", "Semicolon", "HNG Tech",
  "Korapay", "Bloc", "Grey", "Risevest", "Trove",
  "Termii", "Sendchamp", "Buycoins", "Patricia", "Quidax",
  "Bundle", "Roqqu", "Credpal", "FairMoney", "Renmoney",
  "Stanbic IBTC", "GTBank", "Access Bank", "Zenith Bank", "FirstBank",
];

const generateCompanies = (): MockCompany[] => {
  const locations = [
    "Lagos, Nigeria", "Abuja, Nigeria", "Port Harcourt, Nigeria", "Kano, Nigeria",
    "Ibadan, Nigeria", "Accra, Ghana", "Nairobi, Kenya", "Cape Town, South Africa",
  ];
  const sizes = ["1-10", "11-50", "50-200", "200-500", "500+"];
  const plans: PlanType[] = ["free", "starter", "business", "enterprise"];
  const planPrices = { free: 0, starter: 5, business: 15, enterprise: 50 };
  const contactRoles = ["CEO", "CTO", "HR Manager", "Talent Lead", "COO", "Head of People"];

  const companies: MockCompany[] = [];
  for (let i = 0; i < 156; i++) {
    const name = i < companyNames.length ? companyNames[i] : `${companyNames[i % companyNames.length]} ${Math.floor(i / companyNames.length) + 1}`;
    const plan = plans[i % plans.length];
    const creditsTotal = plan === "free" ? 10 : plan === "starter" ? 50 : plan === "business" ? 100 : 500;
    const creditsUsed = Math.floor(Math.random() * creditsTotal);
    const jobsPosted = Math.floor(Math.random() * 30) + 1;
    const activeJobs = Math.min(Math.floor(Math.random() * 8), jobsPosted);
    const hires = Math.floor(Math.random() * 15);

    companies.push({
      id: `c${i + 1}`,
      name,
      email: `contact@${name.toLowerCase().replace(/\s+/g, "")}.com`,
      phone: `+234 ${800 + (i % 100)} ${1000000 + i}`,
      status: i % 12 === 0 ? "suspended" : i % 20 === 0 ? "pending" : "active",
      industry: industries[i % industries.length],
      size: sizes[i % sizes.length],
      location: locations[i % locations.length],
      website: `https://${name.toLowerCase().replace(/\s+/g, "")}.com`,
      refNumber: `HO-${(100000 + i * 37) % 999999}`,
      joinDate: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} 202${3 + Math.floor(i / 60)}`,
      lastActive: i % 5 === 0 ? "Today" : i % 3 === 0 ? "Yesterday" : `${2 + (i % 10)} days ago`,
      plan,
      planPrice: planPrices[plan],
      subscriptionHistory: 1 + Math.floor(Math.random() * 8),
      creditsTotal,
      creditsUsed,
      jobsPosted,
      activeJobs,
      totalApplications: jobsPosted * (5 + Math.floor(Math.random() * 20)),
      hiresMade: hires,
      promotionsRun: Math.floor(Math.random() * 10),
      promotionSpend: Math.floor(Math.random() * 500) * 10,
      aiMatchesUsed: Math.floor(Math.random() * 50),
      rating: 3 + Math.round(Math.random() * 20) / 10,
      contactPerson: ["Adebayo Olumide", "Fatima Ibrahim", "Chinedu Okafor", "Amina Yusuf", "Emeka Nwankwo", "Grace Adeyemi"][i % 6],
      contactRole: contactRoles[i % contactRoles.length],
      description: `${name} is a leading ${industries[i % industries.length].toLowerCase()} company based in ${locations[i % locations.length]}.`,
      billingHistory: Array.from({ length: 1 + Math.floor(Math.random() * 5) }, (_, j) => ({
        date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][j]} 2026`,
        amount: planPrices[plan],
        plan: plan.charAt(0).toUpperCase() + plan.slice(1),
        status: j === 0 ? "Paid" : Math.random() > 0.1 ? "Paid" : "Failed",
      })),
    });
  }
  return companies;
};

const COMPANIES_PER_PAGE = 100;

const planColors: Record<PlanType, string> = {
  free: "bg-muted text-muted-foreground",
  starter: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  business: "bg-primary/15 text-primary border-primary/30",
  enterprise: "bg-amber-500/15 text-amber-600 border-amber-500/30",
};

const statusColors: Record<CompanyStatus, string> = {
  active: "",
  suspended: "",
  pending: "",
};

const AdminCompanies = () => {
  const { toast } = useToast();
  const [allCompanies, setAllCompanies] = useState(generateCompanies);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<MockCompany | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<MockCompany | null>(null);

  const filtered = useMemo(() => {
    return allCompanies.filter((c) => {
      if (planFilter !== "all" && c.plan !== planFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (industryFilter !== "all" && c.industry.toLowerCase() !== industryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.refNumber.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allCompanies, search, planFilter, statusFilter, industryFilter]);

  const totalPages = Math.ceil(filtered.length / COMPANIES_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * COMPANIES_PER_PAGE, currentPage * COMPANIES_PER_PAGE);

  const toggleStatus = (company: MockCompany) => {
    const newStatus: CompanyStatus = company.status === "active" ? "suspended" : "active";
    setAllCompanies((prev) => prev.map((c) => (c.id === company.id ? { ...c, status: newStatus } : c)));
    toast({ title: `${company.name} has been ${newStatus}` });
  };

  const changePlan = (company: MockCompany, newPlan: PlanType) => {
    const planPrices = { free: 0, starter: 5, business: 15, enterprise: 50 };
    setAllCompanies((prev) => prev.map((c) => (c.id === company.id ? { ...c, plan: newPlan, planPrice: planPrices[newPlan] } : c)));
    toast({ title: `${company.name} plan changed to ${newPlan}` });
  };

  const deleteCompany = () => {
    if (!companyToDelete) return;
    setAllCompanies((prev) => prev.filter((c) => c.id !== companyToDelete.id));
    toast({ title: `${companyToDelete.name} has been deleted`, variant: "destructive" });
    setCompanyToDelete(null);
    setDeleteDialogOpen(false);
    if (selectedCompany?.id === companyToDelete.id) setSelectedCompany(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Companies</h1>
          <p className="text-muted-foreground text-sm">Manage all registered companies on the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            {filtered.length} companies
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, email, ref number…"
            className="pl-9"
          />
        </div>
        <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={industryFilter} onValueChange={(v) => { setIndustryFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind.toLowerCase()}>{ind}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Companies Accordion List */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Accordion type="single" collapsible className="w-full">
          {paginated.map((company) => (
            <AccordionItem key={company.id} value={company.id} className="border-b border-border last:border-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground truncate">{company.name}</p>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${planColors[company.plan]}`}>
                        {company.plan}
                      </Badge>
                      <Badge
                        variant={company.status === "active" ? "secondary" : company.status === "suspended" ? "destructive" : "outline"}
                        className="text-[10px] px-1.5 py-0 shrink-0 hidden sm:inline-flex"
                      >
                        {company.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{company.email}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground font-mono text-xs">{company.refNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{company.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">Joined {company.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{company.size} employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground truncate">{company.website}</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-background rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground">Jobs Posted</p>
                      <p className="text-lg font-bold text-foreground">{company.jobsPosted}</p>
                      <p className="text-[10px] text-muted-foreground">{company.activeJobs} active</p>
                    </div>
                    <div className="bg-background rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground">Hires Made</p>
                      <p className="text-lg font-bold text-foreground">{company.hiresMade}</p>
                    </div>
                    <div className="bg-background rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground">Credits</p>
                      <p className="text-lg font-bold text-foreground">{company.creditsTotal - company.creditsUsed}</p>
                      <p className="text-[10px] text-muted-foreground">of {company.creditsTotal}</p>
                    </div>
                    <div className="bg-background rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground">Subscriptions</p>
                      <p className="text-lg font-bold text-foreground">{company.subscriptionHistory}</p>
                      <p className="text-[10px] text-muted-foreground">times renewed</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <Button size="sm" variant="outline" onClick={() => setSelectedCompany(company)}>
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-3.5 w-3.5 mr-1.5" /> Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => toggleStatus(company)}>
                          {company.status === "active" ? (
                            <><Ban className="h-4 w-4 mr-2" /> Suspend</>
                          ) : (
                            <><CheckCircle className="h-4 w-4 mr-2" /> Activate</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => changePlan(company, "free")}>Set to Free</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changePlan(company, "starter")}>Set to Starter</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changePlan(company, "business")}>Set to Business</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changePlan(company, "enterprise")}>Set to Enterprise</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => { setCompanyToDelete(company); setDeleteDialogOpen(true); }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Company
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {paginated.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No companies found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Company Detail Sheet */}
      <Sheet open={!!selectedCompany} onOpenChange={(open) => { if (!open) setSelectedCompany(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedCompany && (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-xl">{selectedCompany.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selectedCompany.email}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{selectedCompany.refNumber}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <Badge variant="outline" className={planColors[selectedCompany.plan]}>
                      {selectedCompany.plan}
                    </Badge>
                    <Badge variant={selectedCompany.status === "active" ? "secondary" : selectedCompany.status === "suspended" ? "destructive" : "outline"}>
                      {selectedCompany.status}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                  <TabsTrigger value="billing" className="text-xs">Billing</TabsTrigger>
                  <TabsTrigger value="contact" className="text-xs">Contact</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{selectedCompany.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-foreground">{selectedCompany.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-foreground">{selectedCompany.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-foreground">{selectedCompany.size} employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-foreground">Joined {selectedCompany.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-foreground truncate">{selectedCompany.website}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-foreground">{selectedCompany.rating} rating</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-3">Subscription & Credits</p>
                    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground capitalize">{selectedCompany.plan} Plan</p>
                          <p className="text-xs text-muted-foreground">{selectedCompany.subscriptionHistory} subscription(s)</p>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          ${selectedCompany.planPrice}<span className="text-xs font-normal text-muted-foreground">/mo</span>
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Credits used</span>
                          <span className="font-semibold text-foreground">{selectedCompany.creditsUsed} / {selectedCompany.creditsTotal}</span>
                        </div>
                        <Progress value={(selectedCompany.creditsUsed / selectedCompany.creditsTotal) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/40 rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs text-muted-foreground">Jobs Posted</p>
                      </div>
                      <p className="text-xl font-bold text-foreground">{selectedCompany.jobsPosted}</p>
                      <p className="text-[10px] text-muted-foreground">{selectedCompany.activeJobs} currently active</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs text-muted-foreground">Applications</p>
                      </div>
                      <p className="text-xl font-bold text-foreground">{selectedCompany.totalApplications}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs text-muted-foreground">Hires Made</p>
                      </div>
                      <p className="text-xl font-bold text-foreground">{selectedCompany.hiresMade}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3.5 w-3.5 text-primary" />
                        <p className="text-xs text-muted-foreground">AI Matches</p>
                      </div>
                      <p className="text-xl font-bold text-foreground">{selectedCompany.aiMatchesUsed}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Promotions</p>
                    <div className="flex items-center justify-between text-sm bg-muted/40 rounded-lg p-3 border border-border">
                      <div>
                        <p className="text-foreground font-medium">{selectedCompany.promotionsRun} promotions run</p>
                        <p className="text-xs text-muted-foreground">Total spend: ${selectedCompany.promotionSpend.toLocaleString()}</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Last Active</p>
                    <p className="text-sm text-muted-foreground">{selectedCompany.lastActive}</p>
                  </div>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground">Billing History</p>
                    <Badge variant="outline" className="text-xs">
                      {selectedCompany.billingHistory.length} transactions
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {selectedCompany.billingHistory.map((bill, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-muted/40 rounded-lg p-3 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CreditCard className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{bill.plan} Plan</p>
                            <p className="text-xs text-muted-foreground">{bill.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">${bill.amount}</p>
                          <Badge variant={bill.status === "Paid" ? "secondary" : "destructive"} className="text-[10px]">
                            {bill.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Revenue from Company</span>
                    <span className="font-bold text-foreground">
                      ${selectedCompany.billingHistory.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0)}
                    </span>
                  </div>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-4 mt-4">
                  <div className="bg-muted/40 rounded-lg p-4 border border-border space-y-3">
                    <p className="text-xs font-semibold text-foreground">Primary Contact</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground font-medium">{selectedCompany.contactPerson}</span>
                        <Badge variant="outline" className="text-[10px]">{selectedCompany.contactRole}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground">{selectedCompany.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground">{selectedCompany.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground">{selectedCompany.website}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded-lg p-4 border border-border space-y-2">
                    <p className="text-xs font-semibold text-foreground">Address</p>
                    <p className="text-sm text-foreground">{selectedCompany.location}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <span className="font-semibold">{companyToDelete?.name}</span>? This action cannot be undone. All associated data including jobs, applications, and billing history will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteCompany}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCompanies;
