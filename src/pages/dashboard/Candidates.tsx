import { useState, useMemo } from "react";
import { Search, Download, SlidersHorizontal, X, Users, UserCheck, UserPlus, ShieldCheck, TrendingUp, Star, Eye, Heart, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock talent data — supports both tech and commercial roles
const mockTalents = [
  { id: 1, name: "Adebayo Ogunlesi", role: "Backend Developer", category: "Tech", jobType: "Full-time", experience: "4 years", skills: ["Node.js", "MongoDB", "Express", "Docker", "AWS"], score: 92, status: "verified", lastActive: "2 hours ago", avatar: "AO", location: "Lagos", education: "BSc Computer Science", strengths: ["Strong API design", "Cloud architecture"], summary: "Experienced backend engineer with a focus on scalable microservices.", email: "adebayo.o@example.com", phone: "+234 803 111 2233", expectedSalary: "₦650,000/mo" },
  { id: 2, name: "Fatima Bello", role: "UI/UX Designer", category: "Design", jobType: "Full-time", experience: "3 years", skills: ["Figma", "Adobe XD", "Tailwind", "Prototyping"], score: 87, status: "active", lastActive: "5 hours ago", avatar: "FB", location: "Abuja", education: "BA Graphic Design", strengths: ["User research", "Design systems"], summary: "Creative designer passionate about accessible and beautiful interfaces.", email: "fatima.b@example.com", phone: "+234 802 222 3344", expectedSalary: "₦500,000/mo" },
  { id: 3, name: "Chinedu Okoro", role: "Full-Stack Developer", category: "Tech", jobType: "Full-time", experience: "5 years", skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "GraphQL"], score: 95, status: "verified", lastActive: "1 hour ago", avatar: "CO", location: "Lagos", education: "MSc Software Engineering", strengths: ["End-to-end delivery", "Technical leadership"], summary: "Versatile full-stack developer with experience leading engineering teams.", email: "chinedu.o@example.com", phone: "+234 805 333 4455", expectedSalary: "₦800,000/mo" },
  { id: 4, name: "Amina Yusuf", role: "Data Analyst", category: "Tech", jobType: "Contract", experience: "2 years", skills: ["Python", "SQL", "Tableau", "Excel"], score: 78, status: "new", lastActive: "1 day ago", avatar: "AY", location: "Kano", education: "BSc Statistics", strengths: ["Data visualization", "Statistical analysis"], summary: "Detail-oriented analyst skilled in transforming data into insights.", email: "amina.y@example.com", phone: "+234 806 444 5566", expectedSalary: "₦400,000/mo" },
  { id: 5, name: "Emeka Nwosu", role: "Mobile Developer", category: "Tech", jobType: "Full-time", experience: "3 years", skills: ["React Native", "Flutter", "Firebase", "TypeScript"], score: 84, status: "active", lastActive: "3 hours ago", avatar: "EN", location: "Port Harcourt", education: "BSc Computer Engineering", strengths: ["Cross-platform development", "Performance optimization"], summary: "Mobile-first developer building high-performance apps.", email: "emeka.n@example.com", phone: "+234 807 555 6677", expectedSalary: "₦600,000/mo" },
  { id: 6, name: "Blessing Eze", role: "DevOps Engineer", category: "Tech", jobType: "Full-time", experience: "4 years", skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"], score: 91, status: "verified", lastActive: "30 min ago", avatar: "BE", location: "Lagos", education: "BSc Information Technology", strengths: ["Infrastructure automation", "Cloud cost optimization"], summary: "DevOps specialist focused on reliable and scalable infrastructure.", email: "blessing.e@example.com", phone: "+234 808 666 7788", expectedSalary: "₦750,000/mo" },
  { id: 7, name: "Yusuf Abdullahi", role: "Frontend Developer", category: "Tech", jobType: "Part-time", experience: "2 years", skills: ["React", "Vue.js", "Tailwind", "JavaScript"], score: 73, status: "active", lastActive: "6 hours ago", avatar: "YA", location: "Kaduna", education: "HND Computer Science", strengths: ["Responsive design", "Component architecture"], summary: "Frontend developer with an eye for clean, responsive interfaces.", email: "yusuf.a@example.com", phone: "+234 809 777 8899", expectedSalary: "₦300,000/mo" },
  { id: 8, name: "Ngozi Okafor", role: "Product Manager", category: "Product", jobType: "Full-time", experience: "6 years", skills: ["Agile", "Jira", "User Research", "Roadmapping", "SQL"], score: 88, status: "verified", lastActive: "4 hours ago", avatar: "NO", location: "Lagos", education: "MBA", strengths: ["Strategic thinking", "Stakeholder management"], summary: "Seasoned PM driving product strategy with data-driven decisions.", email: "ngozi.o@example.com", phone: "+234 810 888 9900", expectedSalary: "₦900,000/mo" },
  { id: 9, name: "Ibrahim Musa", role: "Backend Developer", category: "Tech", jobType: "Internship", experience: "1 year", skills: ["Python", "Django", "PostgreSQL"], score: 62, status: "new", lastActive: "2 days ago", avatar: "IM", location: "Abuja", education: "BSc Computer Science", strengths: ["Quick learner", "Problem solving"], summary: "Junior backend developer eager to grow in a collaborative environment.", email: "ibrahim.m@example.com", phone: "+234 811 999 0011", expectedSalary: "₦150,000/mo" },
  { id: 10, name: "Tolu Adeyinka", role: "Sales Executive", category: "Sales", jobType: "Full-time", experience: "5 years", skills: ["B2B Sales", "Negotiation", "CRM", "Lead Generation"], score: 86, status: "verified", lastActive: "1 hour ago", avatar: "TA", location: "Lagos", education: "BSc Marketing", strengths: ["Closing deals", "Client relationships"], summary: "High-performing sales executive with consistent quota over-achievement.", email: "tolu.a@example.com", phone: "+234 812 100 2233", expectedSalary: "₦550,000/mo" },
  { id: 11, name: "Mary Johnson", role: "Customer Service Lead", category: "Customer Support", jobType: "Full-time", experience: "4 years", skills: ["Communication", "Zendesk", "CRM", "Conflict Resolution"], score: 81, status: "active", lastActive: "2 hours ago", avatar: "MJ", location: "Abuja", education: "BA English", strengths: ["Empathy", "Team coordination"], summary: "Customer service leader with proven track record in retention.", email: "mary.j@example.com", phone: "+234 813 200 3344", expectedSalary: "₦350,000/mo" },
  { id: 12, name: "Sade Olawale", role: "Accountant", category: "Finance", jobType: "Full-time", experience: "7 years", skills: ["QuickBooks", "Excel", "IFRS", "Audit", "Tax"], score: 89, status: "verified", lastActive: "3 hours ago", avatar: "SO", location: "Lagos", education: "BSc Accounting, ICAN", strengths: ["Financial reporting", "Compliance"], summary: "Chartered accountant with strong audit and tax background.", email: "sade.o@example.com", phone: "+234 814 300 4455", expectedSalary: "₦600,000/mo" },
  { id: 13, name: "Kunle Adebanjo", role: "Logistics Manager", category: "Operations", jobType: "Full-time", experience: "6 years", skills: ["Supply Chain", "Fleet Mgmt", "SAP", "Inventory"], score: 80, status: "active", lastActive: "5 hours ago", avatar: "KA", location: "Port Harcourt", education: "BSc Logistics", strengths: ["Route optimization", "Vendor management"], summary: "Operations professional driving efficiency across distribution networks.", email: "kunle.a@example.com", phone: "+234 815 400 5566", expectedSalary: "₦500,000/mo" },
  { id: 14, name: "Halima Sani", role: "Marketing Manager", category: "Marketing", jobType: "Full-time", experience: "5 years", skills: ["Brand Strategy", "Meta Ads", "SEO", "Copywriting"], score: 85, status: "verified", lastActive: "1 hour ago", avatar: "HS", location: "Abuja", education: "BSc Mass Communication", strengths: ["Campaign strategy", "Analytics"], summary: "Marketing manager with strong digital and brand experience.", email: "halima.s@example.com", phone: "+234 816 500 6677", expectedSalary: "₦650,000/mo" },
];

const skillFilters = ["Node.js", "React", "Python", "Figma", "Docker", "TypeScript", "MongoDB", "AWS"];
const experienceFilters = ["0–2 years", "3–5 years", "6+ years"];
const locationFilters = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Kaduna"];
const categoryOptions = ["Tech", "Design", "Product", "Sales", "Marketing", "Finance", "Operations", "Customer Support"];
const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Internship"];

const scoreColor = (score: number) => {
  if (score >= 80) return "text-primary";
  if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
  return "text-destructive";
};

const scoreBg = (score: number) => {
  if (score >= 80) return "bg-primary/20";
  if (score >= 50) return "bg-yellow-500/20";
  return "bg-destructive/20";
};

const statusBadge = (status: string) => {
  switch (status) {
    case "verified": return <Badge className="bg-primary/15 text-primary border-primary/30 rounded-none text-[10px]"><ShieldCheck className="h-3 w-3 mr-1" />Verified</Badge>;
    case "active": return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 rounded-none text-[10px]">Active</Badge>;
    case "new": return <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 rounded-none text-[10px]">New</Badge>;
    default: return null;
  }
};

const topSkillsData = [
  { skill: "React", count: 142 },
  { skill: "Node.js", count: 128 },
  { skill: "Python", count: 97 },
  { skill: "TypeScript", count: 89 },
  { skill: "Docker", count: 76 },
];

const topRolesData = [
  { role: "Backend Developer", count: 85 },
  { role: "Frontend Developer", count: 72 },
  { role: "Full-Stack Developer", count: 58 },
  { role: "UI/UX Designer", count: 41 },
];

export default function Candidates() {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [expFilter, setExpFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [selectedTalent, setSelectedTalent] = useState<typeof mockTalents[0] | null>(null);
  const [shortlisted, setShortlisted] = useState<number[]>([]);

  // Advanced search
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advCategories, setAdvCategories] = useState<string[]>([]);
  const [advJobTypes, setAdvJobTypes] = useState<string[]>([]);
  const [advMinScore, setAdvMinScore] = useState<number>(0);
  const [advVerifiedOnly, setAdvVerifiedOnly] = useState(false);
  const [advKeywords, setAdvKeywords] = useState("");
  const [appliedAdv, setAppliedAdv] = useState<{
    categories: string[]; jobTypes: string[]; minScore: number; verifiedOnly: boolean; keywords: string;
  }>({ categories: [], jobTypes: [], minScore: 0, verifiedOnly: false, keywords: "" });

  const filtered = useMemo(() => {
    let results = [...mockTalents];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (skillFilter.length > 0) {
      results = results.filter(t => skillFilter.some(sf => t.skills.includes(sf)));
    }

    if (expFilter) {
      results = results.filter(t => {
        const yrs = parseInt(t.experience);
        if (expFilter === "0–2 years") return yrs <= 2;
        if (expFilter === "3–5 years") return yrs >= 3 && yrs <= 5;
        return yrs >= 6;
      });
    }

    if (locationFilter) {
      results = results.filter(t => t.location === locationFilter);
    }

    if (sortBy === "best") results.sort((a, b) => b.score - a.score);
    else if (sortBy === "experienced") results.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    else results.sort((a, b) => a.lastActive.localeCompare(b.lastActive));

    return results;
  }, [search, skillFilter, expFilter, locationFilter, sortBy]);

  const toggleSkill = (skill: string) => {
    setSkillFilter(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const resetFilters = () => {
    setSearch("");
    setSkillFilter([]);
    setExpFilter("");
    setLocationFilter("");
    setSortBy("best");
  };

  const hasFilters = search || skillFilter.length > 0 || expFilter || locationFilter;

  const toggleShortlist = (id: number) => {
    setShortlisted(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      toast({ title: next.includes(id) ? "Added to shortlist" : "Removed from shortlist" });
      return next;
    });
  };

  const stats = [
    { label: "Total Talents", value: "1,247", icon: Users, color: "text-primary" },
    { label: "Active Talents", value: "892", icon: UserCheck, color: "text-blue-600 dark:text-blue-400" },
    { label: "New This Week", value: "56", icon: UserPlus, color: "text-yellow-600 dark:text-yellow-400" },
    { label: "NIN Verified", value: "634", icon: ShieldCheck, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Talent Pool</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-powered talent discovery</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-none gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" className="rounded-none gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Advanced Search
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <Card key={s.label} className="rounded-none border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-none bg-muted ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold font-display text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Filter Bar */}
          <Card className="rounded-none border">
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search skills, roles, keywords..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 rounded-none"
                  />
                </div>
                <Select value={expFilter || "all"} onValueChange={v => setExpFilter(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-full sm:w-[160px] rounded-none">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience</SelectItem>
                    {experienceFilters.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={locationFilter || "all"} onValueChange={v => setLocationFilter(v === "all" ? "" : v)}>
                  <SelectTrigger className="w-full sm:w-[150px] rounded-none">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locationFilters.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[160px] rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best">Best Match</SelectItem>
                    <SelectItem value="experienced">Most Experienced</SelectItem>
                    <SelectItem value="recent">Recently Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground font-medium">Skills:</span>
                {skillFilters.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 text-xs font-medium border transition-colors ${
                      skillFilter.includes(skill)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
                {hasFilters && (
                  <button onClick={resetFilters} className="text-xs text-destructive hover:underline ml-2 flex items-center gap-1">
                    <X className="h-3 w-3" /> Reset
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> talents
          </p>

          {/* Talent Grid */}
          {filtered.length === 0 ? (
            <Card className="rounded-none border">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-1">No talents found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                <Button variant="outline" size="sm" className="mt-4 rounded-none" onClick={resetFilters}>Reset Filters</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filtered.map(talent => (
                <Card
                  key={talent.id}
                  className="rounded-none border group hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer relative overflow-hidden"
                  onClick={() => setSelectedTalent(talent)}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <CardContent className="p-4 space-y-3 relative">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                          {talent.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">{talent.name}</h3>
                          <p className="text-xs text-muted-foreground">{talent.role}</p>
                        </div>
                      </div>
                      {statusBadge(talent.status)}
                    </div>

                    {/* Experience & Location */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{talent.experience}</span>
                      <span>•</span>
                      <span>{talent.location}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {talent.skills.slice(0, 4).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium border border-border">
                          {s}
                        </span>
                      ))}
                      {talent.skills.length > 4 && (
                        <span className="px-2 py-0.5 text-[10px] text-muted-foreground">+{talent.skills.length - 4}</span>
                      )}
                    </div>

                    {/* Score + Activity */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2 py-1 ${scoreBg(talent.score)}`}>
                          <Star className={`h-3 w-3 ${scoreColor(talent.score)}`} />
                          <span className={`text-xs font-bold ${scoreColor(talent.score)}`}>{talent.score}%</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Talent Score</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{talent.lastActive}</span>
                    </div>

                    {/* Hover actions */}
                    <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none text-xs flex-1 h-8"
                        onClick={e => { e.stopPropagation(); setSelectedTalent(talent); }}
                      >
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                      <Button
                        variant={shortlisted.includes(talent.id) ? "default" : "outline"}
                        size="sm"
                        className="rounded-none text-xs flex-1 h-8"
                        onClick={e => { e.stopPropagation(); toggleShortlist(talent.id); }}
                      >
                        <Heart className={`h-3 w-3 mr-1 ${shortlisted.includes(talent.id) ? "fill-current" : ""}`} /> {shortlisted.includes(talent.id) ? "Saved" : "Shortlist"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Insight Panel (desktop only) */}
        {!isMobile && (
          <div className="w-[280px] shrink-0 space-y-4">
            <Card className="rounded-none border sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Pool Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pb-5">
                {/* Top Skills */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Top Skills</p>
                  <div className="space-y-2">
                    {topSkillsData.map(s => (
                      <div key={s.skill} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{s.skill}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(s.count / 150) * 100} className="h-1.5 w-16 rounded-none [&>div]:rounded-none" />
                          <span className="text-[10px] text-muted-foreground w-6 text-right">{s.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Requested Roles */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Most Requested Roles</p>
                  <div className="space-y-1.5">
                    {topRolesData.map((r, i) => (
                      <div key={r.role} className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}.</span>
                        <span className="text-xs text-foreground flex-1">{r.role}</span>
                        <span className="text-[10px] text-muted-foreground">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" /> AI Recommendations
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Backend developers with Docker skills are in high demand. Consider reaching out to top-scored candidates early.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <Sheet open={!!selectedTalent} onOpenChange={() => setSelectedTalent(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto rounded-none">
          {selectedTalent && (
            <>
              <SheetHeader className="pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/15 text-primary flex items-center justify-center text-lg font-bold">
                    {selectedTalent.avatar}
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="text-lg font-display">{selectedTalent.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selectedTalent.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`flex items-center gap-1 px-2 py-0.5 ${scoreBg(selectedTalent.score)}`}>
                        <Star className={`h-3 w-3 ${scoreColor(selectedTalent.score)}`} />
                        <span className={`text-xs font-bold ${scoreColor(selectedTalent.score)}`}>{selectedTalent.score}% Match</span>
                      </div>
                      {statusBadge(selectedTalent.status)}
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="w-full rounded-none">
                  <TabsTrigger value="overview" className="rounded-none flex-1 text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="experience" className="rounded-none flex-1 text-xs">Experience</TabsTrigger>
                  <TabsTrigger value="ai" className="rounded-none flex-1 text-xs">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Summary</p>
                    <p className="text-sm text-muted-foreground">{selectedTalent.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTalent.skills.map(s => (
                        <span key={s} className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium border border-border">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted border">
                      <p className="text-[10px] text-muted-foreground">Experience</p>
                      <p className="text-sm font-semibold text-foreground">{selectedTalent.experience}</p>
                    </div>
                    <div className="p-3 bg-muted border">
                      <p className="text-[10px] text-muted-foreground">Location</p>
                      <p className="text-sm font-semibold text-foreground">{selectedTalent.location}</p>
                    </div>
                    <div className="p-3 bg-muted border col-span-2">
                      <p className="text-[10px] text-muted-foreground">Education</p>
                      <p className="text-sm font-semibold text-foreground">{selectedTalent.education}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4 mt-4">
                  <div className="border-l-2 border-primary/30 pl-4 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{selectedTalent.role}</p>
                      <p className="text-xs text-muted-foreground">Current Role • {selectedTalent.experience}</p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedTalent.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Junior {selectedTalent.role}</p>
                      <p className="text-xs text-muted-foreground">Previous Role • 1 year</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Education</p>
                    <p className="text-sm text-muted-foreground">{selectedTalent.education}</p>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4 mt-4">
                  <div className="p-3 bg-primary/5 border border-primary/20">
                    <p className="text-xs font-semibold text-primary mb-1">AI Assessment</p>
                    <p className="text-sm text-foreground">{selectedTalent.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">Strengths</p>
                    <div className="space-y-1.5">
                      {selectedTalent.strengths.map(s => (
                        <div key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-muted border">
                    <p className="text-xs font-semibold text-foreground mb-1">Recommendation</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedTalent.score >= 80
                        ? "Highly recommended for shortlisting. Strong skill alignment and experience."
                        : selectedTalent.score >= 50
                        ? "Moderate match. May benefit from further screening."
                        : "Lower match score. Consider for entry-level or training roles."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <Button
                  variant={shortlisted.includes(selectedTalent.id) ? "default" : "outline"}
                  className="rounded-none flex-1"
                  onClick={() => toggleShortlist(selectedTalent.id)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${shortlisted.includes(selectedTalent.id) ? "fill-current" : ""}`} />
                  {shortlisted.includes(selectedTalent.id) ? "Shortlisted" : "Shortlist"}
                </Button>
                <Button variant="outline" className="rounded-none flex-1" onClick={() => { toast({ title: "Message sent via bot" }); }}>
                  <MessageSquare className="h-4 w-4 mr-2" /> Contact
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
