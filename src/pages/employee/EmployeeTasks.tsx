import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { myTasks as seed, type ETask } from "./employeeData";

const STATUS_LABEL: Record<ETask["status"], string> = {
  todo: "To Do", "in-progress": "In Progress", review: "In Review", done: "Done",
};

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState<ETask[]>(seed);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ETask["status"] | "all">("all");
  const [open, setOpen] = useState<ETask | null>(null);

  const filtered = useMemo(() => tasks.filter((t) => {
    if (tab !== "all" && t.status !== tab) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [tasks, search, tab]);

  const update = (id: string, patch: Partial<ETask>) => {
    setTasks((p) => p.map((t) => t.id === id ? { ...t, ...patch } : t));
    if (open?.id === id) setOpen({ ...open, ...patch } as ETask);
  };

  const markDone = (id: string) => {
    update(id, { status: "done", progress: 100 });
    toast.success("Task marked done");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">My Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">Assignments and your current progress.</p>
      </div>

      <Card>
        <CardHeader className="pb-3 space-y-3">
          <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="todo">To Do</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
                <TabsTrigger value="done">Done</TabsTrigger>
              </TabsList>
              <TabsContent value={tab} />
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No tasks here</p>}
          {filtered.map((t) => (
            <button key={t.id} onClick={() => setOpen(t)} className="w-full text-left p-3 border hover:border-primary/40 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="text-[11px] text-muted-foreground">{t.project} · Due {t.due} · Est {t.estimatedHours}h</p>
                  <Progress value={t.progress} className="h-1 mt-2" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="text-[10px]">{t.priority}</Badge>
                  <Badge className="text-[10px]">{STATUS_LABEL[t.status]}</Badge>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.title}</SheetTitle>
                <SheetDescription>{open.project} · {open.id}</SheetDescription>
              </SheetHeader>
              <div className="mt-5 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 border"><p className="text-[10px] text-muted-foreground uppercase">Priority</p><p className="font-semibold capitalize mt-1">{open.priority}</p></div>
                  <div className="p-3 bg-muted/50 border"><p className="text-[10px] text-muted-foreground uppercase">Due</p><p className="font-semibold mt-1">{open.due}</p></div>
                  <div className="p-3 bg-muted/50 border"><p className="text-[10px] text-muted-foreground uppercase">Estimate</p><p className="font-semibold mt-1">{open.estimatedHours}h</p></div>
                  <div className="p-3 bg-muted/50 border"><p className="text-[10px] text-muted-foreground uppercase">Status</p><p className="font-semibold mt-1">{STATUS_LABEL[open.status]}</p></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs"><span>Progress</span><span className="font-semibold">{open.progress}%</span></div>
                  <input type="range" min={0} max={100} step={5} value={open.progress}
                    onChange={(e) => update(open.id, { progress: Number(e.target.value), status: Number(e.target.value) === 100 ? "done" : open.status })}
                    className="w-full mt-2 accent-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase text-muted-foreground">Move to</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(STATUS_LABEL) as ETask["status"][]).map((s) => (
                      <Button key={s} size="sm" variant={open.status === s ? "default" : "outline"} onClick={() => update(open.id, { status: s, progress: s === "done" ? 100 : open.progress })}>
                        <ArrowRight className="h-3 w-3 mr-1" /> {STATUS_LABEL[s]}
                      </Button>
                    ))}
                  </div>
                </div>
                {open.status !== "done" && (
                  <Button className="w-full" onClick={() => { markDone(open.id); setOpen(null); }}>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as done
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
