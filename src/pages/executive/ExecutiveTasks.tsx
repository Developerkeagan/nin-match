import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus, Search, Filter, ClipboardList, CheckCircle2, Clock, AlertTriangle,
  Calendar, Users, Flag, MessageSquare, Trash2, Edit, Play, Pause, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { execEmployees } from "./data/employees";

type Status = "todo" | "in-progress" | "review" | "done";
type Priority = "low" | "medium" | "high" | "urgent";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  project: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  progress: number;
  comments: { who: string; text: string; at: string }[];
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  lead: string;
  due: string;
  color: string;
}

const initialProjects: Project[] = [
  { id: "P-1", name: "Q1 Platform Revamp", lead: "Chinedu Okoro", due: "2026-03-31", color: "bg-blue-500" },
  { id: "P-2", name: "Sales Pipeline Refresh", lead: "Tolu Adeyinka", due: "2026-02-28", color: "bg-emerald-500" },
  { id: "P-3", name: "Brand Campaign 2026", lead: "Halima Sani", due: "2026-04-15", color: "bg-purple-500" },
  { id: "P-4", name: "Internal Tools", lead: "Kunle Adebanjo", due: "2026-05-30", color: "bg-amber-500" },
];

const seedTasks: Task[] = [
  { id: "T-001", title: "Migrate auth to new identity service", description: "Move all sign-in flows to the unified identity provider.", assignee: "Chinedu Okoro", project: "Q1 Platform Revamp", status: "in-progress", priority: "high", dueDate: "2026-05-20", progress: 60, comments: [{ who: "Chinedu Okoro", text: "Staging deploy ready by Friday", at: "2 days ago" }], createdAt: "2026-04-12" },
  { id: "T-002", title: "Build new analytics dashboard", description: "Replace legacy charts with new design system.", assignee: "Aisha Bello", project: "Q1 Platform Revamp", status: "todo", priority: "medium", dueDate: "2026-06-01", progress: 0, comments: [], createdAt: "2026-04-15" },
  { id: "T-003", title: "Enterprise outreach playbook", description: "Document outbound flow for top 50 enterprise targets.", assignee: "Tolu Adeyinka", project: "Sales Pipeline Refresh", status: "review", priority: "high", dueDate: "2026-05-12", progress: 85, comments: [{ who: "Tolu Adeyinka", text: "Awaiting CRO sign-off", at: "yesterday" }], createdAt: "2026-04-01" },
  { id: "T-004", title: "Launch landing page A/B test", description: "Test new hero variant against control.", assignee: "Halima Sani", project: "Brand Campaign 2026", status: "in-progress", priority: "urgent", dueDate: "2026-05-09", progress: 40, comments: [], createdAt: "2026-04-20" },
  { id: "T-005", title: "Onboard 3 new engineers", description: "Setup laptops, accounts, mentor pairings.", assignee: "Funmi Adesanya", project: "Internal Tools", status: "done", priority: "medium", dueDate: "2026-05-01", progress: 100, comments: [], createdAt: "2026-04-08" },
  { id: "T-006", title: "Quarterly OKR review", description: "Run review session with all team leads.", assignee: "Sade Olawale", project: "Internal Tools", status: "todo", priority: "low", dueDate: "2026-06-15", progress: 0, comments: [], createdAt: "2026-04-22" },
];

const statusMeta: Record<Status, { label: string; color: string; icon: typeof Clock }> = {
  "todo": { label: "To Do", color: "border-l-slate-400 text-slate-700 dark:text-slate-300", icon: ClipboardList },
  "in-progress": { label: "In Progress", color: "border-l-blue-500 text-blue-700 dark:text-blue-400", icon: Play },
  "review": { label: "In Review", color: "border-l-amber-500 text-amber-700 dark:text-amber-400", icon: Pause },
  "done": { label: "Done", color: "border-l-emerald-500 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
};

const priorityMeta: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

const ExecutiveTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [view, setView] = useState<"board" | "list">("board");
  const [open, setOpen] = useState<Task | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [newProjOpen, setNewProjOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [draft, setDraft] = useState({
    title: "", description: "", assignee: execEmployees[0].name,
    project: projects[0].name, priority: "medium" as Priority, dueDate: "",
  });
  const [projDraft, setProjDraft] = useState({ name: "", lead: execEmployees[0].name, due: "" });

  const filtered = useMemo(() => tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.assignee.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterProject !== "all" && t.project !== filterProject) return false;
    return true;
  }), [tasks, search, filterPriority, filterProject]);

  const counts = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter((t) => t.status !== "done" && new Date(t.dueDate) < new Date()).length,
    urgent: tasks.filter((t) => t.priority === "urgent" && t.status !== "done").length,
  };

  const grouped = (s: Status) => filtered.filter((t) => t.status === s);

  const moveStatus = (id: string, status: Status) => {
    setTasks((p) => p.map((t) => t.id === id ? {
      ...t, status, progress: status === "done" ? 100 : t.progress,
    } : t));
    if (open?.id === id) setOpen({ ...open, status, progress: status === "done" ? 100 : open.progress });
    toast.success(`Task moved to ${statusMeta[status].label}`);
  };

  const setProgress = (id: string, progress: number) => {
    setTasks((p) => p.map((t) => t.id === id ? { ...t, progress, status: progress === 100 ? "done" : t.status } : t));
    if (open?.id === id) setOpen({ ...open, progress });
  };

  const deleteTask = (id: string) => {
    setTasks((p) => p.filter((t) => t.id !== id));
    setOpen(null);
    toast.success("Task deleted");
  };

  const addComment = () => {
    if (!open || !newComment.trim()) return;
    const c = { who: "Acme Corp Admin", text: newComment.trim(), at: "just now" };
    setTasks((p) => p.map((t) => t.id === open.id ? { ...t, comments: [...t.comments, c] } : t));
    setOpen({ ...open, comments: [...open.comments, c] });
    setNewComment("");
    toast.success("Comment added");
  };

  const createTask = () => {
    if (!draft.title.trim() || !draft.dueDate) {
      toast.error("Title and due date are required");
      return;
    }
    const t: Task = {
      id: `T-${String(tasks.length + 100).padStart(3, "0")}`,
      ...draft, status: "todo", progress: 0, comments: [], createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks((p) => [t, ...p]);
    setNewOpen(false);
    setDraft({ title: "", description: "", assignee: execEmployees[0].name, project: projects[0].name, priority: "medium", dueDate: "" });
    toast.success("Task created");
  };

  const createProject = () => {
    if (!projDraft.name.trim() || !projDraft.due) { toast.error("Name and due date required"); return; }
    const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-pink-500"];
    setProjects((p) => [...p, { id: `P-${p.length + 1}`, ...projDraft, color: colors[p.length % colors.length] }]);
    setNewProjOpen(false);
    setProjDraft({ name: "", lead: execEmployees[0].name, due: "" });
    toast.success("Project created");
  };

  const initials = (n: string) => n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const isOverdue = (t: Task) => t.status !== "done" && new Date(t.dueDate) < new Date();

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Tasks & Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Assign work, track progress and monitor team workloads</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-none" onClick={() => setNewProjOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Project
          </Button>
          <Button className="rounded-none" onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Tasks", value: counts.total, icon: ClipboardList, color: "text-primary" },
          { label: "Completed", value: counts.done, icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Overdue", value: counts.overdue, icon: AlertTriangle, color: "text-red-600" },
          { label: "Urgent Open", value: counts.urgent, icon: Flag, color: "text-amber-600" },
        ].map((k) => (
          <Card key={k.label} className="rounded-none border">
            <CardContent className="p-4 flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold font-display text-foreground mt-1">{k.value}</p>
              </div>
              <div className={`p-2 bg-muted rounded-none ${k.color}`}><k.icon className="h-5 w-5" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-none border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {projects.map((p) => {
            const projTasks = tasks.filter((t) => t.project === p.name);
            const done = projTasks.filter((t) => t.status === "done").length;
            const pct = projTasks.length ? (done / projTasks.length) * 100 : 0;
            return (
              <button key={p.id} onClick={() => setFilterProject(p.name)} className="text-left">
                <div className="border p-3 hover:border-primary/50 transition-colors h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 ${p.color}`} />
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Lead: {p.lead}</p>
                  <p className="text-[11px] text-muted-foreground">Due: {p.due}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{done}/{projTasks.length} done</span>
                    <span className="font-semibold text-foreground">{pct.toFixed(0)}%</span>
                  </div>
                  <Progress value={pct} className="h-1 rounded-none [&>div]:rounded-none mt-1" />
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="rounded-none border">
        <CardHeader className="pb-3 space-y-3">
          <div className="flex flex-col lg:flex-row gap-2 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks or assignees..." className="pl-9 rounded-none" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-[170px] rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projects.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[140px] rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Tabs value={view} onValueChange={(v) => setView(v as "board" | "list")}>
                <TabsList className="rounded-none">
                  <TabsTrigger value="board" className="rounded-none">Board</TabsTrigger>
                  <TabsTrigger value="list" className="rounded-none">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {view === "board" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {(Object.keys(statusMeta) as Status[]).map((s) => {
                const M = statusMeta[s];
                const items = grouped(s);
                return (
                  <div key={s} className="bg-muted/40 p-2 min-h-[200px]">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-2">
                        <M.icon className="h-3.5 w-3.5" />
                        <p className="text-xs font-semibold uppercase tracking-wide">{M.label}</p>
                      </div>
                      <Badge variant="outline" className="rounded-none text-[10px]">{items.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {items.length === 0 && <p className="text-[11px] text-muted-foreground/70 px-1 py-4 text-center">No tasks</p>}
                      {items.map((t) => (
                        <button key={t.id} onClick={() => setOpen(t)} className="w-full text-left">
                          <div className={`bg-background border-l-4 ${M.color} p-2.5 hover:shadow-sm transition-shadow`}>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">{t.title}</p>
                              <Badge className={`rounded-none text-[9px] ${priorityMeta[t.priority]}`}>{t.priority}</Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-1 truncate">{t.project}</p>
                            {t.progress > 0 && t.status !== "done" && (
                              <Progress value={t.progress} className="h-1 rounded-none [&>div]:rounded-none mt-2" />
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[9px] bg-primary/15 text-primary">{initials(t.assignee)}</AvatarFallback>
                              </Avatar>
                              <span className={`text-[10px] flex items-center gap-1 ${isOverdue(t) ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>
                                <Calendar className="h-3 w-3" /> {t.dueDate}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border">
              {filtered.length === 0 && <p className="text-sm text-muted-foreground p-6 text-center">No tasks match your filters</p>}
              {filtered.map((t) => (
                <div key={t.id} className="border-b last:border-b-0 p-3 hover:bg-muted/40 cursor-pointer" onClick={() => setOpen(t)}>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarFallback className="text-[10px] bg-primary/15 text-primary">{initials(t.assignee)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{t.title}</p>
                        <div className="flex items-center gap-1.5">
                          <Badge className={`rounded-none text-[10px] ${priorityMeta[t.priority]}`}>{t.priority}</Badge>
                          <Badge variant="outline" className="rounded-none text-[10px]">{statusMeta[t.status].label}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground flex-wrap">
                        <span>{t.assignee}</span>
                        <span>· {t.project}</span>
                        <span className={isOverdue(t) ? "text-red-600 font-semibold" : ""}>· Due {t.dueDate}</span>
                        <span>· {t.progress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task detail sheet */}
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {open && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Badge className={`rounded-none text-[10px] mb-2 ${priorityMeta[open.priority]}`}>{open.priority} priority</Badge>
                    <SheetTitle className="text-xl">{open.title}</SheetTitle>
                    <SheetDescription>{open.id} · {open.project}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Description</Label>
                  <p className="text-sm text-foreground mt-1">{open.description || "No description provided"}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Assignee</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-primary/15 text-primary">{initials(open.assignee)}</AvatarFallback></Avatar>
                      <span className="text-foreground">{open.assignee}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Due Date</Label>
                    <p className={`mt-1 ${isOverdue(open) ? "text-red-600 font-semibold" : "text-foreground"}`}>{open.dueDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Created</Label>
                    <p className="text-foreground mt-1">{open.createdAt}</p>
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Status</Label>
                    <Badge variant="outline" className="rounded-none mt-1 text-xs">{statusMeta[open.status].label}</Badge>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs uppercase text-muted-foreground">Progress</Label>
                    <span className="text-sm font-semibold text-foreground">{open.progress}%</span>
                  </div>
                  <input type="range" min={0} max={100} step={5} value={open.progress}
                    onChange={(e) => setProgress(open.id, Number(e.target.value))}
                    className="w-full mt-2 accent-primary" />
                </div>

                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Move to</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(Object.keys(statusMeta) as Status[]).map((s) => (
                      <Button key={s} size="sm" variant={open.status === s ? "default" : "outline"}
                        className="rounded-none justify-start" onClick={() => moveStatus(open.id, s)}>
                        <ArrowRight className="h-3.5 w-3.5 mr-2" /> {statusMeta[s].label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs uppercase text-muted-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" /> Comments ({open.comments.length})
                  </Label>
                  <div className="space-y-2 mt-2">
                    {open.comments.map((c, i) => (
                      <div key={i} className="bg-muted/50 p-2.5 border-l-2 border-primary">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground">{c.who}</span>
                          <span>{c.at}</span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{c.text}</p>
                      </div>
                    ))}
                    {open.comments.length === 0 && <p className="text-xs text-muted-foreground">No comments yet</p>}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Input placeholder="Write a comment..." className="rounded-none" value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addComment()} />
                    <Button className="rounded-none" onClick={addComment}>Post</Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" className="rounded-none flex-1" onClick={() => toast.info("Edit mode coming soon — adjust fields above")}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" className="rounded-none" onClick={() => deleteTask(open.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* New task dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-lg rounded-none">
          <DialogHeader>
            <DialogTitle>Create new task</DialogTitle>
            <DialogDescription>Assign work to a team member with a clear deadline.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input className="rounded-none" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Review Q2 marketing budget" />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea className="rounded-none" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Assignee</Label>
                <Select value={draft.assignee} onValueChange={(v) => setDraft({ ...draft, assignee: v })}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent>{execEmployees.map((e) => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Project</Label>
                <Select value={draft.project} onValueChange={(v) => setDraft({ ...draft, project: v })}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v as Priority })}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Due date</Label>
                <Input type="date" className="rounded-none" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button className="rounded-none" onClick={createTask}>Create task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New project dialog */}
      <Dialog open={newProjOpen} onOpenChange={setNewProjOpen}>
        <DialogContent className="sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
            <DialogDescription>Group related tasks under a project.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Project name</Label>
              <Input className="rounded-none" value={projDraft.name} onChange={(e) => setProjDraft({ ...projDraft, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Project lead</Label>
              <Select value={projDraft.lead} onValueChange={(v) => setProjDraft({ ...projDraft, lead: v })}>
                <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                <SelectContent>{execEmployees.map((e) => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Target due date</Label>
              <Input type="date" className="rounded-none" value={projDraft.due} onChange={(e) => setProjDraft({ ...projDraft, due: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setNewProjOpen(false)}>Cancel</Button>
            <Button className="rounded-none" onClick={createProject}>Create project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExecutiveTasks;
