import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft, CheckCircle2, LifeBuoy, MessageSquarePlus, RotateCcw, Search, Send, Shield,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  CURRENT_COMPANY, TICKET_CATEGORIES, formatTime, formatWhen, loadTickets, newId,
  nextRef, saveTickets, subscribeTickets, type Ticket, type TicketMessage,
} from "@/lib/tickets";

const Support = () => {
  const [tickets, setTickets] = useState<Ticket[]>(() => loadTickets());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"open" | "closed">("open");
  const [input, setInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState({ subject: "", category: TICKET_CATEGORIES[0], message: "", priority: "normal" });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeTickets(() => setTickets(loadTickets())), []);

  const commit = useCallback((updater: (t: Ticket[]) => Ticket[]) => {
    setTickets((prev) => {
      const next = updater(prev);
      saveTickets(next);
      return next;
    });
  }, []);

  const mine = useMemo(
    () => tickets.filter((t) => t.company === CURRENT_COMPANY.name),
    [tickets]
  );

  const list = useMemo(
    () =>
      mine
        .filter((t) => t.status === tab)
        .filter((t) => {
          const q = search.toLowerCase();
          return !q || t.subject.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q);
        })
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [mine, tab, search]
  );

  const active = tickets.find((t) => t.id === activeId) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [active?.messages.length, activeId]);

  const openTicket = (id: string) => {
    setActiveId(id);
    commit((p) => p.map((t) => (t.id === id ? { ...t, unreadForCustomer: 0 } : t)));
  };

  const createTicket = () => {
    if (!draft.subject.trim() || !draft.message.trim()) {
      toast({ title: "Missing details", description: "Add a subject and describe your issue." });
      return;
    }
    const now = new Date().toISOString();
    const msg: TicketMessage = {
      id: newId(), from: "customer", author: CURRENT_COMPANY.contact, text: draft.message.trim(), at: now,
    };
    const ticket: Ticket = {
      id: newId(),
      ref: nextRef(tickets),
      subject: draft.subject.trim(),
      category: draft.category,
      name: CURRENT_COMPANY.contact,
      company: CURRENT_COMPANY.name,
      email: CURRENT_COMPANY.email,
      avatar: CURRENT_COMPANY.avatar,
      status: "open",
      priority: draft.priority as Ticket["priority"],
      operator: null,
      createdAt: now,
      updatedAt: now,
      unreadForAgent: 1,
      unreadForCustomer: 0,
      messages: [msg],
    };
    commit((p) => [ticket, ...p]);
    setDraft({ subject: "", category: TICKET_CATEGORIES[0], message: "", priority: "normal" });
    setDialogOpen(false);
    setTab("open");
    setActiveId(ticket.id);
    toast({ title: `Ticket ${ticket.ref} created`, description: "An operator will respond shortly." });
  };

  const sendMessage = () => {
    if (!input.trim() || !active) return;
    const msg: TicketMessage = {
      id: newId(), from: "customer", author: CURRENT_COMPANY.contact, text: input.trim(), at: new Date().toISOString(),
    };
    commit((p) =>
      p.map((t) =>
        t.id === active.id
          ? { ...t, messages: [...t.messages, msg], updatedAt: msg.at, unreadForAgent: t.unreadForAgent + 1 }
          : t
      )
    );
    setInput("");
  };

  const setStatus = (status: Ticket["status"]) => {
    if (!active) return;
    commit((p) => p.map((t) => (t.id === active.id ? { ...t, status, updatedAt: new Date().toISOString() } : t)));
    toast({ title: status === "closed" ? `Ticket ${active.ref} closed` : "Ticket reopened" });
    if (status === "closed") { setTab("closed"); }
  };

  const NewTicketDialog = (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="cta" size="sm">
          <MessageSquarePlus className="h-4 w-4 mr-1.5" /> New ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a support ticket</DialogTitle>
          <DialogDescription>Tell us what's wrong — an operator will reply in this thread.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Input value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} placeholder="Short summary of the issue" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TICKET_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea
              value={draft.message}
              onChange={(e) => setDraft({ ...draft, message: e.target.value })}
              placeholder="Describe the problem in detail..."
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="cta" onClick={createTicket}>Submit ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Care</h1>
          <p className="text-muted-foreground text-sm mt-1">Raise a ticket and chat with a Hiravel operator.</p>
        </div>
        {NewTicketDialog}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex h-[calc(100vh-230px)] min-h-[460px]">
            {/* Ticket list */}
            <aside className={`w-full sm:w-[320px] border-r flex-col bg-card ${active ? "hidden sm:flex" : "flex"}`}>
              <div className="p-3 border-b space-y-3">
                <div className="grid grid-cols-2 gap-1 bg-muted p-1">
                  {(["open", "closed"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setActiveId(null); }}
                      className={`text-xs font-medium py-1.5 capitalize transition-colors ${
                        tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      {t} ({mine.filter((x) => x.status === t).length})
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-8 h-9 rounded-full bg-muted/50 border-0 text-sm"
                    placeholder="Search tickets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {list.length === 0 && (
                  <div className="p-8 text-center">
                    <LifeBuoy className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-xs text-muted-foreground">No {tab} tickets</p>
                  </div>
                )}
                {list.map((t) => {
                  const last = t.messages[t.messages.length - 1];
                  return (
                    <button
                      key={t.id}
                      onClick={() => openTicket(t.id)}
                      className={`w-full text-left px-3 py-3 border-b hover:bg-muted/50 transition-colors ${
                        active?.id === t.id ? "bg-muted/70" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-foreground truncate">{t.subject}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{formatWhen(t.updatedAt)}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{t.ref} · {t.category}</p>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-xs text-muted-foreground truncate flex-1">
                          {last?.from === "customer" ? "You: " : `${last?.author ?? "Support"}: `}{last?.text}
                        </p>
                        {t.unreadForCustomer > 0 && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                            {t.unreadForCustomer}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Chat */}
            <section className={`flex-1 flex-col bg-muted/20 ${active ? "flex" : "hidden sm:flex"}`}>
              {!active ? (
                <div className="flex-1 flex items-center justify-center text-center p-6">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-3">
                      <LifeBuoy className="h-8 w-8" />
                    </div>
                    <h3 className="font-display font-bold text-lg">Open a ticket</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Select an existing ticket to continue the conversation, or create a new one.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="min-h-[64px] border-b bg-background flex items-center justify-between gap-2 px-3 sm:px-4 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setActiveId(null)}>
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {active.operator ?? "Awaiting an operator"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {active.operator ? "Hiravel Customer Care" : "Usually replies within an hour"}
                        </p>
                      </div>
                    </div>
                    {active.status === "open" ? (
                      <Button size="sm" variant="outline" onClick={() => setStatus("closed")}>
                        <CheckCircle2 className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Close ticket</span>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setStatus("open")}>
                        <RotateCcw className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Reopen</span>
                      </Button>
                    )}
                  </div>

                  <div className="px-4 py-2 border-b bg-muted/40 flex items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground truncate">
                      {active.ref} · <span className="text-foreground font-medium">{active.subject}</span>
                    </span>
                    <Badge variant="outline" className="rounded-none text-[10px] capitalize shrink-0">{active.status}</Badge>
                  </div>

                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                    {active.messages.map((m) => {
                      const mineMsg = m.from === "customer";
                      return (
                        <div key={m.id} className={`flex ${mineMsg ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] px-3 py-2 text-sm shadow-sm rounded-2xl ${
                            mineMsg
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : m.from === "admin"
                              ? "bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 rounded-bl-sm"
                              : "bg-card border rounded-bl-sm"
                          }`}>
                            {!mineMsg && (
                              <p className="text-[10px] font-semibold mb-0.5">{m.author}</p>
                            )}
                            <p className="whitespace-pre-wrap break-words">{m.text}</p>
                            <p className={`text-[10px] mt-0.5 text-right ${mineMsg ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {formatTime(m.at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t bg-background p-3 flex items-end gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder={active.status === "closed" ? "Reopen this ticket to continue..." : "Type your message..."}
                      className="flex-1 rounded-full bg-muted/50 border-0"
                      disabled={active.status === "closed"}
                    />
                    <Button onClick={sendMessage} disabled={active.status === "closed" || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
