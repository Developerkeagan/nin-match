import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Plus, Eye, Pencil, MoreVertical, Briefcase, Pause, X, Copy, Trash2, MapPin, Calendar, Users as UsersIcon, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  workMode: "Remote" | "On-site" | "Hybrid";
  applications: number;
  aiMatches: number;
  status: "Active" | "Closed" | "Draft" | "Paused";
  datePosted: string;
}

const MOCK_JOBS: Job[] = [
  { id: "1", title: "Senior Frontend Engineer", location: "Lagos / Remote", type: "Full-time", workMode: "Remote", applications: 34, aiMatches: 12, status: "Active", datePosted: "2026-01-12" },
  { id: "2", title: "Backend Developer (Node.js)", location: "Abuja / On-site", type: "Full-time", workMode: "On-site", applications: 21, aiMatches: 8, status: "Active", datePosted: "2026-01-18" },
  { id: "3", title: "UI/UX Designer", location: "Lagos / Hybrid", type: "Contract", workMode: "Hybrid", applications: 15, aiMatches: 5, status: "Closed", datePosted: "2025-12-05" },
  { id: "4", title: "DevOps Engineer", location: "Remote", type: "Full-time", workMode: "Remote", applications: 9, aiMatches: 3, status: "Draft", datePosted: "2026-02-01" },
  { id: "5", title: "Data Analyst", location: "Port Harcourt", type: "Part-time", workMode: "On-site", applications: 27, aiMatches: 10, status: "Active", datePosted: "2026-01-25" },
  { id: "6", title: "Mobile Developer (React Native)", location: "Lagos / Remote", type: "Full-time", workMode: "Remote", applications: 42, aiMatches: 18, status: "Active", datePosted: "2026-02-10" },
  { id: "7", title: "Product Manager", location: "Abuja", type: "Full-time", workMode: "On-site", applications: 13, aiMatches: 4, status: "Paused", datePosted: "2026-01-30" },
];

const ITEMS_PER_PAGE = 5;

const statusColor: Record<Job["status"], string> = {
  Active: "bg-primary/15 text-primary border-primary/30",
  Closed: "bg-destructive/15 text-destructive border-destructive/30",
  Draft: "bg-muted text-muted-foreground border-border",
  Paused: "bg-orange-100 text-orange-700 border-orange-300",
};

const JobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [isLoading] = useState(false);

  const filtered = jobs.filter((j) => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && j.status !== statusFilter) return false;
    if (typeFilter !== "all" && j.type !== typeFilter) return false;
    if (modeFilter !== "all" && j.workMode !== modeFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setModeFilter("all");
    setPage(1);
  };

  const updateStatus = (id: string, status: Job["status"]) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    toast.success(`Job ${status.toLowerCase()}`);
  };

  const duplicateJob = (job: Job) => {
    const copy: Job = { ...job, id: Date.now().toString(), title: `${job.title} (Copy)`, status: "Draft", applications: 0, aiMatches: 0 };
    setJobs((prev) => [copy, ...prev]);
    toast.success("Job duplicated as draft");
  };

  const deleteJob = () => {
    if (!deleteTarget) return;
    setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Job deleted");
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const hasFilters = search || statusFilter !== "all" || typeFilter !== "all" || modeFilter !== "all";

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all your job postings and track performance</p>
        </div>
        <Button onClick={() => navigate("/dashboard/jobs/create")} className="rounded-none gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Create Job
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search jobs by title…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 rounded-none" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-36 rounded-none"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-36 rounded-none"><SelectValue placeholder="Job Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select value={modeFilter} onValueChange={(v) => { setModeFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-36 rounded-none"><SelectValue placeholder="Work Mode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="On-site">On-site</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground rounded-none">
            Reset
          </Button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-none" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border py-20 flex flex-col items-center gap-4 text-muted-foreground">
          <Briefcase className="h-12 w-12" />
          <p className="font-medium">{hasFilters ? "No jobs match your filters" : "No jobs created yet"}</p>
          {!hasFilters && (
            <Button onClick={() => navigate("/dashboard/jobs/create")} className="rounded-none gap-2 mt-2">
              <Plus className="h-4 w-4" /> Create Your First Job
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Job Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Applications</TableHead>
                  <TableHead className="text-center">AI Matches</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <button onClick={() => navigate(`/dashboard/jobs/${job.id}`)} className="font-semibold text-foreground hover:text-primary transition-colors text-left">
                        {job.title}
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{job.location}</TableCell>
                    <TableCell className="text-sm">{job.type}</TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => navigate(`/dashboard/applications?jobId=${job.id}`)} className="font-medium hover:text-primary transition-colors">
                        {job.applications}
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => navigate(`/dashboard/matches?jobId=${job.id}`)} className="font-medium hover:text-primary transition-colors">
                        {job.aiMatches}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-none text-xs ${statusColor[job.status]}`}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(job.datePosted)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/dashboard/jobs/${job.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Job</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/dashboard/jobs/${job.id}/edit`)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Job</TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {job.status === "Active" && (
                              <DropdownMenuItem onClick={() => updateStatus(job.id, "Paused")}>
                                <Pause className="h-4 w-4 mr-2" /> Pause Job
                              </DropdownMenuItem>
                            )}
                            {job.status !== "Closed" && (
                              <DropdownMenuItem onClick={() => updateStatus(job.id, "Closed")}>
                                <X className="h-4 w-4 mr-2" /> Close Job
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => duplicateJob(job)}>
                              <Copy className="h-4 w-4 mr-2" /> Duplicate Job
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(job)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.map((job) => (
              <div key={job.id} className="border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <button onClick={() => navigate(`/dashboard/jobs/${job.id}`)} className="font-semibold text-foreground hover:text-primary transition-colors text-left">
                    {job.title}
                  </button>
                  <Badge variant="outline" className={`rounded-none text-xs shrink-0 ml-2 ${statusColor[job.status]}`}>
                    {job.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{job.location} · {job.type} · {job.workMode}</p>
                  <p>{formatDate(job.datePosted)}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <button onClick={() => navigate(`/dashboard/applications?jobId=${job.id}`)} className="hover:text-primary transition-colors">
                    <span className="font-semibold">{job.applications}</span> Applications
                  </button>
                  <button onClick={() => navigate(`/dashboard/matches?jobId=${job.id}`)} className="hover:text-primary transition-colors">
                    <span className="font-semibold">{job.aiMatches}</span> AI Matches
                  </button>
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <Button variant="ghost" size="sm" className="rounded-none" onClick={() => navigate(`/dashboard/jobs/${job.id}`)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-none" onClick={() => navigate(`/dashboard/jobs/${job.id}/edit`)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {job.status === "Active" && <DropdownMenuItem onClick={() => updateStatus(job.id, "Paused")}><Pause className="h-4 w-4 mr-2" /> Pause</DropdownMenuItem>}
                      {job.status !== "Closed" && <DropdownMenuItem onClick={() => updateStatus(job.id, "Closed")}><X className="h-4 w-4 mr-2" /> Close</DropdownMenuItem>}
                      <DropdownMenuItem onClick={() => duplicateJob(job)}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(job)}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={page === i + 1} onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{deleteTarget?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteJob} className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobManagement;
