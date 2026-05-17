import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Headset, X, Send } from "lucide-react";

interface Msg { id: string; from: "you" | "support"; text: string; at: string }

export function EmployeeSupportChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "w", from: "support", text: "Hi! I'm Hiravel support. How can I help you today?", at: "now" },
  ]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const at = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs((p) => [...p, { id: Date.now().toString(), from: "you", text: input.trim(), at }]);
    setInput("");
    setTimeout(() => {
      setMsgs((p) => [...p, {
        id: Date.now().toString() + "r",
        from: "support",
        text: "Thanks — a Hiravel support agent will be with you shortly. Avg response time is 3 minutes.",
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 1100);
  };

  return (
    <>
      {open && (
        <Card className="fixed bottom-20 right-4 sm:right-6 z-50 w-[340px] h-[460px] flex flex-col shadow-2xl border overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Headset className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Hiravel Support</p>
                <p className="text-xs opacity-80">We're online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
          </div>
          <div ref={ref} className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/30">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-3 py-2 text-sm rounded-2xl ${m.from === "you" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border rounded-bl-sm"}`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <p className={`text-[10px] mt-0.5 text-right ${m.from === "you" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.at}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t bg-background flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 text-sm" />
            <Button type="submit" size="icon" disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </Card>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-105"
        aria-label="Contact support"
      >
        {open ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" />}
      </button>
    </>
  );
}
