import { Briefcase, Activity, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const stats = [
  { title: "Jobs Posted", value: "24", sub: "+3 this month", icon: Briefcase, color: "text-primary" },
  { title: "Active Jobs", value: "11", sub: "Currently open", icon: Activity, color: "text-primary" },
  { title: "AI Matches Generated", value: "147", sub: "Candidates matched by AI", icon: Sparkles, color: "text-primary" },
];

const recentJobs = [
  { title: "Senior React Developer", date: "Mar 18, 2026", applicants: 34, status: "Active" },
  { title: "Product Designer", date: "Mar 15, 2026", applicants: 21, status: "Active" },
  { title: "DevOps Engineer", date: "Mar 10, 2026", applicants: 18, status: "Closed" },
  { title: "Marketing Lead", date: "Mar 8, 2026", applicants: 12, status: "Active" },
];

const recentApplications = [
  { name: "Sarah Okonkwo", job: "Senior React Developer", status: "Under Review" },
  { name: "James Adewale", job: "Product Designer", status: "Shortlisted" },
  { name: "Fatima Bello", job: "DevOps Engineer", status: "Rejected" },
  { name: "Chidi Nwankwo", job: "Marketing Lead", status: "Under Review" },
];

const statusColor: Record<string, string> = {
  Active: "bg-primary/15 text-primary border-0",
  Closed: "bg-muted text-muted-foreground border-0",
  "Under Review": "bg-yellow-100 text-yellow-800 border-0",
  Shortlisted: "bg-primary/15 text-primary border-0",
  Rejected: "bg-destructive/15 text-destructive border-0",
};

const DashboardOverview = () => {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, Acme Corp</p>
      </div>

      {/* Stats cards — sharp edges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="rounded-none shadow-sm border hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 bg-primary/10 rounded-none">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.title}</p>
                <p className="text-2xl font-bold text-foreground tabular-nums mt-0.5">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Jobs */}
      <Card className="rounded-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Job Posts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead className="hidden sm:table-cell">Date Posted</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentJobs.map((job) => (
                <TableRow key={job.title} className="cursor-pointer">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{job.date}</TableCell>
                  <TableCell className="text-right tabular-nums">{job.applicants}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={statusColor[job.status]}>{job.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Applications */}
        <Card className="rounded-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApplications.map((app) => (
              <div key={app.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.job}</p>
                </div>
                <Badge className={statusColor[app.status]}>{app.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="rounded-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-primary/5 border-l-2 border-primary">
              <p className="text-sm font-medium">Top Matching Candidates</p>
              <p className="text-xs text-muted-foreground mt-1">12 new candidates match your "Senior React Developer" listing with 90%+ compatibility.</p>
            </div>
            <div className="p-3 bg-primary/5 border-l-2 border-primary">
              <p className="text-sm font-medium">Highest Engagement</p>
              <p className="text-xs text-muted-foreground mt-1">"Product Designer" role received 21 applications in 3 days — above your average.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Summary */}
      <Card className="rounded-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Subscription Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Plan</p>
              <p className="text-sm font-semibold mt-1">Business</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Credits Remaining</p>
              <p className="text-sm font-semibold mt-1 tabular-nums">82 / 100</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Expires</p>
              <p className="text-sm font-semibold mt-1">Apr 23, 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
