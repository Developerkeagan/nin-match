import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Download, Wallet, TrendingUp, Send, Plus, Minus, FileText, Users, Calculator } from "lucide-react";
import { toast } from "sonner";
import { execEmployees, downloadCSV, type ExecEmployee } from "./data/employees";

const naira = (n: number) => `₦${n.toLocaleString()}`;
const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

interface PayrollRun { id: string; period: string; total: number; employees: number; status: "draft" | "processed"; date: string; }

const ExecutiveSalary = () => {
  const [employees, setEmployees] = useState<ExecEmployee[]>(execEmployees);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selected, setSelected] = useState<ExecEmployee | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustMode, setAdjustMode] = useState<"raise" | "cut" | "bonus">("raise");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const [memoOpen, setMemoOpen] = useState(false);
  const [memoTarget, setMemoTarget] = useState("all");
  const [memoSubject, setMemoSubject] = useState("");
  const [memoBody, setMemoBody] = useState("");

  const [runOpen, setRunOpen] = useState(false);
  const [runs, setRuns] = useState<PayrollRun[]>([
    { id: "PR-2026-04", period: "April 2026", total: 5980000, employees: 10, status: "processed", date: "2026-04-28" },
    { id: "PR-2026-03", period: "March 2026", total: 5860000, employees: 10, status: "processed", date: "2026-03-28" },
  ]);

  const filtered = useMemo(
    () => employees.filter((e) =>
      (deptFilter === "all" || e.department === deptFilter) &&
      (!search || `${e.name} ${e.role}`.toLowerCase().includes(search.toLowerCase())),
    ),
    [employees, search, deptFilter],
  );

  const totals = useMemo(() => {
    const active = employees.filter((e) => e.status === "active");
    return {
      monthly: active.reduce((s, e) => s + e.salary, 0),
      annual: active.reduce((s, e) => s + e.salary, 0) * 12,
      avg: Math.round(active.reduce((s, e) => s + e.salary, 0) / Math.max(active.length, 1)),
      headcount: active.length,
    };
  }, [employees]);

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const openProfile = (e: ExecEmployee) => { setSelected(e); setSheetOpen(true); };

  const submitAdjust = () => {
    if (!selected) return;
    const amt = Number(adjustAmount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    setEmployees((list) => list.map((e) => {
      if (e.id !== selected.id) return e;
      if (adjustMode === "raise") return { ...e, salary: e.salary + amt };
      if (adjustMode === "cut") return { ...e, salary: Math.max(0, e.salary - amt) };
      return e; // bonus doesn't change base
    }));
    toast.success(`${adjustMode === "bonus" ? "Bonus issued" : adjustMode === "raise" ? "Raise applied" : "Cut applied"} for ${selected.name}`);
    setAdjustOpen(false);
    setAdjustAmount(""); setAdjustReason("");
  };

  const sendMemo = () => {
    if (!memoSubject.trim() || !memoBody.trim()) return toast.error("Subject and body required");
    const recipients = memoTarget === "all" ? employees.length : employees.filter((e) => e.department === memoTarget).length;
    toast.success(`Memo sent to ${recipients} ${recipients === 1 ? "person" : "people"}`);
    setMemoOpen(false); setMemoSubject(""); setMemoBody(""); setMemoTarget("all");
  };

  const runPayroll = () => {
    const period = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
    const newRun: PayrollRun = {
      id: `PR-${Date.now().toString().slice(-6)}`,
      period, total: totals.monthly, employees: totals.headcount,
      status: "processed", date: new Date().toISOString().slice(0, 10),
    };
    setRuns((r) => [newRun, ...r]);
    toast.success(`Payroll for ${period} processed — ${naira(totals.monthly)}`);
    setRunOpen(false);
  };

  const exportCSV = () => {
    const rows: (string | number)[][] = [
      ["ID", "Name", "Email", "Department", "Role", "Level", "Monthly Salary (₦)", "Annual Salary (₦)", "Status"],
      ...filtered.map((e) => [e.id, e.name, e.email, e.department, e.role, e.level, e.salary, e.salary * 12, e.status]),
    ];
    downloadCSV(`salary-export-${Date.now()}.csv`, rows);
    toast.success("Exported salary data");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salary & Payroll</h1>
          <p className="text-muted-foreground">Run payroll, adjust compensation and broadcast salary memos.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4" /> Export Excel</Button>
          <Button variant="outline" onClick={() => setMemoOpen(true)}><Send className="w-4 h-4" /> Salary Memo</Button>
          <Button onClick={() => setRunOpen(true)}><Calculator className="w-4 h-4" /> Run Payroll</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Monthly Payroll", value: naira(totals.monthly), icon: Wallet },
          { label: "Annual Payroll", value: naira(totals.annual), icon: TrendingUp },
          { label: "Avg Salary", value: naira(totals.avg), icon: FileText },
          { label: "Active Employees", value: totals.headcount, icon: Users },
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

      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Employee Salaries</TabsTrigger>
          <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <CardTitle>Salary Roster</CardTitle>
                <div className="flex gap-2 flex-1 md:max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                    <TableHead>Level</TableHead>
                    <TableHead className="text-right">Monthly</TableHead>
                    <TableHead className="text-right">Annual</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => (
                    <TableRow key={e.id}>
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
                      <TableCell>{e.level}</TableCell>
                      <TableCell className="text-right font-mono">{naira(e.salary)}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{naira(e.salary * 12)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openProfile(e)}>View</Button>
                          <Button size="sm" onClick={() => { setSelected(e); setAdjustOpen(true); setAdjustMode("raise"); }}>Adjust</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runs">
          <Card>
            <CardHeader><CardTitle>Payroll History</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run ID</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell>{r.period}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.employees}</TableCell>
                      <TableCell className="text-right font-mono">{naira(r.total)}</TableCell>
                      <TableCell><Badge>{r.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Profile sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14"><AvatarFallback>{initials(selected.name)}</AvatarFallback></Avatar>
                  <div>
                    <SheetTitle>{selected.name}</SheetTitle>
                    <SheetDescription>{selected.role} · {selected.department}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <Card><CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Current monthly</span><span className="font-mono font-semibold">{naira(selected.salary)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Annual gross</span><span className="font-mono">{naira(selected.salary * 12)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Level</span><span>{selected.level}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Joined</span><span>{selected.joinedAt}</span></div>
                </CardContent></Card>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" onClick={() => { setAdjustMode("raise"); setAdjustOpen(true); }}><Plus className="w-4 h-4" /> Raise</Button>
                  <Button variant="outline" onClick={() => { setAdjustMode("cut"); setAdjustOpen(true); }}><Minus className="w-4 h-4" /> Cut</Button>
                  <Button variant="outline" onClick={() => { setAdjustMode("bonus"); setAdjustOpen(true); }}><Wallet className="w-4 h-4" /> Bonus</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Adjust dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{adjustMode === "raise" ? "Apply Raise" : adjustMode === "cut" ? "Apply Cut" : "Issue Bonus"}</DialogTitle>
            <DialogDescription>{selected?.name} — current {naira(selected?.salary || 0)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Type</Label>
              <Select value={adjustMode} onValueChange={(v) => setAdjustMode(v as typeof adjustMode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="raise">Salary Raise</SelectItem>
                  <SelectItem value="cut">Salary Cut</SelectItem>
                  <SelectItem value="bonus">One-off Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (₦)</Label>
              <Input type="number" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} placeholder="50000" />
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} placeholder="Performance bonus, annual review..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancel</Button>
            <Button onClick={submitAdjust}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Memo dialog */}
      <Dialog open={memoOpen} onOpenChange={setMemoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salary Memo</DialogTitle>
            <DialogDescription>Broadcast a salary-related announcement.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Recipients</Label>
              <Select value={memoTarget} onValueChange={setMemoTarget}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everyone</SelectItem>
                  {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Subject</Label><Input value={memoSubject} onChange={(e) => setMemoSubject(e.target.value)} /></div>
            <div><Label>Message</Label><Textarea rows={5} value={memoBody} onChange={(e) => setMemoBody(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemoOpen(false)}>Cancel</Button>
            <Button onClick={sendMemo}><Send className="w-4 h-4" /> Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run payroll dialog */}
      <Dialog open={runOpen} onOpenChange={setRunOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Payroll</DialogTitle>
            <DialogDescription>Process this month's salaries for all active employees.</DialogDescription>
          </DialogHeader>
          <Card><CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Employees</span><span className="font-semibold">{totals.headcount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Period</span><span className="font-semibold">{new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}</span></div>
            <div className="flex justify-between text-base pt-2 border-t"><span>Total</span><span className="font-mono font-bold">{naira(totals.monthly)}</span></div>
          </CardContent></Card>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRunOpen(false)}>Cancel</Button>
            <Button onClick={runPayroll}>Confirm & Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExecutiveSalary;
