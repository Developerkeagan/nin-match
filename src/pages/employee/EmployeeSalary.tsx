import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Wallet, Download, Send, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface PaySlip { month: string; gross: number; deductions: number; net: number; status: "paid" | "pending" }
interface Request { id: string; date: string; amount: number; reason: string; status: "pending" | "approved" | "rejected" }

const baseSalary = 580000;

const slips: PaySlip[] = [
  { month: "April 2026", gross: baseSalary, deductions: 58000, net: baseSalary - 58000, status: "paid" },
  { month: "March 2026", gross: baseSalary, deductions: 58000, net: baseSalary - 58000, status: "paid" },
  { month: "February 2026", gross: baseSalary, deductions: 58000, net: baseSalary - 58000, status: "paid" },
  { month: "January 2026", gross: baseSalary, deductions: 58000, net: baseSalary - 58000, status: "paid" },
];

export default function EmployeeSalary() {
  const [requests, setRequests] = useState<Request[]>([
    { id: "R-001", date: "2026-03-12", amount: 50000, reason: "Annual review increase", status: "approved" },
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: "", reason: "" });

  const submit = () => {
    if (!form.amount || !form.reason.trim()) return toast.error("Fill all fields");
    setRequests((p) => [{
      id: `R-${String(p.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().slice(0, 10),
      amount: Number(form.amount),
      reason: form.reason.trim(),
      status: "pending",
    }, ...p]);
    setForm({ amount: "", reason: "" });
    setOpen(false);
    toast.success("Salary change request submitted");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Salary & Payslips</h1>
          <p className="text-sm text-muted-foreground mt-1">View your pay history and request adjustments.</p>
        </div>
        <Button onClick={() => setOpen(true)}><TrendingUp className="h-4 w-4 mr-2" /> Request Change</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Current Salary</p>
          <p className="text-2xl font-bold font-display mt-1">₦{baseSalary.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">per month · gross</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Last Payout</p>
          <p className="text-2xl font-bold font-display mt-1">₦{(baseSalary - 58000).toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">April 2026 · net</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Open Requests</p>
          <p className="text-2xl font-bold font-display mt-1">{requests.filter((r) => r.status === "pending").length}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Wallet className="h-4 w-4" /> Payslip History</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Month</TableHead><TableHead>Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Net Pay</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {slips.map((s) => (
                <TableRow key={s.month}>
                  <TableCell className="font-medium">{s.month}</TableCell>
                  <TableCell>₦{s.gross.toLocaleString()}</TableCell>
                  <TableCell>₦{s.deductions.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold">₦{s.net.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-[10px]">{s.status}</Badge></TableCell>
                  <TableCell><Button size="sm" variant="ghost" onClick={() => toast.success(`${s.month} payslip downloaded`)}><Download className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">My Salary Requests</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {requests.length === 0 && <p className="text-sm text-muted-foreground">No requests yet</p>}
          {requests.map((r) => (
            <div key={r.id} className="p-3 border flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">+₦{r.amount.toLocaleString()} / month</p>
                <p className="text-xs text-muted-foreground">{r.reason}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Submitted {r.date}</p>
              </div>
              <Badge variant="outline" className={`capitalize text-[10px] ${r.status === "approved" ? "border-emerald-500/40 text-emerald-600" : r.status === "rejected" ? "border-destructive/40 text-destructive" : "border-amber-500/40 text-amber-600"}`}>{r.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Salary Change</DialogTitle>
            <DialogDescription>Your request will be reviewed by HR within 5 business days.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Requested increase (₦/month)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 75000" /></div>
            <div><Label>Justification</Label><Textarea rows={4} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Explain why you deserve this adjustment..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}><Send className="h-4 w-4 mr-2" /> Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
