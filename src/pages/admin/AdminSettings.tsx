import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  MonitorSmartphone,
  LogOut,
  AlertTriangle,
  Trash2,
  Clock,
  Save,
  User,
  Mail,
  Phone,
  Camera,
  Bell,
  Globe,
  Users,
  Building2,
  FileText,
  Database,
  ToggleLeft,
  Gauge,
  Smartphone,
  Download,
  Upload,
  RefreshCw,
  Paintbrush,
  Ban,
  CheckCircle2,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new_: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: "", new_: "", confirm: "" });
  const [hasChanges, setHasChanges] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Admin User",
    email: "admin@gmail.com",
    username: "admin_hireon",
    phone: "+234 801 234 5678",
    role: "Super Admin",
    bio: "Platform administrator for HireOn.",
  });

  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    allowSignups: true,
    allowCompanyRegistration: true,
    requireEmailVerification: true,
    maxJobsPerCompany: "50",
    maxApplicationsPerUser: "100",
    sessionTimeout: "30",
    defaultCurrency: "ngn",
    defaultLanguage: "en",
  });

  const [notifications, setNotifications] = useState({
    newUserSignup: true,
    newCompanyRegistration: true,
    systemErrors: true,
    securityAlerts: true,
    dailyReport: false,
    weeklyDigest: true,
    paymentAlerts: true,
    partnerActivity: true,
  });

  const [moderation, setModeration] = useState({
    autoApproveCompanies: false,
    autoApproveJobs: true,
    contentFilter: true,
    spamDetection: true,
    profanityFilter: true,
    flagThreshold: "5",
  });

  const [sessions] = useState([
    { device: "Chrome on Windows", location: "Lagos, Nigeria", lastActive: "Now", current: true },
    { device: "Firefox on MacOS", location: "Abuja, Nigeria", lastActive: "5 hours ago", current: false },
    { device: "Safari on iPad", location: "London, UK", lastActive: "2 days ago", current: false },
  ]);

  const updateProfile = (key: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updatePlatform = (key: keyof typeof platformSettings, value: string | boolean) => {
    setPlatformSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateModeration = (key: keyof typeof moderation, value: string | boolean) => {
    setModeration((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
    setHasChanges(false);
  };

  const handlePasswordChange = () => {
    if (passwords.new_ !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.new_.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password updated successfully");
    setShowPasswordModal(false);
    setPasswords({ current: "", new_: "", confirm: "" });
  };

  const handleLogoutAll = () => {
    toast.success("Logged out from all other devices");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your admin profile, platform configuration, and security</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="platform" className="gap-1.5 text-xs sm:text-sm">
            <Wrench className="h-3.5 w-3.5" /> Platform
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm">
            <Shield className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="moderation" className="gap-1.5 text-xs sm:text-sm">
            <Gauge className="h-3.5 w-3.5" /> Moderation
          </TabsTrigger>
        </TabsList>

        {/* ═══════════ PROFILE TAB ═══════════ */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          {/* Avatar & Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Admin Profile
              </CardTitle>
              <CardDescription>Your personal information and identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-destructive/15 text-destructive flex items-center justify-center text-2xl font-bold">
                    AD
                  </div>
                  <button
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                    onClick={() => toast.info("Avatar upload coming soon")}
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{profile.fullName}</p>
                  <Badge className="bg-destructive/15 text-destructive border-0 mt-1">{profile.role}</Badge>
                </div>
              </div>

              <Separator />

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <User className="h-3 w-3" /> Full Name
                  </Label>
                  <Input value={profile.fullName} onChange={(e) => updateProfile("fullName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Mail className="h-3 w-3" /> Email Address
                  </Label>
                  <Input value={profile.email} onChange={(e) => updateProfile("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <User className="h-3 w-3" /> Username
                  </Label>
                  <Input value={profile.username} onChange={(e) => updateProfile("username", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <Phone className="h-3 w-3" /> Phone Number
                  </Label>
                  <Input value={profile.phone} onChange={(e) => updateProfile("phone", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <FileText className="h-3 w-3" /> Bio
                </Label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-none"
                  value={profile.bio}
                  onChange={(e) => updateProfile("bio", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Admin Notifications
              </CardTitle>
              <CardDescription>Choose which admin-level alerts you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "newUserSignup" as const, label: "New User Signups", desc: "Get notified when a new user registers", icon: Users },
                { key: "newCompanyRegistration" as const, label: "Company Registrations", desc: "When a new company joins the platform", icon: Building2 },
                { key: "systemErrors" as const, label: "System Errors", desc: "Critical system errors and failures", icon: AlertTriangle },
                { key: "securityAlerts" as const, label: "Security Alerts", desc: "Suspicious activity and breach attempts", icon: Shield },
                { key: "dailyReport" as const, label: "Daily Report", desc: "Daily platform performance summary", icon: FileText },
                { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Comprehensive weekly analytics digest", icon: Globe },
                { key: "paymentAlerts" as const, label: "Payment Alerts", desc: "Subscription payments and failures", icon: Database },
                { key: "partnerActivity" as const, label: "Partner Activity", desc: "Partner sign-ups and milestones", icon: Users },
              ].map(({ key, label, desc, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <Switch checked={notifications[key]} onCheckedChange={(v) => updateNotification(key, v)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════ PLATFORM TAB ═══════════ */}
        <TabsContent value="platform" className="space-y-6 mt-6">
          {/* System Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ToggleLeft className="h-5 w-5 text-primary" />
                System Controls
              </CardTitle>
              <CardDescription>Toggle core platform features on and off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "maintenanceMode" as const,
                  label: "Maintenance Mode",
                  desc: "Temporarily disable platform access for all users",
                  icon: Wrench,
                  destructive: true,
                },
                {
                  key: "allowSignups" as const,
                  label: "Allow New Signups",
                  desc: "Allow new user registrations on the platform",
                  icon: Users,
                },
                {
                  key: "allowCompanyRegistration" as const,
                  label: "Allow Company Registration",
                  desc: "Allow new companies to register and post jobs",
                  icon: Building2,
                },
                {
                  key: "requireEmailVerification" as const,
                  label: "Require Email Verification",
                  desc: "Users must verify their email before accessing the platform",
                  icon: Mail,
                },
              ].map(({ key, label, desc, icon: Icon, destructive }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${destructive ? "bg-destructive/10" : "bg-muted"}`}>
                      <Icon className={`h-4 w-4 ${destructive ? "text-destructive" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${destructive ? "text-destructive" : "text-foreground"}`}>{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={platformSettings[key] as boolean}
                    onCheckedChange={(v) => updatePlatform(key, v)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Limits & Defaults */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Limits & Defaults
              </CardTitle>
              <CardDescription>Set platform-wide limits and default values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Max Jobs Per Company</Label>
                  <Input
                    type="number"
                    value={platformSettings.maxJobsPerCompany}
                    onChange={(e) => updatePlatform("maxJobsPerCompany", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Max Applications Per User</Label>
                  <Input
                    type="number"
                    value={platformSettings.maxApplicationsPerUser}
                    onChange={(e) => updatePlatform("maxApplicationsPerUser", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Session Timeout (min)</Label>
                  <Input
                    type="number"
                    value={platformSettings.sessionTimeout}
                    onChange={(e) => updatePlatform("sessionTimeout", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Default Currency</Label>
                  <Select value={platformSettings.defaultCurrency} onValueChange={(v) => updatePlatform("defaultCurrency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngn">NGN (₦)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Backups */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data & Backups
              </CardTitle>
              <CardDescription>Manage platform data and backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Export Platform Data</p>
                    <p className="text-xs text-muted-foreground">Download all platform data as CSV/JSON</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Data export started")}>
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Last Backup</p>
                    <p className="text-xs text-muted-foreground">Automated backup completed 6 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Manual backup initiated")}>
                  <Upload className="h-4 w-4 mr-2" /> Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════ SECURITY TAB ═══════════ */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Authentication
              </CardTitle>
              <CardDescription>Manage your admin credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Address</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-green-500" /> Verified
                </Badge>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Password</p>
                    <p className="text-xs text-muted-foreground">Last changed 14 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                  <Key className="h-4 w-4 mr-2" /> Change Password
                </Button>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Highly recommended for admin accounts</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-muted-foreground">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MonitorSmartphone className="h-5 w-5 text-primary" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>Devices currently logged in</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleLogoutAll}>
                  <LogOut className="h-4 w-4 mr-1" /> Logout All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                      <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {s.device}
                        {s.current && <Badge className="ml-2 bg-primary/15 text-primary border-0 text-[10px]">Current</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {s.lastActive}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-lg text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Delete Admin Account</p>
                  <p className="text-xs text-muted-foreground">This will permanently remove your admin access. Cannot be undone.</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════ MODERATION TAB ═══════════ */}
        <TabsContent value="moderation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Content Moderation
              </CardTitle>
              <CardDescription>Automated content filtering and approval settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "autoApproveCompanies" as const, label: "Auto-Approve Companies", desc: "Automatically approve new company registrations", icon: Building2 },
                { key: "autoApproveJobs" as const, label: "Auto-Approve Job Posts", desc: "Publish jobs without manual review", icon: FileText },
                { key: "contentFilter" as const, label: "Content Filter", desc: "Filter inappropriate content from listings", icon: Ban },
                { key: "spamDetection" as const, label: "Spam Detection", desc: "Detect and block spam job postings", icon: Shield },
                { key: "profanityFilter" as const, label: "Profanity Filter", desc: "Block profane language in job posts and profiles", icon: Paintbrush },
              ].map(({ key, label, desc, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={moderation[key] as boolean}
                    onCheckedChange={(v) => updateModeration(key, v)}
                  />
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Auto-Flag Threshold
                </Label>
                <p className="text-xs text-muted-foreground">Number of reports before content is auto-flagged for review</p>
                <Input
                  type="number"
                  value={moderation.flagThreshold}
                  onChange={(e) => updateModeration("flagThreshold", e.target.value)}
                  className="max-w-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Audit Log Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Audit Log
              </CardTitle>
              <CardDescription>Latest admin actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "Suspended company TechFraud Inc.", time: "2 hours ago", type: "destructive" },
                  { action: "Approved partner application — RecruitPro", time: "5 hours ago", type: "success" },
                  { action: "Updated promotion plan pricing", time: "1 day ago", type: "info" },
                  { action: "Removed flagged job post #4521", time: "1 day ago", type: "destructive" },
                  { action: "Exported platform data backup", time: "2 days ago", type: "info" },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      log.type === "destructive" ? "bg-destructive" : log.type === "success" ? "bg-green-500" : "bg-primary"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-md p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <p className="text-sm text-muted-foreground">You have unsaved changes</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setHasChanges(false)}>Discard</Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Admin Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {(["current", "new_", "confirm"] as const).map((field) => (
              <div key={field} className="space-y-2">
                <Label>{field === "current" ? "Current Password" : field === "new_" ? "New Password" : "Confirm Password"}</Label>
                <div className="relative">
                  <Input
                    type={showPassword[field] ? "text" : "password"}
                    value={passwords[field]}
                    onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))}
                    placeholder={field === "current" ? "Enter current password" : field === "new_" ? "Enter new password" : "Confirm new password"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((p) => ({ ...p, [field]: !p[field] }))}
                  >
                    {showPassword[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Admin Account</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All admin privileges will be revoked immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-sm font-medium text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Warning
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Deleting your admin account will remove all your admin access, configurations, and audit history.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Type "DELETE" to confirm</Label>
              <Input placeholder='Type "DELETE"' />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={() => { toast.success("Account deletion scheduled"); setShowDeleteModal(false); }}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;
