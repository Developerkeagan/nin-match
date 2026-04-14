import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Send,
  Building2,
  Users,
  Megaphone,
  Wallet,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type NotifyCategory = "promotion" | "billing" | "system" | "security";
type RecipientMode = "all" | "single" | "filtered";

interface SentNotification {
  id: string;
  title: string;
  category: NotifyCategory;
  recipientMode: RecipientMode;
  recipientCount: number;
  sentAt: string;
  status: "delivered" | "pending" | "failed";
}

const categoryConfig: Record<NotifyCategory, { label: string; icon: typeof Megaphone; color: string; bg: string }> = {
  promotion: { label: "Promotion", icon: Megaphone, color: "text-primary", bg: "bg-primary/10" },
  billing: { label: "Billing", icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10" },
  system: { label: "System", icon: AlertTriangle, color: "text-blue-500", bg: "bg-blue-500/10" },
  security: { label: "Security", icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
};

const MOCK_COMPANIES = [
  { id: "1", name: "TechVision Ltd", industry: "Technology", plan: "Enterprise" },
  { id: "2", name: "GreenField HR", industry: "HR & Staffing", plan: "Business" },
  { id: "3", name: "Nova Recruitment", industry: "Recruitment", plan: "Starter" },
  { id: "4", name: "BlueWave Corp", industry: "Finance", plan: "Enterprise" },
  { id: "5", name: "PeakHire Solutions", industry: "HR & Staffing", plan: "Business" },
  { id: "6", name: "Quantum Dynamics", industry: "Technology", plan: "Free" },
  { id: "7", name: "Atlas Staffing", industry: "Recruitment", plan: "Starter" },
  { id: "8", name: "Meridian Group", industry: "Healthcare", plan: "Business" },
];

const MOCK_SENT: SentNotification[] = [
  { id: "1", title: "New promotion plans available", category: "promotion", recipientMode: "all", recipientCount: 248, sentAt: "2 hours ago", status: "delivered" },
  { id: "2", title: "Invoice reminder for Q1", category: "billing", recipientMode: "filtered", recipientCount: 34, sentAt: "Yesterday", status: "delivered" },
  { id: "3", title: "Scheduled maintenance notice", category: "system", recipientMode: "all", recipientCount: 248, sentAt: "3 days ago", status: "delivered" },
  { id: "4", title: "Security policy update", category: "security", recipientMode: "single", recipientCount: 1, sentAt: "5 days ago", status: "delivered" },
  { id: "5", title: "Premium feature announcement", category: "promotion", recipientMode: "filtered", recipientCount: 87, sentAt: "1 week ago", status: "delivered" },
  { id: "6", title: "Payment method expiring soon", category: "billing", recipientMode: "filtered", recipientCount: 12, sentAt: "1 week ago", status: "pending" },
];

const AdminNotify = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [category, setCategory] = useState<NotifyCategory>("system");
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");

  const filteredCompanies = MOCK_COMPANIES.filter((c) => {
    if (filterPlan && c.plan !== filterPlan) return false;
    if (filterIndustry && c.industry !== filterIndustry) return false;
    return true;
  });

  const recipientCount =
    recipientMode === "all"
      ? MOCK_COMPANIES.length
      : recipientMode === "single"
      ? selectedCompany ? 1 : 0
      : filteredCompanies.length;

  const canSend = title.trim() && message.trim() && recipientCount > 0;

  const handleSend = () => {
    setConfirmOpen(false);
    toast({
      title: "Notification sent",
      description: `"${title}" delivered to ${recipientCount} ${recipientCount === 1 ? "company" : "companies"}.`,
    });
    setTitle("");
    setMessage("");
    setSelectedCompany("");
    setFilterPlan("");
    setFilterIndustry("");
  };

  const filteredHistory = MOCK_SENT.filter((n) => {
    if (searchHistory && !n.title.toLowerCase().includes(searchHistory.toLowerCase())) return false;
    if (historyFilter !== "all" && n.category !== historyFilter) return false;
    return true;
  });

  const CategoryIcon = categoryConfig[category].icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Notify Companies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Send targeted notifications to companies on the platform
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Sent", value: "1,247", icon: Send, accent: "text-primary" },
          { label: "Companies", value: String(MOCK_COMPANIES.length), icon: Building2, accent: "text-blue-500" },
          { label: "This Month", value: "38", icon: Clock, accent: "text-amber-500" },
          { label: "Delivered", value: "99.2%", icon: CheckCircle2, accent: "text-emerald-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <stat.icon className={`h-4 w-4 ${stat.accent}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="compose" className="gap-1.5">
            <Send className="h-3.5 w-3.5" /> Compose
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" /> History
          </TabsTrigger>
        </TabsList>

        {/* COMPOSE TAB */}
        <TabsContent value="compose" className="mt-4">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Category */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Category</CardTitle>
                  <CardDescription>Choose the type of notification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(categoryConfig) as NotifyCategory[]).map((key) => {
                      const cfg = categoryConfig[key];
                      const Icon = cfg.icon;
                      const active = category === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setCategory(key)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center ${
                            active
                              ? "border-primary bg-primary/5"
                              : "border-transparent bg-muted/50 hover:bg-muted"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.bg}`}>
                            <Icon className={`h-4 w-4 ${cfg.color}`} />
                          </div>
                          <span className={`text-xs font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                            {cfg.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Message content */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Message</CardTitle>
                  <CardDescription>Compose your notification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="notif-title" className="text-xs">Title</Label>
                    <Input
                      id="notif-title"
                      placeholder="e.g. Scheduled maintenance this weekend"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notif-message" className="text-xs">Body</Label>
                    <Textarea
                      id="notif-message"
                      placeholder="Write your notification message here..."
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recipients */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recipients</CardTitle>
                  <CardDescription>Who should receive this notification?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mode selector */}
                  <div className="flex gap-2">
                    {([
                      { value: "all" as RecipientMode, label: "All Companies", icon: Users },
                      { value: "single" as RecipientMode, label: "Single Company", icon: Building2 },
                      { value: "filtered" as RecipientMode, label: "Filtered", icon: Filter },
                    ]).map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setRecipientMode(mode.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all ${
                          recipientMode === mode.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-background text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        <mode.icon className="h-3.5 w-3.5" />
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {/* Single company selector */}
                  {recipientMode === "single" && (
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_COMPANIES.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Filter options */}
                  {recipientMode === "filtered" && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Plan</Label>
                        <Select value={filterPlan} onValueChange={setFilterPlan}>
                          <SelectTrigger>
                            <SelectValue placeholder="All plans" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_plans">All Plans</SelectItem>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="Starter">Starter</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Industry</Label>
                        <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                          <SelectTrigger>
                            <SelectValue placeholder="All industries" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all_industries">All Industries</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="HR & Staffing">HR & Staffing</SelectItem>
                            <SelectItem value="Recruitment">Recruitment</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Recipient summary */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {recipientCount === 0
                        ? "No recipients selected"
                        : `${recipientCount} ${recipientCount === 1 ? "company" : "companies"} will receive this notification`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Preview & Actions */}
            <div className="space-y-4">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mini preview */}
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${categoryConfig[category].bg}`}>
                        <CategoryIcon className={`h-4 w-4 ${categoryConfig[category].color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {title || "Notification title"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-3">
                          {message || "Your message will appear here..."}
                        </p>
                        <p className="text-[10px] text-muted-foreground/50 mt-1.5">Just now</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {categoryConfig[category].label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipients</span>
                      <span className="font-medium text-foreground">{recipientCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mode</span>
                      <span className="font-medium text-foreground capitalize">{recipientMode}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={!canSend}
                      onClick={() => setPreviewOpen(true)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Full Preview
                    </Button>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={!canSend}
                      onClick={() => setConfirmOpen(true)}
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      Send Notification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sent notifications..."
                className="pl-9"
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
              />
            </div>
            <Select value={historyFilter} onValueChange={setHistoryFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="promotion">Promotion</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* History list */}
          <div className="space-y-2">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Send className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No notifications found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredHistory.map((notif) => {
                const cfg = categoryConfig[notif.category];
                const Icon = cfg.icon;
                return (
                  <Card key={notif.id} className="border hover:shadow-sm transition-shadow">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`}>
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{notif.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px]">
                            {cfg.label}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            {notif.recipientMode === "all"
                              ? "All companies"
                              : notif.recipientMode === "single"
                              ? "1 company"
                              : `${notif.recipientCount} companies`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            notif.status === "delivered"
                              ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                              : notif.status === "pending"
                              ? "text-amber-600 border-amber-200 bg-amber-50"
                              : "text-red-600 border-red-200 bg-red-50"
                          }`}
                        >
                          {notif.status === "delivered" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {notif.status}
                        </Badge>
                        <p className="text-[11px] text-muted-foreground mt-1">{notif.sentAt}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Full Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Preview</DialogTitle>
            <DialogDescription>This is how the notification will appear</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${categoryConfig[category].bg}`}>
                <CategoryIcon className={`h-5 w-5 ${categoryConfig[category].color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">{title}</p>
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{message}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-2">Just now</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>Category: <span className="font-medium text-foreground">{categoryConfig[category].label}</span></span>
            <span>Recipients: <span className="font-medium text-foreground">{recipientCount}</span></span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Send Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Send</DialogTitle>
            <DialogDescription>
              You are about to send "{title}" to {recipientCount}{" "}
              {recipientCount === 1 ? "company" : "companies"}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend}>
              <Send className="h-4 w-4 mr-1.5" />
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNotify;
