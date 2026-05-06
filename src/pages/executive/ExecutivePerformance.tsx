import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Search, Award, TrendingUp, Target, Star, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { execEmployees, type ExecEmployee } from "./data/employees";

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Radar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, ArcElement, Title, Tooltip, Legend, Filler);

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

interface Goal { id: string; empId: string; title: string; progress: number; due: string; status: "on-track" | "at-risk" | "completed"; }
interface Review { id: string; empId: string; period: string; rating: number; reviewer: string; notes: string; date: string; }

const seedGoals: Goal[] = [
  { id: "G-1", empId: "EMP-001", title: "Ship v3 platform release", progress: 75, due: "2026-06-30", status: "on-track" },
  { id: "G-2", empId: "EMP-002", title: "Hit ₦60M Q2 sales", progress: 48, due: "2026-06-30", status: "at-risk" },
  { id: "G-3", empId: "EMP-003", title: "Brand campaign launch", progress: 100, due: "2026-04-15", status: "completed" },
  { id: "G-4", empId: "EMP-007", title: "Reduce API latency 30%", progress: 62, due: "2026-07-01", status: "on-track" },
];

const seedReviews: Review[] = [
  { id: "R-1", empId: "EMP-001", period: "Q1 2026", rating: 4.8, reviewer: "CEO", notes: "Outstanding leadership.", date: "2026-04-05" },
  { id: "R-2", empId: "EMP-006", period: "Q1 2026", rating: 4.6, reviewer: "CFO", notes: "Excellent financial discipline.", date: "2026-04-07" },
  { id: "R-3", empId: "EMP-002", period: "Q1 2026", rating: 4.4, reviewer: "CEO", notes: "Strong sales execution, pipeline healthy.", date: "2026-04-06" },
];

const ExecutivePerformance = () => {
  const [employees] = useState<ExecEmployee[]>(execEmployees);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const [selected, setSelected] = useState<ExecEmployee | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [goals, setGoals] = useState<Goal[]>(seedGoals);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);

  const [goalOpen, setGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ empId: "", title: "", due: "" });

  const [reviewOpen, setReviewOpen] = useState(false);
  const [newReview, setNewReview] = useState({ empId: "", period: "Q2 2026", rating: 4, reviewer: "CEO", notes: "" });

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const filtered = useMemo(
    () => employees.filter((e) =>
      (deptFilter === "all" || e.department === deptFilter) &&
      (!search || e.name.toLowerCase().includes(search.toLowerCase())),
    ),
    [employees, search, deptFilter],
  );

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const stats = useMemo(() => {
    const avg = Math.round(employees.reduce((s, e) => s + e.performance, 0) / employees.length);
    const top = employees.filter((e) => e.performance >= 85).length;
    const lagging = employees.filter((e) => e.performance < 75).length;
    const completedGoals = goals.filter((g) => g.status === "completed").length;
    return { avg, top, lagging, completedGoals };
  }, [employees, goals]);

  // Charts
  const colors = {
    primary: "hsl(95, 90%, 25%)",
    primaryAlpha: "hsla(95, 90%, 25%, 0.2)",
    accent: "hsl(95, 70%, 45%)",
    muted: "hsl(220, 13%, 60%)",
  };

  const deptPerf = departments.map((d) => {
    const inDept = employees.filter((e) => e.department === d);
    return Math.round(inDept.reduce((s, e) => s + e.performance, 0) / Math.max(inDept.length, 1));
  });

  const barData = {
    labels: departments,
    datasets: [{ label: "Avg Performance", data: deptPerf, backgroundColor: colors.primary, borderRadius: 6 }],
  };

  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      { label: "Company Avg", data: [78, 80, 82, 84, stats.avg], borderColor: colors.primary, backgroundColor: colors.primaryAlpha, fill: true, tension: 0.4 },
      { label: "Top Quartile", data: [88, 89, 90, 91, 92], borderColor: colors.accent, backgroundColor: "transparent", tension: 0.4 },
    ],
  };

  const radarData = {
    labels: ["Productivity", "Quality", "Collaboration", "Initiative", "Reliability", "Leadership"],
    datasets: [{
      label: "Company avg",
      data: [82, 85, 88, 78, 84, 80],
      backgroundColor: colors.primaryAlpha,
      borderColor: colors.primary,
      pointBackgroundColor: colors.primary,
    }],
  };

  const ratingDist = [0, 0, 0, 0, 0]; // 1..5
  employees.forEach((e) => {
    const idx = Math.min(4, Math.max(0, Math.floor(e.performance / 20)));
    ratingDist[idx]++;
  });
  const doughnutData = {
    labels: ["1★", "2★", "3★", "4★", "5★"],
    datasets: [{ data: ratingDist, backgroundColor: ["#ef4444", "#f97316", "#eab308", "#84cc16", colors.primary], borderWidth: 0 }],
  };

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" as const } } };

  const addGoal = () => {
    if (!newGoal.empId || !newGoal.title || !newGoal.due) return toast.error("Fill all fields");
    setGoals((g) => [{ id: `G-${Date.now().toString().slice(-4)}`, empId: newGoal.empId, title: newGoal.title, due: newGoal.due, progress: 0, status: "on-track" }, ...g]);
    toast.success("Goal added");
    setGoalOpen(false);
    setNewGoal({ empId: "", title: "", due: "" });
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setGoals((gs) => gs.map((g) => {
      if (g.id !== id) return g;
      const p = Math.max(0, Math.min(100, g.progress + delta));
      return { ...g, progress: p, status: p >= 100 ? "completed" : p < 50 ? "at-risk" : "on-track" };
    }));
  };

  const submitReview = () => {
    if (!newReview.empId || !newReview.notes) return toast.error("Pick employee and add notes");
    setReviews((r) => [{ id: `R-${Date.now().toString().slice(-4)}`, ...newReview, date: new Date().toISOString().slice(0, 10) }, ...r]);
    toast.success("Review submitted");
    setReviewOpen(false);
    setNewReview({ empId: "", period: "Q2 2026", rating: 4, reviewer: "CEO", notes: "" });
  };

  const sendFeedback = () => {
    if (!feedback.trim() || !selected) return toast.error("Write feedback");
    toast.success(`Feedback sent to ${selected.name}`);
    setFeedbackOpen(false);
    setFeedback("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground">Track goals, run reviews and analyse team performance.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setGoalOpen(true)}><Target className="w-4 h-4" /> New Goal</Button>
          <Button onClick={() => setReviewOpen(true)}><Star className="w-4 h-4" /> Run Review</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Avg Performance", value: `${stats.avg}%`, icon: TrendingUp },
          { label: "Top Performers", value: stats.top, icon: Award },
          { label: "Needs Attention", value: stats.lagging, icon: Target },
          { label: "Goals Completed", value: stats.completedGoals, icon: Star },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-md"><s.icon className="w-5 h-5" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Performance by Department</CardTitle></CardHeader>
          <CardContent><div className="h-72"><Bar data={barData} options={chartOpts} /></div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>5-Month Trend</CardTitle></CardHeader>
          <CardContent><div className="h-72"><Line data={trendData} options={chartOpts} /></div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Competency Radar</CardTitle></CardHeader>
          <CardContent><div className="h-72"><Radar data={radarData} options={chartOpts} /></div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rating Distribution</CardTitle></CardHeader>
          <CardContent><div className="h-72"><Doughnut data={doughnutData} options={chartOpts} /></div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="people">
        <TabsList>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="goals">Goals ({goals.length})</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="people">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <CardTitle>Performance Roster</CardTitle>
                <div className="flex gap-2 flex-1 md:max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Select value={deptFilter} onValueChange={setDeptFilter}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Depts</SelectItem>
                      {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Goals</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => {
                    const empGoals = goals.filter((g) => g.empId === e.id);
                    return (
                      <TableRow key={e.id} className="cursor-pointer" onClick={() => { setSelected(e); setSheetOpen(true); }}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9"><AvatarFallback>{initials(e.name)}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-medium">{e.name}</p>
                              <p className="text-xs text-muted-foreground">{e.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{e.department}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-40">
                            <Progress value={e.performance} className="h-2 flex-1" />
                            <span className="font-mono text-sm font-semibold">{e.performance}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{empGoals.length}</TableCell>
                        <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                          <Button size="sm" onClick={() => { setSelected(e); setFeedbackOpen(true); }}>
                            <MessageSquare className="w-4 h-4" /> Feedback
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardContent className="pt-6 space-y-3">
              {goals.map((g) => {
                const emp = employees.find((e) => e.id === g.empId);
                return (
                  <div key={g.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{emp?.name} · due {g.due}</p>
                      </div>
                      <Badge variant={g.status === "completed" ? "default" : g.status === "at-risk" ? "destructive" : "secondary"}>{g.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={g.progress} className="h-2 flex-1" />
                      <span className="font-mono text-sm w-12 text-right">{g.progress}%</span>
                      <Button size="sm" variant="outline" onClick={() => updateGoalProgress(g.id, -10)}>-10</Button>
                      <Button size="sm" onClick={() => updateGoalProgress(g.id, 10)}>+10</Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((r) => {
                    const emp = employees.find((e) => e.id === r.empId);
                    return (
                      <TableRow key={r.id}>
                        <TableCell>{emp?.name || r.empId}</TableCell>
                        <TableCell>{r.period}</TableCell>
                        <TableCell><Badge>{r.rating} ★</Badge></TableCell>
                        <TableCell>{r.reviewer}</TableCell>
                        <TableCell className="max-w-sm truncate">{r.notes}</TableCell>
                        <TableCell>{r.date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (() => {
            const empGoals = goals.filter((g) => g.empId === selected.id);
            const empReviews = reviews.filter((r) => r.empId === selected.id);
            const personalRadar = {
              labels: ["Productivity", "Quality", "Collaboration", "Initiative", "Reliability", "Leadership"],
              datasets: [{
                label: selected.name,
                data: [selected.performance, selected.performance - 4, selected.performance + 2, selected.performance - 6, selected.performance, selected.performance - 8].map((v) => Math.max(40, Math.min(100, v))),
                backgroundColor: colors.primaryAlpha, borderColor: colors.primary, pointBackgroundColor: colors.primary,
              }],
            };
            return (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-14 h-14"><AvatarFallback>{initials(selected.name)}</AvatarFallback></Avatar>
                    <div>
                      <SheetTitle>{selected.name}</SheetTitle>
                      <SheetDescription>{selected.role} · Score {selected.performance}%</SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="h-64"><Radar data={personalRadar} options={chartOpts} /></div>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Active Goals</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {empGoals.length ? empGoals.map((g) => (
                        <div key={g.id}>
                          <p className="text-sm">{g.title}</p>
                          <Progress value={g.progress} className="h-2 mt-1" />
                        </div>
                      )) : <p className="text-sm text-muted-foreground">No goals yet.</p>}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Reviews</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {empReviews.length ? empReviews.map((r) => (
                        <div key={r.id} className="text-sm py-2 border-b last:border-0">
                          <div className="flex justify-between"><span className="font-medium">{r.period}</span><Badge>{r.rating}★</Badge></div>
                          <p className="text-muted-foreground text-xs mt-1">{r.notes}</p>
                        </div>
                      )) : <p className="text-sm text-muted-foreground">No reviews yet.</p>}
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => { setNewGoal({ empId: selected.id, title: "", due: "" }); setGoalOpen(true); setSheetOpen(false); }}><Plus className="w-4 h-4" /> Add Goal</Button>
                    <Button onClick={() => { setFeedbackOpen(true); setSheetOpen(false); }}><MessageSquare className="w-4 h-4" /> Feedback</Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Goal dialog */}
      <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Goal</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Employee</Label>
              <Select value={newGoal.empId} onValueChange={(v) => setNewGoal({ ...newGoal, empId: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Title</Label><Input value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} /></div>
            <div><Label>Due date</Label><Input type="date" value={newGoal.due} onChange={(e) => setNewGoal({ ...newGoal, due: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalOpen(false)}>Cancel</Button>
            <Button onClick={addGoal}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Performance Review</DialogTitle>
            <DialogDescription>Record a quarterly review for an employee.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Employee</Label>
              <Select value={newReview.empId} onValueChange={(v) => setNewReview({ ...newReview, empId: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Period</Label><Input value={newReview.period} onChange={(e) => setNewReview({ ...newReview, period: e.target.value })} /></div>
              <div>
                <Label>Rating (1-5)</Label>
                <Input type="number" min={1} max={5} step={0.1} value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })} />
              </div>
            </div>
            <div><Label>Reviewer</Label><Input value={newReview.reviewer} onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })} /></div>
            <div><Label>Notes</Label><Textarea rows={4} value={newReview.notes} onChange={(e) => setNewReview({ ...newReview, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button onClick={submitReview}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send Feedback</DialogTitle><DialogDescription>{selected?.name}</DialogDescription></DialogHeader>
          <Textarea rows={5} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share specific, constructive feedback..." />
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
            <Button onClick={sendFeedback}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExecutivePerformance;
