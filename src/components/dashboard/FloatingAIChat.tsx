import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickReplies = [
  "How do I post a job?",
  "Show me my analytics",
  "How do credits work?",
];

export function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your NINJobs AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getResponse(text.trim()),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const getResponse = (q: string): string => {
    const lower = q.toLowerCase();
    if (lower.includes("post") && lower.includes("job"))
      return 'Go to "Create Job" in the sidebar to post a new job listing. Fill in the details and publish when ready!';
    if (lower.includes("analytics"))
      return "Your analytics dashboard shows promotion performance, credit usage, and hiring metrics. Check the Analytics page for details.";
    if (lower.includes("credit"))
      return "Credits are used for promotions and premium features. You get credits with your plan and can purchase more from the Billing page.";
    return "Thanks for your question! I'm here to help with job postings, analytics, billing, and more. What would you like to know?";
  };

  return (
    <>
      {/* Chat Modal */}
      {open && (
        <Card className="fixed bottom-20 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] h-[480px] flex flex-col shadow-2xl border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">NINJobs AI</p>
                <p className="text-xs opacity-80">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:opacity-80 transition-opacity">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-muted/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border text-card-foreground"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-card border rounded-lg px-3 py-2 text-sm text-muted-foreground">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-card border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-sm"
              />
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
