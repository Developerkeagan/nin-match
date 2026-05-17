import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList, CheckCircle2, Clock, TrendingUp, LogIn, LogOut,
  CalendarCheck, Bell, Wallet, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { myTasks, attendanceSeed, STORAGE_ATT, type AttendanceRow } from "./employeeData";

export default function EmployeeOverview() {
  const navigate = useNavigate();
  const [att, setAtt] = useState<AttendanceRow[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ATT);
      if (raw) return JSON.parse(raw);
    } catch {}
    return attendanceSeed;
  });

  useEffect(() => { localStorage.setItem(STORAGE_ATT, JSON.stringify(att)); }, [att]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRow = att.find((a) => a.date === todayStr);

  const stats = useMemo(() => {
    const open = myTasks.filter((t) => t.status !== "done");
    const done = myTasks.filter((t) => t.status === "done");
    const avgComplete = done.length ? Math.round(done.reduce((s, d) => s + d.estimatedHours, 0) / done.length * 10) / 10 : 0;
    const overdue = open.filter((t) => new Date(t.due) < new Date()).length;
    return { open: open.length, done: done.length, avgComplete, overdue };
  }, []);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const signIn = () => {
    const t = now();
    setAtt((p) => {
      const idx = p.findIndex((a) => a.date === todayStr);
      if (idx >= 0) {
        const copy = [...p];
        copy[idx] = { ...copy[idx], signIn: t };
        return copy;
      }
      return [{ date: todayStr, signIn: t, signOut: null, hours: 0, status: "present" }, ...p];
    });
    toast.success(`Signed in at ${t}`);
  };
  const signOut = () => {
    const t = now();
    setAtt((p) => p.map((a) => a.date === todayStr ? { ...a, signOut: t, hours: a.signIn ? +(((new Date(`2000-01-01T${t}`).getTime() - new Date(`2000-01-01T${a.signIn}`).getTime()) / 3600000)).toFixed(1) : 0 } : a));
    toast.success(`Signed out at ${t}`);
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Welcome back, Employee 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your work today.</p>
        </div>
        <div className="flex gap-2">
          {!todayRow?.signIn ? (
            <Button onClick={signIn}><LogIn className="h-4 w-4 mr-2" /> Sign In</Button>
          ) : !todayRow?.signOut ? (
            <Button onClick={signOut} variant="outline"><LogOut className="h-4 w-4 mr-2" /> Sign Out</Button>
          ) : (
            <Badge variant="outline" className="px-3 py-2"><CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-600" /> Day complete</Badge>
          )}
          <Button variant="outline" onClick={() => navigate("/employee/attendance")}>
            <CalendarCheck className="h-4 w-4 mr-2" /> Scan QR
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Open Tasks", value: stats.open, icon: ClipboardList, color: "text-primary" },
          { label: "Completed", value: stats.done, icon: CheckCircle2, color: "text-emerald-600" },
          { label: "Avg Completion", value: `${stats.avgComplete}h`, icon: Clock, color: "text-amber-600" },
          { label: "Overdue", value: stats.overdue, icon: TrendingUp, color: "text-red-600" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-2xl font-bold font-display text-foreground mt-1">{k.value}</p>
              </div>
              <div className={`p-2 bg-muted rounded-md ${k.color}`}><k.icon className="h-5 w-5" /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Current Assigned Tasks</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate("/employee/tasks")}>
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {myTasks.filter((t) => t.status !== "done").slice(0, 5).map((t) => (
              <button key={t.id} onClick={() => navigate("/employee/tasks")} className="w-full text-left p-3 border hover:border-primary/40 hover:bg-muted/30 transition-colors flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{t.title}</p>
                    <Badge variant="outline" className="text-[10px]">{t.priority}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t.project} · Due {t.due}</p>
                  <Progress value={t.progress} className="h-1 mt-2" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Today's Attendance</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sign in</span><span className="font-semibold">{todayRow?.signIn ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sign out</span><span className="font-semibold">{todayRow?.signOut ?? "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hours</span><span className="font-semibold">{todayRow?.hours ?? 0}h</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Quick Links</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/employee/salary")}><Wallet className="h-4 w-4 mr-2" /> View payslip</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/employee/notifications")}><Bell className="h-4 w-4 mr-2" /> Notifications</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/employee/profile")}>Edit profile</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
