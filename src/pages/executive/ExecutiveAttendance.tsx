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
import { CheckCircle2, Clock, Download, Settings as SettingsIcon, Calendar as CalendarIcon, Plane, Search, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { execEmployees, downloadCSV, type ExecEmployee } from "./data/employees";

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");
const today = () => new Date().toISOString().slice(0, 10);

interface ClockRecord { date: string; time: string; minutesLate: number; }
interface AttendanceData { [empId: string]: ClockRecord[]; }

interface LeaveRequest { id: string; empId: string; type: string; from: string; to: string; reason: string; status: "pending" | "approved" | "rejected"; }
interface RosterShift { id: string; empId: string; date: string; shift: string; }

const seedHistory = (): AttendanceData => {
  const data: AttendanceData = {};
  execEmployees.forEach((e) => {
    const recs: ClockRecord[] = [];
    for (let i = 1; i <= 20; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const baseMin = 9 * 60;
      const variance = Math.floor((Math.sin(e.id.charCodeAt(4) + i) + 1) * 30) - 15;
      const clockMin = baseMin + variance;
      const h = Math.floor(clockMin / 60), m = clockMin % 60;
      recs.push({
        date: d.toISOString().slice(0, 10),
        time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        minutesLate: Math.max(0, variance),
      });
    }
    data[e.id] = recs;
  });
  return data;
};

const ExecutiveAttendance = () => {
  const [employees] = useState<ExecEmployee[]>(execEmployees);
  const [history, setHistory] = useState<AttendanceData>(seedHistory);
  const [todayClocks, setTodayClocks] = useState<Record<string, ClockRecord>>({});
  const [clockInTime, setClockInTime] = useState("09:00");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const [selected, setSelected] = useState<ExecEmployee | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [rosterOpen, setRosterOpen] = useState(false);

  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: "L-001", empId: "EMP-005", type: "Maternity", from: "2026-04-15", to: "2026-07-15", reason: "Maternity leave", status: "approved" },
    { id: "L-002", empId: "EMP-002", type: "Annual", from: "2026-05-20", to: "2026-05-27", reason: "Family vacation", status: "pending" },
    { id: "L-003", empId: "EMP-007", type: "Sick", from: "2026-05-08", to: "2026-05-09", reason: "Flu recovery", status: "pending" },
  ]);
  const [roster, setRoster] = useState<RosterShift[]>([
    { id: "R-1", empId: "EMP-001", date: today(), shift: "Morning (8am-4pm)" },
    { id: "R-2", empId: "EMP-002", date: today(), shift: "Morning (8am-4pm)" },
    { id: "R-3", empId: "EMP-007", date: today(), shift: "Late (12pm-8pm)" },
  ]);

  const [newLeave, setNewLeave] = useState({ empId: "", type: "Annual", from: "", to: "", reason: "" });
  const [newShift, setNewShift] = useState({ empId: "", date: today(), shift: "Morning (8am-4pm)" });

  const filtered = useMemo(
    () => employees.filter((e) =>
      (deptFilter === "all" || e.department === deptFilter) &&
      (!search || e.name.toLowerCase().includes(search.toLowerCase())),
    ),
    [employees, search, deptFilter],
  );

  const departments = Array.from(new Set(employees.map((e) => e.department)));

  const computePunctuality = (empId: string) => {
    const recs = history[empId] || [];
    if (!recs.length) return 100;
    const onTime = recs.filter((r) => r.minutesLate <= 5).length;
    return Math.round((onTime / recs.length) * 100);
  };

  const stats = useMemo(() => {
    const present = Object.keys(todayClocks).length;
    const onLeave = employees.filter((e) => e.status === "on-leave").length;
    const avgPunct = Math.round(employees.reduce((s, e) => s + computePunctuality(e.id), 0) / employees.length);
    const lowPunct = employees.filter((e) => computePunctuality(e.id) < 50).length;
    return { present, total: employees.length, onLeave, avgPunct, lowPunct };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayClocks, employees, history]);

  const clockIn = (empId: string) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const [eh, em] = clockInTime.split(":").map(Number);
    const minutesLate = Math.max(0, now.getHours() * 60 + now.getMinutes() - (eh * 60 + em));
    const rec: ClockRecord = { date: today(), time, minutesLate };
    setTodayClocks((c) => ({ ...c, [empId]: rec }));
    setHistory((h) => ({ ...h, [empId]: [rec, ...(h[empId] || [])] }));
    const emp = employees.find((e) => e.id === empId);
    toast.success(`${emp?.name} clocked in at ${time}${minutesLate > 0 ? ` (${minutesLate}m late)` : " — on time"}`);
  };

  const exportCSV = () => {
    const rows: (string | number)[][] = [
      ["ID", "Name", "Department", "Today Clock-In", "Min Late Today", "Punctuality %", "Days Tracked"],
      ...filtered.map((e) => {
        const t = todayClocks[e.id];
        return [e.id, e.name, e.department, t?.time || "—", t?.minutesLate ?? "—", computePunctuality(e.id), (history[e.id] || []).length];
      }),
    ];
    downloadCSV(`attendance-${today()}.csv`, rows);
    toast.success("Attendance exported");
  };

  const submitLeave = () => {
    if (!newLeave.empId || !newLeave.from || !newLeave.to) return toast.error("Fill required fields");
    const lr: LeaveRequest = { id: `L-${Date.now().toString().slice(-4)}`, ...newLeave, status: "pending" };
    setLeaves((l) => [lr, ...l]);
    toast.success("Leave request added");
    setLeaveOpen(false);
    setNewLeave({ empId: "", type: "Annual", from: "", to: "", reason: "" });
  };

  const decideLeave = (id: string, status: "approved" | "rejected") => {
    setLeaves((l) => l.map((x) => x.id === id ? { ...x, status } : x));
    toast.success(`Leave ${status}`);
  };

  const addShift = () => {
    if (!newShift.empId || !newShift.date) return toast.error("Pick employee and date");
    setRoster((r) => [{ id: `R-${Date.now().toString().slice(-4)}`, ...newShift }, ...r]);
    toast.success("Shift scheduled");
    setRosterOpen(false);
    setNewShift({ empId: "", date: today(), shift: "Morning (8am-4pm)" });
  };

  const punctBadge = (v: number) => v >= 80 ? "default" : v >= 50 ? "secondary" : "destructive";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Clock employees in, manage rosters and track punctuality.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4" /> Export Excel</Button>
          <Button variant="outline" onClick={() => setSettingsOpen(true)}><SettingsIcon className="w-4 h-4" /> Setup</Button>
          <Button variant="outline" onClick={() => setRosterOpen(true)}><CalendarIcon className="w-4 h-4" /> Schedule Shift</Button>
          <Button onClick={() => setLeaveOpen(true)}><Plane className="w-4 h-4" /> Add Leave</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Present Today", value: `${stats.present}/${stats.total}`, icon: CheckCircle2, color: "text-primary" },
          { label: "On Leave", value: stats.onLeave, icon: Plane, color: "text-amber-500" },
          { label: "Avg Punctuality", value: `${stats.avgPunct}%`, icon: TrendingUp, color: "text-primary" },
          { label: "Low Punctuality (<50%)", value: stats.lowPunct, icon: AlertTriangle, color: "text-destructive" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
              <div className={`p-3 bg-muted rounded-md ${s.color}`}><s.icon className="w-5 h-5" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today's Clock-In</TabsTrigger>
          <TabsTrigger value="leaves">Leave ({leaves.filter((l) => l.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div>
                  <CardTitle>Daily Attendance — {today()}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Expected clock-in: <span className="font-mono font-semibold">{clockInTime}</span></p>
                </div>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Clock-In</TableHead>
                    <TableHead>Punctuality (30d)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e) => {
                    const t = todayClocks[e.id];
                    const p = computePunctuality(e.id);
                    return (
                      <TableRow key={e.id} className="cursor-pointer" onClick={() => { setSelected(e); setSheetOpen(true); }}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9"><AvatarFallback>{initials(e.name)}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-medium">{e.name}</p>
                              <p className="text-xs text-muted-foreground">{e.department}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {t ? (t.minutesLate > 5 ? <Badge variant="destructive">Late {t.minutesLate}m</Badge> : <Badge>On Time</Badge>) : <Badge variant="outline">Pending</Badge>}
                        </TableCell>
                        <TableCell className="font-mono">{t?.time || "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-40">
                            <Progress value={p} className="h-2 flex-1" />
                            <Badge variant={punctBadge(p)}>{p}%</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right" onClick={(ev) => ev.stopPropagation()}>
                          <Button size="sm" disabled={!!t} onClick={() => clockIn(e.id)}>
                            <Clock className="w-4 h-4" /> {t ? "Clocked In" : "Clock In"}
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

        <TabsContent value="leaves">
          <Card>
            <CardHeader><CardTitle>Leave Requests</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((l) => {
                    const emp = employees.find((e) => e.id === l.empId);
                    return (
                      <TableRow key={l.id}>
                        <TableCell>{emp?.name || l.empId}</TableCell>
                        <TableCell><Badge variant="outline">{l.type}</Badge></TableCell>
                        <TableCell>{l.from}</TableCell>
                        <TableCell>{l.to}</TableCell>
                        <TableCell className="max-w-xs truncate">{l.reason}</TableCell>
                        <TableCell><Badge variant={l.status === "approved" ? "default" : l.status === "rejected" ? "destructive" : "secondary"}>{l.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          {l.status === "pending" ? (
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="outline" onClick={() => decideLeave(l.id, "rejected")}>Reject</Button>
                              <Button size="sm" onClick={() => decideLeave(l.id, "approved")}>Approve</Button>
                            </div>
                          ) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roster">
          <Card>
            <CardHeader><CardTitle>Scheduled Shifts</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roster.map((r) => {
                    const emp = employees.find((e) => e.id === r.empId);
                    return (
                      <TableRow key={r.id}>
                        <TableCell>{emp?.name || r.empId}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.shift}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => { setRoster((rs) => rs.filter((x) => x.id !== r.id)); toast.success("Shift removed"); }}>Remove</Button>
                        </TableCell>
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
            const recs = history[selected.id] || [];
            const punct = computePunctuality(selected.id);
            const avgLate = Math.round(recs.reduce((s, r) => s + r.minutesLate, 0) / Math.max(recs.length, 1));
            const lateDays = recs.filter((r) => r.minutesLate > 5).length;
            return (
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
                  <div className="grid grid-cols-3 gap-3">
                    <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Punctuality</p><p className="text-2xl font-bold">{punct}%</p></CardContent></Card>
                    <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Avg Late</p><p className="text-2xl font-bold">{avgLate}m</p></CardContent></Card>
                    <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Late Days</p><p className="text-2xl font-bold">{lateDays}</p></CardContent></Card>
                  </div>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Clock-Ins</CardTitle></CardHeader>
                    <CardContent className="space-y-2 max-h-80 overflow-y-auto">
                      {recs.slice(0, 15).map((r, i) => (
                        <div key={i} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                          <span>{r.date}</span>
                          <span className="font-mono">{r.time}</span>
                          <Badge variant={r.minutesLate > 5 ? "destructive" : "default"} className="text-xs">{r.minutesLate > 0 ? `+${r.minutesLate}m` : "on time"}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Settings dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance Setup</DialogTitle>
            <DialogDescription>Configure expected clock-in time used to score punctuality.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Expected Clock-In Time</Label>
              <Input type="time" value={clockInTime} onChange={(e) => setClockInTime(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">A 5-minute grace window is applied. Anything beyond is counted as late.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => { setSettingsOpen(false); toast.success("Settings saved"); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave dialog */}
      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Leave Request</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Employee</Label>
              <Select value={newLeave.empId} onValueChange={(v) => setNewLeave({ ...newLeave, empId: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={newLeave.type} onValueChange={(v) => setNewLeave({ ...newLeave, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Annual", "Sick", "Maternity", "Paternity", "Bereavement", "Unpaid"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>From</Label><Input type="date" value={newLeave.from} onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })} /></div>
              <div><Label>To</Label><Input type="date" value={newLeave.to} onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })} /></div>
            </div>
            <div><Label>Reason</Label><Textarea value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaveOpen(false)}>Cancel</Button>
            <Button onClick={submitLeave}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Roster dialog */}
      <Dialog open={rosterOpen} onOpenChange={setRosterOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Shift</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Employee</Label>
              <Select value={newShift.empId} onValueChange={(v) => setNewShift({ ...newShift, empId: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Date</Label><Input type="date" value={newShift.date} onChange={(e) => setNewShift({ ...newShift, date: e.target.value })} /></div>
            <div>
              <Label>Shift</Label>
              <Select value={newShift.shift} onValueChange={(v) => setNewShift({ ...newShift, shift: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Morning (8am-4pm)", "Day (9am-5pm)", "Late (12pm-8pm)", "Night (8pm-4am)", "Off"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRosterOpen(false)}>Cancel</Button>
            <Button onClick={addShift}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExecutiveAttendance;
