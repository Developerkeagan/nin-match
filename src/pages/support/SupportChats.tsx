import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, Send, CheckCircle2, RotateCcw, Phone, Video, MoreVertical,
  Paperclip, Smile, Shield, AlertCircle, Building2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { seedChats, type Chat, type ChatMessage } from "./supportData";

const STORAGE = "hiravel_support_chats";

const loadChats = (): Chat[] => {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedChats;
};

export default function SupportChats() {
  const location = useLocation();
  const isClosedView = location.pathname.endsWith("/closed");
  const [chats, setChats] = useState<Chat[]>(loadChats);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(chats));
  }, [chats]);

  const filtered = useMemo(() => {
    return chats
      .filter((c) => (isClosedView ? c.status === "closed" : c.status === "open"))
      .filter((c) =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.topic.toLowerCase().includes(search.toLowerCase())
      );
  }, [chats, search, isClosedView]);

  const active = chats.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    if (!active && filtered[0]) setActiveId(filtered[0].id);
  }, [filtered, active]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [active?.messages.length, activeId]);

  const openChat = (id: string) => {
    setActiveId(id);
    setChats((p) => p.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const send = (from: ChatMessage["from"] = "agent") => {
    if (!input.trim() || !active) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      from,
      text: input.trim(),
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChats((p) =>
      p.map((c) =>
        c.id === active.id ? { ...c, messages: [...c.messages, msg], lastAt: msg.at } : c
      )
    );
    setInput("");
    if (from === "admin") toast.success("Admin tagged — message escalated");
  };

  const closeChat = () => {
    if (!active) return;
    setChats((p) => p.map((c) => (c.id === active.id ? { ...c, status: "closed" } : c)));
    toast.success(`Chat with ${active.name} closed`);
    setActiveId(null);
  };

  const reopen = () => {
    if (!active) return;
    setChats((p) => p.map((c) => (c.id === active.id ? { ...c, status: "open" } : c)));
    toast.success("Chat reopened");
  };

  const totalOpen = chats.filter((c) => c.status === "open").length;
  const totalClosed = chats.filter((c) => c.status === "closed").length;

  return (
    <div className="h-[calc(100vh-70px)] flex bg-background">
      {/* Contact list */}
      <aside className="w-full sm:w-[340px] border-r flex flex-col bg-card">
        <div className="p-3 border-b space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display">
                {isClosedView ? "Closed Chats" : "Inbox"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {isClosedView ? `${totalClosed} archived` : `${totalOpen} active conversations`}
              </p>
            </div>
            <Badge variant="outline" className="rounded-none">{filtered.length}</Badge>
          </div>
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8 h-9 rounded-full bg-muted/50 border-0 text-sm"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground">No conversations</div>
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
                    <span className="text-[10px] text-muted-foreground shrink-0">{c.lastAt}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{c.company}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {last?.from === "agent" ? "You: " : last?.from === "admin" ? "Admin: " : ""}
                      {last?.text}
                    </p>
                    {c.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  {c.priority === "high" && (
                    <Badge variant="outline" className="rounded-none mt-1 text-[9px] border-destructive/40 text-destructive">
                      <AlertCircle className="h-2.5 w-2.5 mr-1" /> high priority
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat window */}
      <section className="hidden sm:flex flex-1 flex-col bg-[radial-gradient(circle_at_top,hsl(var(--muted))_0%,transparent_60%)] dark:bg-muted/20">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-center p-6">
            <div>
              <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="font-display font-bold text-lg">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">Pick a customer from the list to start chatting.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-[64px] border-b bg-background flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
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
                <Button variant="ghost" size="icon" onClick={() => toast.info("Voice call coming soon")}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast.info("Video call coming soon")}>
                  <Video className="h-4 w-4" />
                </Button>
                {active.status === "open" ? (
                  <Button size="sm" variant="outline" onClick={closeChat} className="ml-2">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Close chat
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={reopen} className="ml-2">
                    <RotateCcw className="h-4 w-4 mr-1.5" /> Reopen
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast.success("Customer info copied")}>Copy email</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Marked as spam")}>Mark as spam</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Transcript exported")}>Export transcript</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Topic banner */}
            <div className="px-4 py-2 border-b bg-muted/40 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Topic: <span className="text-foreground font-medium">{active.topic}</span></span>
              <Badge variant="outline" className="rounded-none text-[10px] capitalize">{active.status}</Badge>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {active.messages.map((m) => {
                const mine = m.from === "agent";
                const admin = m.from === "admin";
                return (
                  <div key={m.id} className={`flex ${mine || admin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-3 py-2 text-sm shadow-sm rounded-2xl ${
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
                      <p className={`text-[10px] mt-0.5 text-right ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.at}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="border-t bg-background p-3">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => toast.info("Attachments coming soon")}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput((s) => s + " 👍")}>
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
                  <Shield className="h-4 w-4 mr-1.5" /> Tag Admin
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
