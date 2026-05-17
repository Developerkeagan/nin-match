import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, AlertCircle, Wallet, ClipboardList, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

interface Notif { id: string; title: string; body: string; type: "task" | "salary" | "attendance" | "general"; at: string; read: boolean }

const seed: Notif[] = [
  { id: "n1", title: "New task assigned", body: "You've been assigned 'Refactor auth flow components' due May 21.", type: "task", at: "2h ago", read: false },
  { id: "n2", title: "Payslip available", body: "Your April 2026 payslip is ready to view.", type: "salary", at: "Yesterday", read: false },
  { id: "n3", title: "Late sign in recorded", body: "You signed in at 09:10 on May 14 — 10 minutes late.", type: "attendance", at: "2 days ago", read: true },
  { id: "n4", title: "Company memo: Holiday schedule", body: "The office will be closed on May 27 for Children's Day.", type: "general", at: "3 days ago", read: true },
  { id: "n5", title: "Salary request approved", body: "Your March salary increase request was approved.", type: "salary", at: "1 week ago", read: true },
];

const ICONS = {
  task: ClipboardList, salary: Wallet, attendance: CalendarCheck, general: Bell,
};

export default function EmployeeNotifications() {
  const [items, setItems] = useState<Notif[]>(seed);

  const markRead = (id: string) => setItems((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAll = () => { setItems((p) => p.map((n) => ({ ...n, read: true }))); toast.success("All notifications marked read"); };
  const clear = () => { setItems([]); toast.success("Notifications cleared"); };

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-2">
            Notifications {unread > 0 && <Badge>{unread} new</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Updates from your company and the platform.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAll} disabled={unread === 0}><CheckCircle2 className="h-4 w-4 mr-2" /> Mark all read</Button>
          <Button variant="ghost" size="sm" onClick={clear} disabled={items.length === 0}>Clear</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Inbox</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {items.length === 0 && (
            <div className="text-center py-10">
              <Bell className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
          {items.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <button key={n.id} onClick={() => markRead(n.id)} className={`w-full text-left p-3 border flex items-start gap-3 hover:bg-muted/40 transition-colors ${!n.read ? "bg-primary/5 border-primary/20" : ""}`}>
                <div className={`p-2 rounded ${!n.read ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground">{n.at}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-2" />}
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
