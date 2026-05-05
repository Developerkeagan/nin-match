import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Send, Megaphone, Users, User, Building2, Clock, CheckCircle2, Search, Filter,
  Mail, FileText, Sparkles, AlertCircle, PartyPopper, Eye, Pin,
} from "lucide-react";
import { toast } from "sonner";

type Category = "memo" | "announcement" | "policy" | "alert" | "celebration";
type Audience = "everyone" | "department" | "individual";

interface SentMail {
  id: string;
  subject: string;
  category: Category;
  audience: Audience;
  recipients: number;
  sentAt: string;
  status: "delivered" | "scheduled" | "draft";
  pinned?: boolean;
}

const catCfg: Record<Category, { label: string; icon: typeof Megaphone; color: string; bg: string }> = {
  memo: { label: "Memo", icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  announcement: { label: "Announcement", icon: Megaphone, color: "text-blue-500", bg: "bg-blue-500/10" },
  policy: { label: "Policy", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
  alert: { label: "Alert", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  celebration: { label: "Celebration", icon: PartyPopper, color: "text-amber-500", bg: "bg-amber-500/10" },
};

const departments = ["Engineering", "Sales", "Marketing", "Operations", "Customer Support", "Finance"];
const employees = [
  { id: "EMP-001", name: "Chinedu Okoro", dept: "Engineering" },
  { id: "EMP-002", name: "Tolu Adeyinka", dept: "Sales" },
  { id: "EMP-003", name: "Halima Sani", dept: "Marketing" },
  { id: "EMP-004", name: "Kunle Adebanjo", dept: "Operations" },
  { id: "EMP-005", name: "Mary Johnson", dept: "Customer Support" },
  { id: "EMP-006", name: "Sade Olawale", dept: "Finance" },
  { id: "EMP-007", name: "Ifeanyi Eze", dept: "Engineering" },
  { id: "EMP-008", name: "Aisha Bello", dept: "Engineering" },
];

const TOTAL_HEADCOUNT = 248;
const deptHeadcount: Record<string, number> = {
  Engineering: 78, Sales: 42, Marketing: 28, Operations: 35, "Customer Support": 40, Finance: 12,
};

const initialSent: SentMail[] = [
  { id: "1", subject: "Q4 town hall — Friday 3pm", category: "announcement", audience: "everyone", recipients: TOTAL_HEADCOUNT, sentAt: "2 hours ago", status: "delivered", pinned: true },
  { id: "2", subject: "Updated remote work policy", category: "policy", audience: "everyone", recipients: TOTAL_HEADCOUNT, sentAt: "Yesterday", status: "delivered" },
  { id: "3", subject: "Engineering sprint kickoff", category: "memo", audience: "department", recipients: 78, sentAt: "2 days ago", status: "delivered" },
  { id: "4", subject: "Office network maintenance tonight", category: "alert", audience: "everyone", recipients: TOTAL_HEADCOUNT, sentAt: "3 days ago", status: "delivered" },
  { id: "5", subject: "Welcome aboard, Aisha! 🎉", category: "celebration", audience: "department", recipients: 78, sentAt: "5 days ago", status: "delivered" },
  { id: "6", subject: "Performance review reminder", category: "memo", audience: "department", recipients: 42, sentAt: "1 week ago", status: "scheduled" },
];

const ExecutiveMailing = () => {
  const [tab, setTab] = useState("compose");
  const [category, setCategory] = useState<Category>("memo");
  const [audience, setAudience] = useState<Audience>("everyone");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [dept, setDept] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [pinned, setPinned] = useState(false);
  const [scheduleAt, setScheduleAt] = useState("");
  const [sent, setSent] = useState<SentMail[]>(initialSent);
  const [search, setSearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState<"all" | Category>("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [viewMail, setViewMail] = useState<SentMail | null>(null);

  const recipientCount =
    audience === "everyone" ? TOTAL_HEADCOUNT
    : audience === "department" ? (dept ? deptHeadcount[dept] || 0 : 0)
    : (employeeId ? 1 : 0);

  const canSend = subject.trim() && body.trim() && recipientCount > 0;

  const handleSend = (asDraft = false) => {
    const newMail: SentMail = {
      id: String(Date.now()),
      subject,
      category,
      audience,
      recipients: recipientCount,
      sentAt: scheduleAt ? `Scheduled · ${scheduleAt}` : "Just now",
      status: asDraft ? "draft" : scheduleAt ? "scheduled" : "delivered",
      pinned,
    };
    setSent((s) => [newMail, ...s]);
    setConfirmOpen(false);
    toast.success(asDraft ? "Saved as draft" : scheduleAt ? "Scheduled" : `Sent to ${recipientCount} recipient${recipientCount === 1 ? "" : "s"}`);
    setSubject(""); setBody(""); setDept(""); setEmployeeId(""); setPinned(false); setScheduleAt("");
  };

  const filteredHistory = useMemo(() => sent.filter((m) => {
    if (search && !m.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (historyFilter !== "all" && m.category !== historyFilter) return false;
    return true;
  }), [sent, search, historyFilter]);

  const togglePin = (id: string) => {
    setSent((s) => s.map((m) => m.id === id ? { ...m, pinned: !m.pinned } : m));
  };

  const Icon = catCfg[category].icon;

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Internal Mailing</h1>
        <p className="text-sm text-muted-foreground mt-1">Send memos, announcements and policy updates across your workforce</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Sent", value: String(sent.filter((s) => s.status === "delivered").length), icon: Send, color: "text-primary" },
          { label: "Workforce", value: String(TOTAL_HEADCOUNT), icon: Users, color: "text-blue-500" },
          { label: "Scheduled", value: String(sent.filter((s) => s.status === "scheduled").length), icon: Clock, color: "text-amber-500" },
          { label: "Delivery Rate", value: "99.6%", icon: CheckCircle2, color: "text-emerald-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-none border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-none bg-muted flex items-center justify-center shrink-0">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold font-display text-foreground leading-tight">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="compose" className="gap-1.5"><Send className="h-3.5 w-3.5" /> Compose</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> History</TabsTrigger>
        </TabsList>

        {/* COMPOSE */}
        <TabsContent value="compose" className="mt-4">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Category */}
              <Card className="rounded-none border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">Type</CardTitle>
                  <CardDescription>What kind of message is this?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(Object.keys(catCfg) as Category[]).map((k) => {
                      const cfg = catCfg[k];
                      const I = cfg.icon;
                      const active = category === k;
                      return (
                        <button
                          key={k}
                          onClick={() => setCategory(k)}
                          className={`flex flex-col items-center gap-1.5 p-3 border-2 transition-all ${
                            active ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.bg}`}>
                            <I className={`h-4 w-4 ${cfg.color}`} />
                          </div>
                          <span className={`text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Compose */}
              <Card className="rounded-none border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">Compose</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Subject</Label>
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Q4 town hall — Friday 3pm" />
                  </div>
                  <div>
                    <Label className="text-xs">Message</Label>
                    <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={7} placeholder="Write your memo here. Markdown is supported..." />
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="accent-primary" />
                      <Pin className="h-3 w-3" /> Pin to recipient inboxes
                    </label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <Input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} className="h-7 text-xs w-52" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audience */}
              <Card className="rounded-none border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">Audience</CardTitle>
                  <CardDescription>Who receives this message?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {([
                      { v: "everyone" as Audience, label: "Everyone", icon: Users },
                      { v: "department" as Audience, label: "Department", icon: Building2 },
                      { v: "individual" as Audience, label: "Individual", icon: User },
                    ]).map((m) => (
                      <button
                        key={m.v}
                        onClick={() => setAudience(m.v)}
                        className={`flex items-center gap-2 px-3 py-2 border text-sm font-medium transition-all ${
                          audience === m.v ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        <m.icon className="h-3.5 w-3.5" /> {m.label}
                      </button>
                    ))}
                  </div>

                  {audience === "department" && (
                    <Select value={dept} onValueChange={setDept}>
                      <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d} value={d}>{d} ({deptHeadcount[d]} people)</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {audience === "individual" && (
                    <Select value={employeeId} onValueChange={setEmployeeId}>
                      <SelectTrigger><SelectValue placeholder="Select an employee" /></SelectTrigger>
                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.name} — {e.dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex items-center gap-2 p-3 bg-muted/50 border border-dashed">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {recipientCount === 0 ? "No recipients selected" : `${recipientCount} ${recipientCount === 1 ? "person" : "people"} will receive this message`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div>
              <Card className="rounded-none border sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border bg-muted/30 p-4 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${catCfg[category].bg}`}>
                        <Icon className={`h-4 w-4 ${catCfg[category].color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          {pinned && <Pin className="h-3 w-3 text-primary" />}
                          <p className="text-sm font-semibold text-foreground truncate">{subject || "Subject line"}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-4 whitespace-pre-wrap">
                          {body || "Your message body will appear here..."}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-2">From: Executive Office · Just now</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge variant="secondary" className="rounded-none text-[10px]">{catCfg[category].label}</Badge></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Audience</span><span className="text-foreground capitalize">{audience}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Recipients</span><span className="text-foreground font-medium">{recipientCount}</span></div>
                    {scheduleAt && <div className="flex justify-between"><span className="text-muted-foreground">Schedule</span><span className="text-foreground">{scheduleAt}</span></div>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="rounded-none w-full" onClick={() => setPreviewOpen(true)} disabled={!subject && !body}>
                      <Eye className="h-4 w-4 mr-2" /> Full Preview
                    </Button>
                    <Button variant="outline" className="rounded-none w-full" onClick={() => handleSend(true)} disabled={!subject.trim()}>
                      Save as Draft
                    </Button>
                    <Button className="rounded-none w-full" onClick={() => setConfirmOpen(true)} disabled={!canSend}>
                      <Send className="h-4 w-4 mr-2" /> {scheduleAt ? "Schedule" : "Send Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history" className="mt-4 space-y-4">
          <Card className="rounded-none border">
            <CardContent className="p-4 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={historyFilter} onValueChange={(v) => setHistoryFilter(v as any)}>
                <SelectTrigger className="md:w-48"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {(Object.keys(catCfg) as Category[]).map((k) => <SelectItem key={k} value={k}>{catCfg[k].label}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="rounded-none border">
            <CardContent className="p-0">
              {filteredHistory.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">No messages match your search</div>
              ) : (
                <div className="divide-y">
                  {filteredHistory.map((m) => {
                    const C = catCfg[m.category];
                    const I = C.icon;
                    return (
                      <div key={m.id} className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${C.bg}`}>
                          <I className={`h-4 w-4 ${C.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {m.pinned && <Pin className="h-3 w-3 text-primary" />}
                            <p className="text-sm font-semibold text-foreground truncate">{m.subject}</p>
                            <Badge variant="outline" className={`rounded-none text-[10px] ${
                              m.status === "delivered" ? "text-emerald-600 border-emerald-500/30" :
                              m.status === "scheduled" ? "text-amber-600 border-amber-500/30" :
                              "text-muted-foreground"
                            }`}>{m.status}</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {C.label} · {m.recipients} recipient{m.recipients === 1 ? "" : "s"} · {m.sentAt}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setViewMail(m); setPreviewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => togglePin(m.id)}><Pin className={`h-4 w-4 ${m.pinned ? "text-primary fill-primary" : ""}`} /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send confirm */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{scheduleAt ? "Schedule message?" : "Send message?"}</DialogTitle>
            <DialogDescription>
              "{subject}" will be {scheduleAt ? `scheduled for ${scheduleAt}` : "delivered immediately"} to <strong>{recipientCount}</strong> recipient{recipientCount === 1 ? "" : "s"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={() => handleSend(false)}><Send className="h-4 w-4 mr-2" /> Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full preview */}
      <Dialog open={previewOpen} onOpenChange={(o) => { setPreviewOpen(o); if (!o) setViewMail(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewMail?.subject || subject || "Preview"}</DialogTitle>
            <DialogDescription>
              {(viewMail ? catCfg[viewMail.category] : catCfg[category]).label} · {viewMail ? `${viewMail.recipients} recipients` : `${recipientCount} recipients`}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm text-foreground">
            {viewMail ? "(Archived message body — not stored in this demo.)" : (body || "Empty message")}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExecutiveMailing;
