import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  UserPlus,
  Eye,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Mail,
  Wallet,
  UserMinus,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  salary: number;
  status: "active" | "on-leave" | "terminated";
  joinedAt: string;
  location: string;
  performance: number;
  level: "Junior" | "Mid" | "Senior" | "Lead" | "Manager";
  history: { date: string; event: string }[];
}

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "Chinedu Okoro", email: "chinedu@acmecorp.io", phone: "+234 803 111 2233", role: "Engineering Lead", department: "Engineering", salary: 850000, status: "active", joinedAt: "2022-03-14", location: "Lagos, NG", performance: 92, level: "Lead", history: [{ date: "2024-01-10", event: "Promoted to Lead" }, { date: "2023-06-01", event: "Salary raise +15%" }] },
  { id: "EMP-002", name: "Tolu Adeyinka", email: "tolu@acmecorp.io", phone: "+234 805 222 4455", role: "Sales Manager", department: "Sales", salary: 720000, status: "active", joinedAt: "2021-08-22", location: "Abuja, NG", performance: 88, level: "Manager", history: [{ date: "2024-02-15", event: "Bonus issued ₦150k" }] },
  { id: "EMP-003", name: "Halima Sani", email: "halima@acmecorp.io", phone: "+234 807 333 6677", role: "Marketing Director", department: "Marketing", salary: 780000, status: "active", joinedAt: "2020-11-03", location: "Kano, NG", performance: 85, level: "Manager", history: [] },
  { id: "EMP-004", name: "Kunle Adebanjo", email: "kunle@acmecorp.io", phone: "+234 809 444 8899", role: "Operations Lead", department: "Operations", salary: 650000, status: "active", joinedAt: "2022-06-18", location: "Lagos, NG", performance: 80, level: "Lead", history: [] },
  { id: "EMP-005", name: "Mary Johnson", email: "mary@acmecorp.io", phone: "+234 811 555 0011", role: "Support Manager", department: "Customer Support", salary: 520000, status: "on-leave", joinedAt: "2023-02-09", location: "Port Harcourt, NG", performance: 78, level: "Manager", history: [{ date: "2024-09-01", event: "Maternity leave started" }] },
  { id: "EMP-006", name: "Sade Olawale", email: "sade@acmecorp.io", phone: "+234 813 666 2244", role: "Finance Manager", department: "Finance", salary: 690000, status: "active", joinedAt: "2021-04-25", location: "Lagos, NG", performance: 90, level: "Manager", history: [] },
  { id: "EMP-007", name: "Ifeanyi Eze", email: "ifeanyi@acmecorp.io", phone: "+234 815 777 3355", role: "Senior Engineer", department: "Engineering", salary: 580000, status: "active", joinedAt: "2023-01-15", location: "Lagos, NG", performance: 86, level: "Senior", history: [] },
  { id: "EMP-008", name: "Aisha Bello", email: "aisha@acmecorp.io", phone: "+234 817 888 4466", role: "Product Designer", department: "Engineering", salary: 460000, status: "active", joinedAt: "2023-09-04", location: "Abuja, NG", performance: 82, level: "Mid", history: [] },
  { id: "EMP-009", name: "Emeka Nwosu", email: "emeka@acmecorp.io", phone: "+234 819 999 5577", role: "Sales Executive", department: "Sales", salary: 320000, status: "active", joinedAt: "2024-02-20", location: "Lagos, NG", performance: 74, level: "Junior", history: [] },
  { id: "EMP-010", name: "Funmi Adesanya", email: "funmi@acmecorp.io", phone: "+234 802 101 6688", role: "HR Specialist", department: "Operations", salary: 410000, status: "active", joinedAt: "2022-12-01", location: "Lagos, NG", performance: 84, level: "Mid", history: [] },
];

type ActionMode = null | "salary" | "message" | "promote" | "demote" | "terminate" | "add";

const departments = ["Engineering", "Sales", "Marketing", "Operations", "Customer Support", "Finance"];
const levels: Employee["level"][] = ["Junior", "Mid", "Senior", "Lead", "Manager"];

const ExecutiveWorkforce = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [action, setAction] = useState<ActionMode>(null);

  // action form state
  const [salaryDelta, setSalaryDelta] = useState("");
  const [salaryReason, setSalaryReason] = useState("");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [newLevel, setNewLevel] = useState<string>("");
  const [newRole, setNewRole] = useState("");
  const [terminateReason, setTerminateReason] = useState("");

  // add employee
  const [newEmp, setNewEmp] = useState({ name: "", email: "", role: "", department: "Engineering", salary: "", level: "Mid" as Employee["level"], location: "" });

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (search && !`${e.name} ${e.email} ${e.role}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (deptFilter !== "all" && e.department !== deptFilter) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      return true;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const totals = useMemo(() => {
    const active = employees.filter((e) => e.status === "active");
    return {
      total: employees.length,
      active: active.length,
      payroll: active.reduce((s, e) => s + e.salary, 0),
      avgPerf: Math.round(active.reduce((s, e) => s + e.performance, 0) / Math.max(active.length, 1)),
    };
  }, [employees]);

  const openDetails = (emp: Employee) => {
    setSelected(emp);
    setSheetOpen(true);
  };

  const openAction = (emp: Employee, mode: Exclude<ActionMode, null | "add">) => {
    setSelected(emp);
    setSheetOpen(false);
    setAction(mode);
    setSalaryDelta("");
    setSalaryReason("");
    setMsgSubject("");
    setMsgBody("");
    setNewLevel(emp.level);
    setNewRole(emp.role);
    setTerminateReason("");
  };

  const updateEmp = (id: string, patch: Partial<Employee>, eventLabel: string) => {
    setEmployees((list) =>
      list.map((e) =>
        e.id === id
          ? { ...e, ...patch, history: [{ date: new Date().toISOString().slice(0, 10), event: eventLabel }, ...e.history] }
          : e,
      ),
    );
  };

  const submitSalary = () => {
    if (!selected) return;
    const delta = Number(salaryDelta);
    if (!delta) {
      toast.error("Enter a valid salary change");
      return;
    }
    const newSalary = Math.max(0, selected.salary + delta);
    updateEmp(selected.id, { salary: newSalary }, `Salary ${delta > 0 ? "raise" : "reduction"} ${delta > 0 ? "+" : ""}₦${delta.toLocaleString()} — ${salaryReason || "no reason"}`);
    toast.success(`Salary updated for ${selected.name}`);
    setAction(null);
  };

  const submitMessage = () => {
    if (!selected || !msgSubject.trim() || !msgBody.trim()) {
      toast.error("Subject and message required");
      return;
    }
    updateEmp(selected.id, {}, `Message sent: "${msgSubject}"`);
    toast.success(`Message sent to ${selected.name}`);
    setAction(null);
  };

  const submitPromote = () => {
    if (!selected) return;
    updateEmp(selected.id, { level: newLevel as Employee["level"], role: newRole }, `Promoted to ${newLevel} — ${newRole}`);
    toast.success(`${selected.name} promoted to ${newLevel}`);
    setAction(null);
  };

  const submitDemote = () => {
    if (!selected) return;
    updateEmp(selected.id, { level: newLevel as Employee["level"], role: newRole }, `Demoted to ${newLevel} — ${newRole}`);
    toast.success(`${selected.name} reassigned to ${newLevel}`);
    setAction(null);
  };

  const submitTerminate = () => {
    if (!selected) return;
    updateEmp(selected.id, { status: "terminated" }, `Terminated — ${terminateReason || "no reason"}`);
    toast.success(`${selected.name} has been offboarded`);
    setAction(null);
  };

  const submitAdd = () => {
    if (!newEmp.name || !newEmp.email || !newEmp.role || !newEmp.salary) {
      toast.error("Fill required fields");
      return;
    }
    const id = `EMP-${String(employees.length + 1).padStart(3, "0")}`;
    setEmployees((list) => [
      {
        id,
        name: newEmp.name,
        email: newEmp.email,
        phone: "—",
        role: newEmp.role,
        department: newEmp.department,
        salary: Number(newEmp.salary),
        status: "active",
        joinedAt: new Date().toISOString().slice(0, 10),
        location: newEmp.location || "—",
        performance: 70,
        level: newEmp.level,
        history: [{ date: new Date().toISOString().slice(0, 10), event: "Joined company" }],
      },
      ...list,
    ]);
    toast.success(`${newEmp.name} added to workforce`);
    setNewEmp({ name: "", email: "", role: "", department: "Engineering", salary: "", level: "Mid", location: "" });
    setAction(null);
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Name", "Email", "Role", "Department", "Level", "Salary", "Status", "Joined"],
      ...employees.map((e) => [e.id, e.name, e.email, e.role, e.department, e.level, e.salary, e.status, e.joinedAt]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "workforce.csv";
    a.click();
    toast.success("Exported workforce.csv");
  };

  const statusBadge = (s: Employee["status"]) => {
    const cfg = {
      active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      "on-leave": "bg-amber-500/10 text-amber-600 border-amber-500/20",
      terminated: "bg-destructive/10 text-destructive border-destructive/20",
    }[s];
    return <Badge variant="outline" className={`rounded-none ${cfg} capitalize text-[10px]`}>{s}</Badge>;
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Workforce</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage employees, salaries, promotions and offboarding</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="rounded-none" onClick={() => setAction("add")}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Employees", value: totals.total, icon: Briefcase },
          { label: "Active", value: totals.active, icon: TrendingUp },
          { label: "Monthly Payroll", value: `₦${(totals.payroll / 1_000_000).toFixed(1)}M`, icon: Wallet },
          { label: "Avg Performance", value: `${totals.avgPerf}%`, icon: Award },
        ].map((k) => (
          <Card key={k.label} className="rounded-none border">
            <CardContent className="p-4 flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold font-display text-foreground mt-1">{k.value}</p>
              </div>
              <div className="p-2 bg-muted rounded-none text-primary">
                <k.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="rounded-none border">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9 rounded-none" placeholder="Search by name, email or role..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="md:w-48 rounded-none"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-40 rounded-none"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-none border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Employees ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {e.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{e.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{e.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{e.department}</TableCell>
                    <TableCell><Badge variant="secondary" className="rounded-none text-[10px]">{e.level}</Badge></TableCell>
                    <TableCell className="text-sm font-medium">₦{e.salary.toLocaleString()}</TableCell>
                    <TableCell>{statusBadge(e.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openDetails(e)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => openAction(e, "salary")}><Wallet className="h-4 w-4 mr-2" /> Adjust Salary</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openAction(e, "message")}><Mail className="h-4 w-4 mr-2" /> Send Message</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openAction(e, "promote")}><TrendingUp className="h-4 w-4 mr-2" /> Promote</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openAction(e, "demote")}><TrendingDown className="h-4 w-4 mr-2" /> Demote / Reassign</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openAction(e, "terminate")}>
                              <UserMinus className="h-4 w-4 mr-2" /> Terminate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-10">No employees match these filters</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {selected.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-left">{selected.name}</SheetTitle>
                    <SheetDescription className="text-left">{selected.role} · {selected.department}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-none border">
                    <p className="text-[11px] text-muted-foreground">Salary / month</p>
                    <p className="text-base font-bold text-foreground">₦{selected.salary.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-none border">
                    <p className="text-[11px] text-muted-foreground">Performance</p>
                    <p className="text-base font-bold text-foreground">{selected.performance}%</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-none border">
                    <p className="text-[11px] text-muted-foreground">Level</p>
                    <p className="text-base font-bold text-foreground">{selected.level}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-none border">
                    <p className="text-[11px] text-muted-foreground">Status</p>
                    <div className="mt-1">{statusBadge(selected.status)}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {selected.email}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {selected.phone}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {selected.location}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Joined {selected.joinedAt}</div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-foreground">Quick actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="rounded-none" onClick={() => openAction(selected, "salary")}><Wallet className="h-4 w-4 mr-2" /> Salary</Button>
                    <Button variant="outline" className="rounded-none" onClick={() => openAction(selected, "message")}><Mail className="h-4 w-4 mr-2" /> Message</Button>
                    <Button variant="outline" className="rounded-none" onClick={() => openAction(selected, "promote")}><TrendingUp className="h-4 w-4 mr-2" /> Promote</Button>
                    <Button variant="outline" className="rounded-none" onClick={() => openAction(selected, "demote")}><TrendingDown className="h-4 w-4 mr-2" /> Demote</Button>
                    <Button variant="destructive" className="rounded-none col-span-2" onClick={() => openAction(selected, "terminate")}><UserMinus className="h-4 w-4 mr-2" /> Terminate</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2 text-foreground">History</h4>
                  {selected.history.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No recorded events yet</p>
                  ) : (
                    <ul className="space-y-2">
                      {selected.history.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <ArrowUpRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                          <div>
                            <span className="text-foreground">{h.event}</span>
                            <span className="text-muted-foreground"> · {h.date}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Salary dialog */}
      <Dialog open={action === "salary"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Salary — {selected?.name}</DialogTitle>
            <DialogDescription>Current: ₦{selected?.salary.toLocaleString()}/month. Use negative numbers to reduce.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Change amount (₦)</Label>
              <Input type="number" value={salaryDelta} onChange={(e) => setSalaryDelta(e.target.value)} placeholder="e.g. 50000 or -25000" />
            </div>
            <div>
              <Label className="text-xs">Reason</Label>
              <Textarea value={salaryReason} onChange={(e) => setSalaryReason(e.target.value)} placeholder="Performance review, market adjustment..." rows={3} />
            </div>
            {salaryDelta && selected && (
              <div className="p-3 bg-muted/50 rounded-none border text-sm">
                New salary: <span className="font-bold">₦{Math.max(0, selected.salary + Number(salaryDelta)).toLocaleString()}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={submitSalary}>Apply Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message dialog */}
      <Dialog open={action === "message"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message — {selected?.name}</DialogTitle>
            <DialogDescription>Direct message will be delivered via internal mail.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Subject</Label>
              <Input value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Message</Label>
              <Textarea value={msgBody} onChange={(e) => setMsgBody(e.target.value)} rows={5} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={submitMessage}><Mail className="h-4 w-4 mr-2" /> Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promote / Demote dialog (shared) */}
      <Dialog open={action === "promote" || action === "demote"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "promote" ? "Promote" : "Demote / Reassign"} — {selected?.name}</DialogTitle>
            <DialogDescription>Current: {selected?.level} · {selected?.role}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">New level</Label>
              <Select value={newLevel} onValueChange={setNewLevel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">New role title</Label>
              <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={action === "promote" ? submitPromote : submitDemote}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Employee dialog */}
      <Dialog open={action === "add"} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>Onboard a new team member to your workforce.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Name</Label><Input value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} /></div>
              <div><Label className="text-xs">Email</Label><Input type="email" value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} /></div>
              <div className="col-span-2"><Label className="text-xs">Role title</Label><Input value={newEmp.role} onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })} /></div>
              <div>
                <Label className="text-xs">Department</Label>
                <Select value={newEmp.department} onValueChange={(v) => setNewEmp({ ...newEmp, department: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Level</Label>
                <Select value={newEmp.level} onValueChange={(v) => setNewEmp({ ...newEmp, level: v as Employee["level"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Salary (₦)</Label><Input type="number" value={newEmp.salary} onChange={(e) => setNewEmp({ ...newEmp, salary: e.target.value })} /></div>
              <div><Label className="text-xs">Location</Label><Input value={newEmp.location} onChange={(e) => setNewEmp({ ...newEmp, location: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={submitAdd}><UserPlus className="h-4 w-4 mr-2" /> Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate confirmation */}
      <AlertDialog open={action === "terminate"} onOpenChange={(o) => !o && setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate {selected?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the employee as terminated and remove them from active payroll. This action is logged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label className="text-xs">Reason for termination</Label>
            <Textarea value={terminateReason} onChange={(e) => setTerminateReason(e.target.value)} rows={3} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitTerminate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExecutiveWorkforce;
