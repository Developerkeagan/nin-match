import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, Send, CheckCircle2, RotateCcw, MoreVertical,
  Paperclip, Smile, Shield, AlertCircle, Headphones, ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  loadTickets, saveTickets, subscribeTickets, formatTime, formatWhen, newId,
  type Ticket, type TicketMessage,
} from "@/lib/tickets";

const AGENT_NAME = "Ijeoma Bello";

export default function SupportChats() {
  const location = useLocation();
  const isClosedView = location.pathname.endsWith("/closed");
  const [tickets, setTickets] = useState<Ticket[]>(() => loadTickets());
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeTickets(() => setTickets(loadTickets())), []);

  const commit = useCallback((updater: (t: Ticket[]) => Ticket[]) => {
    setTickets((prev) => {
      const next = updater(prev);
      saveTickets(next);
      return next;
    });
  }, []);

  const filtered = useMemo(
    () =>
      tickets
        .filter((c) => (isClosedView ? c.status === "closed" : c.status === "open"))
        .filter((c) => {
          const q = search.toLowerCase();
          return (
            !q ||
            c.name.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q) ||
            c.ref.toLowerCase().includes(q)
          );
        })
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [tickets, search, isClosedView]
  );

  const active = tickets.find((c) => c.id === activeId) ?? null;
  useEffect(() => { setActiveId(null); }, [isClosedView]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [active?.messages.length, activeId]);

  const openChat = (id: string) => {
    setActiveId(id);
    commit((p) => p.map((c) => (c.id === id ? { ...c, unreadForAgent: 0 } : c)));
  };

  const send = (from: TicketMessage["from"] = "agent") => {
    if (!input.trim() || !active) return;
    const msg: TicketMessage = {
      id: newId(),
      from,
      author: from === "admin" ? "Admin" : AGENT_NAME,
      text: input.trim(),
      at: new Date().toISOString(),
    };
    commit((p) =>
      p.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, msg],
              updatedAt: msg.at,
              operator: c.operator ?? AGENT_NAME,
              unreadForCustomer: c.unreadForCustomer + 1,
            }
          : c
      )
    );
    setInput("");
    if (from === "admin") toast.success("Admin tagged — message escalated");
  };

  const setStatus = (status: Ticket["status"]) => {
    if (!active) return;
    commit((p) =>
      p.map((c) => (c.id === active.id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );
    toast.success(status === "closed" ? `Ticket ${active.ref} closed` : "Ticket reopened");
    if (status === "closed") setActiveId(null);
  };

  const totalOpen = tickets.filter((c) => c.status === "open").length;
  const totalClosed = tickets.filter((c) => c.status === "closed").length;

  return (
    <div className="h-[calc(100vh-70px)] flex bg-background">
      {/* Contact list */}
      <aside className={`w-full sm:w-[340px] border-r flex-col bg-card ${active ? "hidden sm:flex" : "flex"}`}>
        <div className="p-3 border-b space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display">
                {isClosedView ? "Closed Tickets" : "Inbox"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {isClosedView ? `${totalClosed} archived` : `${totalOpen} active tickets`}
              </p>
            </div>
            <Badge variant="outline" className="rounded-none">{filtered.length}</Badge>
          </div>
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8 h-9 rounded-full bg-muted/50 border-0 text-sm"
              placeholder="Search tickets, companies, refs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground">No tickets here</div>
          )}
          {filtered.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <button
                key={c.id}
                onClick={() => openChat(c.id)}
                className={`w-full text-left px-3 py-3 flex gap-3 border-b hover:bg-muted/50 transition-colors ${
                  active?.id === c.id ? "bg-muted/70" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">{c.name}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{formatWhen(c.updatedAt)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{c.company} · {c.ref}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {last?.from === "agent" ? "You: " : last?.from === "admin" ? "Admin: " : ""}
                      {last?.text}
                    </p>
                    {c.unreadForAgent > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {c.unreadForAgent}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="outline" className="rounded-none text-[9px]">{c.category}</Badge>
                    {c.priority === "high" && (
                      <Badge variant="outline" className="rounded-none text-[9px] border-destructive/40 text-destructive">
                        <AlertCircle className="h-2.5 w-2.5 mr-1" /> high
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat window */}
      <section className={`flex-1 flex-col bg-muted/20 ${active ? "flex" : "hidden sm:flex"}`}>
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-center p-6">
            <div>
              <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-3">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="font-display font-bold text-lg">Select a ticket</h3>
              <p className="text-sm text-muted-foreground">Open a report to follow it through to resolution.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="min-h-[64px] border-b bg-background flex items-center justify-between px-3 sm:px-4 shrink-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setActiveId(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center shrink-0">
                  {active.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{active.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {active.company} · {active.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {active.status === "open" ? (
                  <Button size="sm" variant="outline" onClick={() => setStatus("closed")}>
                    <CheckCircle2 className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Close ticket</span>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setStatus("open")}>
                    <RotateCcw className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Reopen</span>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.success("Customer email copied")}>Copy email</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Marked as spam")}>Mark as spam</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Transcript exported")}>Export transcript</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Topic banner */}
            <div className="px-4 py-2 border-b bg-muted/40 flex items-center justify-between text-xs gap-2">
              <span className="text-muted-foreground truncate">
                {active.ref} · <span className="text-foreground font-medium">{active.subject}</span>
              </span>
              <Badge variant="outline" className="rounded-none text-[10px] capitalize shrink-0">{active.status}</Badge>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {active.messages.map((m) => {
                const mine = m.from === "agent";
                const admin = m.from === "admin";
                return (
                  <div key={m.id} className={`flex ${mine || admin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3 py-2 text-sm shadow-sm rounded-2xl ${
                      mine ? "bg-primary text-primary-foreground rounded-br-sm"
                        : admin ? "bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 rounded-br-sm"
                        : "bg-card border rounded-bl-sm"
                    }`}>
                      {admin && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold mb-0.5">
                          <Shield className="h-3 w-3" /> Admin
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <p className={`text-[10px] mt-0.5 text-right ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{formatTime(m.at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="border-t bg-background p-3">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex" onClick={() => toast.info("Attachments coming soon")}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex" onClick={() => setInput((s) => s + " 👍")}>
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send("agent"); } }}
                  placeholder={active.status === "closed" ? "Reopen to send messages..." : "Type a reply..."}
                  className="flex-1 rounded-full bg-muted/50 border-0"
                  disabled={active.status === "closed"}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => send("admin")}
                  disabled={active.status === "closed" || !input.trim()}
                  title="Send as escalation to admin"
                >
                  <Shield className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Tag Admin</span>
                </Button>
                <Button onClick={() => send("agent")} disabled={active.status === "closed" || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
