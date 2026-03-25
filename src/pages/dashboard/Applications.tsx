import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Search, Download, Eye, MessageSquare, ChevronRight, Sparkles, User, GripVertical,
} from "lucide-react";

type Stage = "applied" | "shortlisted" | "interview" | "hired" | "rejected";

interface Candidate {
  id: string;
  name: string;
  role: string;
  jobId: string;
  aiScore: number;
  skills: string[];
  experience: string;
  education: string;
  stage: Stage;
  summary: string;
  workHistory: { company: string; role: string; duration: string }[];
  strengths: string[];
  weaknesses: string[];
  aiRecommendation: string;
}

const JOBS = [
  { id: "all", title: "All Jobs" },
  { id: "j1", title: "Backend Developer" },
  { id: "j2", title: "Frontend Developer" },
  { id: "j3", title: "Product Designer" },
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "c1", name: "Adebayo Olumide", role: "Backend Developer", jobId: "j1",
    aiScore: 92, skills: ["Node.js", "MongoDB", "Express", "TypeScript"],
    experience: "4 years", education: "BSc Computer Science, UNILAG",
    stage: "applied", summary: "Experienced backend developer with strong API design skills.",
    workHistory: [
      { company: "Paystack", role: "Backend Engineer", duration: "2022–Present" },
      { company: "Andela", role: "Software Developer", duration: "2020–2022" },
    ],
    strengths: ["Strong API design", "Database optimization", "Team leadership"],
    weaknesses: ["Limited frontend experience"],
    aiRecommendation: "Highly suitable — strong backend skills align perfectly with role requirements.",
  },
  {
    id: "c2", name: "Fatima Ibrahim", role: "Backend Developer", jobId: "j1",
    aiScore: 78, skills: ["Python", "Django", "PostgreSQL"],
    experience: "2 years", education: "BSc Software Engineering, ABU",
    stage: "applied", summary: "Python developer transitioning to Node.js ecosystem.",
    workHistory: [
      { company: "Kuda Bank", role: "Junior Developer", duration: "2023–Present" },
    ],
    strengths: ["Quick learner", "Strong fundamentals"],
    weaknesses: ["Limited Node.js experience", "Needs mentoring"],
    aiRecommendation: "Good potential but may require onboarding time for Node.js stack.",
  },
  {
    id: "c3", name: "Chinedu Okafor", role: "Frontend Developer", jobId: "j2",
    aiScore: 88, skills: ["React", "TypeScript", "Tailwind", "Next.js"],
    experience: "3 years", education: "BSc Computer Engineering, UNIBEN",
    stage: "shortlisted", summary: "Frontend specialist with design system experience.",
    workHistory: [
      { company: "Flutterwave", role: "Frontend Engineer", duration: "2022–Present" },
      { company: "Freelance", role: "Web Developer", duration: "2021–2022" },
    ],
    strengths: ["UI/UX sensibility", "Component architecture", "Performance optimization"],
    weaknesses: ["Limited backend knowledge"],
    aiRecommendation: "Excellent frontend match — strong React/TypeScript skills.",
  },
  {
    id: "c4", name: "Amina Yusuf", role: "Product Designer", jobId: "j3",
    aiScore: 45, skills: ["Figma", "Sketch"],
    experience: "1 year", education: "HND Design, Yaba Tech",
    stage: "interview", summary: "Junior designer with growing portfolio.",
    workHistory: [
      { company: "Startup Hub Lagos", role: "UI Intern", duration: "2024–Present" },
    ],
    strengths: ["Creative thinking", "Eagerness to learn"],
    weaknesses: ["Limited professional experience", "No user research background"],
    aiRecommendation: "Below average match — may need significant mentoring.",
  },
  {
    id: "c5", name: "Emeka Nwankwo", role: "Backend Developer", jobId: "j1",
    aiScore: 65, skills: ["Java", "Spring Boot", "MySQL"],
    experience: "3 years", education: "BSc Information Technology, FUTO",
    stage: "rejected", summary: "Java developer, different stack from requirements.",
    workHistory: [
      { company: "Access Bank", role: "Software Dev", duration: "2021–2024" },
    ],
    strengths: ["Enterprise experience", "Strong Java skills"],
    weaknesses: ["No Node.js/JavaScript experience"],
    aiRecommendation: "Poor stack match — strong developer but wrong technology focus.",
  },
  {
    id: "c6", name: "Grace Adeyemi", role: "Frontend Developer", jobId: "j2",
    aiScore: 71, skills: ["Vue.js", "JavaScript", "CSS"],
    experience: "2 years", education: "BSc Mathematics, UI",
    stage: "applied", summary: "Vue.js developer looking to transition to React.",
    workHistory: [
      { company: "TechCabal", role: "Frontend Dev", duration: "2023–Present" },
    ],
    strengths: ["JavaScript proficiency", "CSS mastery"],
    weaknesses: ["No React experience"],
    aiRecommendation: "Moderate match — JS skills transfer well but React ramp-up needed.",
  },
];

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: "applied", label: "Applied", color: "bg-blue-500" },
  { key: "shortlisted", label: "Shortlisted", color: "bg-yellow-500" },
  { key: "interview", label: "Interview", color: "bg-purple-500" },
  { key: "hired", label: "Hired", color: "bg-primary" },
  { key: "rejected", label: "Rejected", color: "bg-destructive" },
];

const scoreColor = (score: number) => {
  if (score >= 80) return "text-primary bg-primary/10 border-primary/30";
  if (score >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-300";
  return "text-destructive bg-destructive/10 border-destructive/30";
};

const Applications = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [selectedJob, setSelectedJob] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (selectedJob !== "all" && c.jobId !== selectedJob) return false;
      if (statusFilter !== "all" && c.stage !== statusFilter) return false;
      if (scoreFilter === "high" && c.aiScore < 80) return false;
      if (scoreFilter === "medium" && (c.aiScore < 50 || c.aiScore >= 80)) return false;
      if (scoreFilter === "low" && c.aiScore >= 50) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [candidates, selectedJob, search, statusFilter, scoreFilter]);

  const moveCandidate = (id: string, newStage: Stage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
    );
    toast({ title: `Candidate moved to ${newStage}` });
  };

  const handleDrop = (stage: Stage) => {
    if (draggedId) {
      moveCandidate(draggedId, stage);
      setDraggedId(null);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const CandidateCard = ({ candidate }: { candidate: Candidate }) => (
    <div
      draggable={!isMobile}
      onDragStart={() => setDraggedId(candidate.id)}
      className="border border-border bg-card p-4 rounded-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => setSelectedCandidate(candidate)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{candidate.name}</p>
          <p className="text-xs text-muted-foreground">{candidate.role}</p>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
      </div>
      <div className={cn("inline-flex items-center text-xs font-bold px-2 py-1 border rounded-none mb-3", scoreColor(candidate.aiScore))}>
        <Sparkles className="h-3 w-3 mr-1" />
        {candidate.aiScore}% Match
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {candidate.skills.slice(0, 3).map((s) => (
          <Badge key={s} variant="secondary" className="rounded-none text-[10px] px-1.5 py-0">{s}</Badge>
        ))}
        {candidate.skills.length > 3 && (
          <Badge variant="secondary" className="rounded-none text-[10px] px-1.5 py-0">+{candidate.skills.length - 3}</Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{candidate.experience} experience</p>
      <div className="flex gap-1 mt-3 pt-2 border-t border-border">
        <Button size="sm" variant="ghost" className="h-7 px-2 rounded-none" onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); }}>
          <Eye className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 px-2 rounded-none" onClick={(e) => { e.stopPropagation(); setSelectedCandidate(candidate); setContactOpen(true); }}>
          <MessageSquare className="h-3 w-3" />
        </Button>
        {/* Mobile stage selector */}
        <div className="md:hidden ml-auto">
          <Select value={candidate.stage} onValueChange={(v) => moveCandidate(candidate.id, v as Stage)}>
            <SelectTrigger className="h-7 text-xs rounded-none w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground">Manage and review all job applicants</p>
        </div>
        <Button variant="outline" className="rounded-none w-fit">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      {/* Job Selector */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="rounded-none sm:w-56">
            <SelectValue placeholder="Select job" />
          </SelectTrigger>
          <SelectContent>
            {JOBS.map((j) => (
              <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, skill…"
            className="rounded-none pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="rounded-none sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {STAGES.map((s) => (
              <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={scoreFilter} onValueChange={setScoreFilter}>
          <SelectTrigger className="rounded-none sm:w-40">
            <SelectValue placeholder="AI Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scores</SelectItem>
            <SelectItem value="high">High (80–100)</SelectItem>
            <SelectItem value="medium">Medium (50–79)</SelectItem>
            <SelectItem value="low">Low (&lt;50)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board (Desktop) */}
      <div className="hidden md:grid grid-cols-5 gap-4 min-h-[500px]">
        {STAGES.map((stage) => {
          const columnCandidates = filtered.filter((c) => c.stage === stage.key);
          return (
            <div
              key={stage.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.key)}
              className="border border-border rounded-none bg-muted/30 flex flex-col"
            >
              <div className="p-3 border-b border-border flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", stage.color)} />
                <span className="font-semibold text-sm text-foreground">{stage.label}</span>
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-none">
                  {columnCandidates.length}
                </span>
              </div>
              <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {columnCandidates.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">No applicants</p>
                )}
                {columnCandidates.map((c) => (
                  <CandidateCard key={c.id} candidate={c} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No applicants yet</p>
          </div>
        )}
        {filtered.map((c) => (
          <CandidateCard key={c.id} candidate={c} />
        ))}
      </div>

      {/* Candidate Detail Panel */}
      <Sheet open={!!selectedCandidate && !contactOpen} onOpenChange={(open) => { if (!open) setSelectedCandidate(null); }}>
        <SheetContent className="rounded-none w-full sm:max-w-lg overflow-y-auto">
          {selectedCandidate && (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-xl">{selectedCandidate.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selectedCandidate.role}</p>
                  </div>
                  <div className={cn("flex items-center text-sm font-bold px-3 py-1.5 border rounded-none", scoreColor(selectedCandidate.aiScore))}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    {selectedCandidate.aiScore}%
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="rounded-none w-full grid grid-cols-4">
                  <TabsTrigger value="overview" className="rounded-none text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="experience" className="rounded-none text-xs">Experience</TabsTrigger>
                  <TabsTrigger value="education" className="rounded-none text-xs">Education</TabsTrigger>
                  <TabsTrigger value="ai" className="rounded-none text-xs">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Summary</h4>
                    <p className="text-sm text-muted-foreground">{selectedCandidate.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="rounded-none">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Experience</h4>
                    <p className="text-sm text-muted-foreground">{selectedCandidate.experience}</p>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-3 mt-4">
                  {selectedCandidate.workHistory.map((w, i) => (
                    <div key={i} className="border border-border p-3 rounded-none">
                      <p className="font-semibold text-sm">{w.role}</p>
                      <p className="text-xs text-muted-foreground">{w.company}</p>
                      <p className="text-xs text-muted-foreground">{w.duration}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="education" className="mt-4">
                  <div className="border border-border p-4 rounded-none">
                    <p className="font-semibold text-sm">{selectedCandidate.education}</p>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4 mt-4">
                  <div className="border border-primary/30 bg-primary/5 p-4 rounded-none">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold text-sm">AI Analysis</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">Strengths</p>
                        <ul className="space-y-1">
                          {selectedCandidate.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <ChevronRight className="h-3 w-3 text-primary" />{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-destructive mb-1">Weaknesses</p>
                        <ul className="space-y-1">
                          {selectedCandidate.weaknesses.map((w, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-1.5">
                              <ChevronRight className="h-3 w-3 text-destructive" />{w}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1">Recommendation</p>
                        <p className="text-sm text-muted-foreground italic">"{selectedCandidate.aiRecommendation}"</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                <Button className="rounded-none flex-1" onClick={() => { moveCandidate(selectedCandidate.id, "shortlisted"); setSelectedCandidate(null); }}>
                  Shortlist
                </Button>
                <Button variant="destructive" className="rounded-none flex-1" onClick={() => { moveCandidate(selectedCandidate.id, "rejected"); setSelectedCandidate(null); }}>
                  Reject
                </Button>
                <Button variant="outline" className="rounded-none" onClick={() => setContactOpen(true)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Contact Modal */}
      <Dialog open={contactOpen} onOpenChange={(open) => { setContactOpen(open); if (!open) setContactMessage(""); }}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Contact {selectedCandidate?.name}</DialogTitle>
            <DialogDescription>Send a message to the candidate</DialogDescription>
          </DialogHeader>
          <Textarea
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            placeholder="Write your message…"
            className="rounded-none min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => { setContactOpen(false); setContactMessage(""); }}>
              Cancel
            </Button>
            <Button
              className="rounded-none"
              disabled={!contactMessage.trim()}
              onClick={() => {
                toast({ title: "Message sent!", description: `Your message to ${selectedCandidate?.name} has been sent.` });
                setContactOpen(false);
                setContactMessage("");
              }}
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Applications;
