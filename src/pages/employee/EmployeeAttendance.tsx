import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { LogIn, LogOut, ScanLine, Download, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { attendanceSeed, STORAGE_ATT, type AttendanceRow } from "./employeeData";

export default function EmployeeAttendance() {
  const [rows, setRows] = useState<AttendanceRow[]>(() => {
    try { const raw = localStorage.getItem(STORAGE_ATT); if (raw) return JSON.parse(raw); } catch {}
    return attendanceSeed;
  });
  const [scanOpen, setScanOpen] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => { localStorage.setItem(STORAGE_ATT, JSON.stringify(rows)); }, [rows]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const today = rows.find((r) => r.date === todayStr);
  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const recordSignIn = () => {
    const t = now();
    setRows((p) => {
      const i = p.findIndex((r) => r.date === todayStr);
      if (i >= 0) { const c = [...p]; c[i] = { ...c[i], signIn: t }; return c; }
      return [{ date: todayStr, signIn: t, signOut: null, hours: 0, status: "present" }, ...p];
    });
    toast.success(`Signed in at ${t}`);
    setScanOpen(false);
    setCode("");
  };
  const recordSignOut = () => {
    const t = now();
    setRows((p) => p.map((r) => r.date === todayStr ? {
      ...r, signOut: t,
      hours: r.signIn ? +(((new Date(`2000-01-01T${t}`).getTime() - new Date(`2000-01-01T${r.signIn}`).getTime()) / 3600000)).toFixed(1) : 0,
    } : r));
    toast.success(`Signed out at ${t}`);
    setScanOpen(false);
    setCode("");
  };

  const handleScan = () => {
    if (!code.trim()) { toast.error("Enter or scan a code"); return; }
    if (!today?.signIn) recordSignIn();
    else if (!today.signOut) recordSignOut();
    else toast.info("Already signed in and out for today");
  };

  const stats = useMemo(() => {
    const present = rows.filter((r) => r.status === "present" || r.status === "late").length;
    const late = rows.filter((r) => r.status === "late").length;
    const totalHours = rows.reduce((s, r) => s + r.hours, 0);
    return { present, late, totalHours: totalHours.toFixed(1), rate: rows.length ? Math.round((present / rows.length) * 100) : 0 };
  }, [rows]);

  const exportCSV = () => {
    const csv = [["Date", "Sign In", "Sign Out", "Hours", "Status"], ...rows.map((r) => [r.date, r.signIn ?? "", r.signOut ?? "", r.hours, r.status])]
      .map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "my-attendance.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported attendance.csv");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Scan the company QR to sign in or out.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button onClick={() => setScanOpen(true)}><ScanLine className="h-4 w-4 mr-2" /> Scan QR</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Today Sign In", value: today?.signIn ?? "—" },
          { label: "Today Sign Out", value: today?.signOut ?? "—" },
          { label: "Attendance Rate", value: `${stats.rate}%` },
          { label: "Late Days", value: stats.late },
        ].map((k) => (
          <Card key={k.label}><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="text-xl font-bold font-display mt-1">{k.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={recordSignIn} disabled={!!today?.signIn}><LogIn className="h-4 w-4 mr-2" /> Sign In Now</Button>
          <Button onClick={recordSignOut} variant="outline" disabled={!today?.signIn || !!today.signOut}><LogOut className="h-4 w-4 mr-2" /> Sign Out Now</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Attendance History</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Date</TableHead><TableHead>Sign In</TableHead><TableHead>Sign Out</TableHead><TableHead>Hours</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.date}>
                  <TableCell className="text-sm font-medium">{r.date}</TableCell>
                  <TableCell className="text-sm">{r.signIn ?? "—"}</TableCell>
                  <TableCell className="text-sm">{r.signOut ?? "—"}</TableCell>
                  <TableCell className="text-sm">{r.hours}h</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-[10px]">{r.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={scanOpen} onOpenChange={setScanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Company QR Code</DialogTitle>
            <DialogDescription>Point your camera at the QR poster, or paste the code manually below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-muted border-2 border-dashed border-primary/40 flex items-center justify-center">
              <div className="text-center">
                <ScanLine className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <p className="text-xs text-muted-foreground mt-2">Camera preview (simulated)</p>
              </div>
            </div>
            <div>
              <Input placeholder="Or paste QR code (e.g. ACME-2026-OFFICE)" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScanOpen(false)}>Cancel</Button>
            <Button onClick={handleScan}>{!today?.signIn ? "Sign In" : "Sign Out"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
