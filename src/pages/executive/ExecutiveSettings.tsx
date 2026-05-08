import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Building2, User, Bell, Shield, Users, Wallet, Save, Camera, Trash2, Plus,
  Lock, Eye, EyeOff, LogOut, Smartphone, Mail, Globe, Calendar, Download,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ExecutiveSettings = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("workspace");

  const [company, setCompany] = useState({
    name: "Acme Corp", legalName: "Acme Corporation Ltd.",
    website: "https://acmecorp.io", email: "hello@acmecorp.io",
    phone: "+234 801 555 0199", address: "12 Adeola Odeku, Victoria Island, Lagos",
    timezone: "Africa/Lagos", currency: "NGN", fiscalYearStart: "January",
    workingHours: "09:00 - 17:00", workingDays: "Mon-Fri",
    description: "Building tools that help African businesses scale operations.",
  });

  const [profile, setProfile] = useState({
    fullName: "Adaeze Chen", email: "adaeze@acmecorp.io", phone: "+234 803 222 1188",
    role: "Chief Operating Officer", username: "adaeze_acme",
  });

  const [notifs, setNotifs] = useState({
    payrollAlerts: true, leaveRequests: true, performanceReviews: true,
    taskAssignments: true, weeklyDigest: true, mentions: true,
    emailNotifs: true, pushNotifs: true, smsAlerts: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: true, sessionTimeout: "30",
    loginAlerts: true, ipWhitelist: false,
  });

  const [policies, setPolicies] = useState({
    leaveDaysAnnual: 21, sickDaysAnnual: 14, probationMonths: 3,
    overtimeRate: 1.5, payrollDay: 25, autoApproveLeave: false,
    enforceClockIn: true, lateThresholdMinutes: 15,
  });

  const [departments, setDepartments] = useState([
    "Engineering", "Sales", "Marketing", "Operations", "Customer Support", "Finance",
  ]);
  const [newDept, setNewDept] = useState("");
  const [pwOpen, setPwOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ current: "", new_: "", confirm: "" });

  const sessions = [
    { device: "MacBook Pro", browser: "Chrome 128", location: "Lagos, NG", current: true, lastActive: "Active now" },
    { device: "iPhone 15", browser: "Safari", location: "Lagos, NG", current: false, lastActive: "2 hours ago" },
    { device: "Windows PC", browser: "Edge", location: "Abuja, NG", current: false, lastActive: "Yesterday" },
  ];

  const save = (what: string) => toast.success(`${what} saved successfully`);

  const addDepartment = () => {
    if (!newDept.trim()) return;
    if (departments.includes(newDept.trim())) { toast.error("Department already exists"); return; }
    setDepartments((p) => [...p, newDept.trim()]);
    setNewDept("");
    toast.success("Department added");
  };

  const removeDepartment = (d: string) => {
    setDepartments((p) => p.filter((x) => x !== d));
    toast.success("Department removed");
  };

  const changePassword = () => {
    if (!pw.current || !pw.new_ || !pw.confirm) { toast.error("Fill all fields"); return; }
    if (pw.new_ !== pw.confirm) { toast.error("Passwords don't match"); return; }
    if (pw.new_.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setPw({ current: "", new_: "", confirm: "" });
    setPwOpen(false);
    toast.success("Password changed successfully");
  };

  const exportData = () => {
    toast.success("Export started — you'll receive a download link via email");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Workspace Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your executive dashboard and company workspace</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" /> Export Workspace Data
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="rounded-none flex-wrap h-auto justify-start">
          <TabsTrigger value="workspace" className="rounded-none"><Building2 className="h-4 w-4 mr-2" />Workspace</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-none"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-none"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="rounded-none"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
          <TabsTrigger value="hr" className="rounded-none"><Users className="h-4 w-4 mr-2" />HR Policies</TabsTrigger>
          <TabsTrigger value="billing" className="rounded-none"><Wallet className="h-4 w-4 mr-2" />Billing</TabsTrigger>
        </TabsList>

        {/* Workspace */}
        <TabsContent value="workspace" className="space-y-4">
          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Company Profile</CardTitle>
              <CardDescription>Public information about your company workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/15 text-primary flex items-center justify-center font-bold text-xl">AC</div>
                <Button variant="outline" className="rounded-none" onClick={() => toast.info("Logo upload coming soon")}>
                  <Camera className="h-4 w-4 mr-2" /> Change logo
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Display name</Label>
                  <Input className="rounded-none" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Legal name</Label>
                  <Input className="rounded-none" value={company.legalName} onChange={(e) => setCompany({ ...company, legalName: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Website</Label>
                  <Input className="rounded-none" value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Contact email</Label>
                  <Input className="rounded-none" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input className="rounded-none" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Address</Label>
                  <Input className="rounded-none" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="text-xs">About</Label>
                <Textarea className="rounded-none" rows={3} value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} />
              </div>
              <div className="flex justify-end">
                <Button className="rounded-none" onClick={() => save("Company profile")}><Save className="h-4 w-4 mr-2" />Save changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Regional & Operations</CardTitle>
              <CardDescription>Time zone, currency and working calendar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Timezone</Label>
                  <Select value={company.timezone} onValueChange={(v) => setCompany({ ...company, timezone: v })}>
                    <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Select value={company.currency} onValueChange={(v) => setCompany({ ...company, currency: v })}>
                    <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN — Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                      <SelectItem value="GBP">GBP — British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Fiscal year start</Label>
                  <Select value={company.fiscalYearStart} onValueChange={(v) => setCompany({ ...company, fiscalYearStart: v })}>
                    <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["January", "April", "July", "October"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Working hours</Label>
                  <Input className="rounded-none" value={company.workingHours} onChange={(e) => setCompany({ ...company, workingHours: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Working days</Label>
                  <Input className="rounded-none" value={company.workingDays} onChange={(e) => setCompany({ ...company, workingDays: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="rounded-none" onClick={() => save("Regional settings")}><Save className="h-4 w-4 mr-2" />Save</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Departments</CardTitle>
              <CardDescription>Manage organizational departments used across workforce, salary and performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {departments.map((d) => (
                  <Badge key={d} variant="outline" className="rounded-none gap-2 py-1.5 pl-2.5 pr-1">
                    {d}
                    <button onClick={() => removeDepartment(d)} className="hover:bg-destructive/10 hover:text-destructive p-0.5">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 max-w-md">
                <Input placeholder="New department name" className="rounded-none" value={newDept}
                  onChange={(e) => setNewDept(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDepartment()} />
                <Button className="rounded-none" onClick={addDepartment}><Plus className="h-4 w-4 mr-1" />Add</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Personal Information</CardTitle>
              <CardDescription>Your account details on the executive workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/15 text-primary text-lg font-bold">AC</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="rounded-none" onClick={() => toast.info("Avatar upload coming soon")}>
                  <Camera className="h-4 w-4 mr-2" /> Change photo
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Full name</Label>
                  <Input className="rounded-none" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Username</Label>
                  <Input className="rounded-none" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input className="rounded-none" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input className="rounded-none" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs">Role</Label>
                  <Input className="rounded-none" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="rounded-none" onClick={() => save("Profile")}><Save className="h-4 w-4 mr-2" />Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Notification Preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "payrollAlerts", label: "Payroll alerts", desc: "Pre and post payroll run notifications" },
                { key: "leaveRequests", label: "Leave requests", desc: "When employees submit leave for approval" },
                { key: "performanceReviews", label: "Performance reviews", desc: "Review cycle reminders and submissions" },
                { key: "taskAssignments", label: "Task assignments", desc: "When you're assigned or mentioned in tasks" },
                { key: "weeklyDigest", label: "Weekly digest", desc: "A summary of your workspace every Monday" },
                { key: "mentions", label: "Mentions", desc: "When someone mentions you in a memo or comment" },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch checked={notifs[n.key as keyof typeof notifs]} onCheckedChange={(v) => setNotifs({ ...notifs, [n.key]: v })} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Delivery Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { key: "emailNotifs", label: "Email", icon: Mail },
                { key: "pushNotifs", label: "Push notifications", icon: Bell },
                { key: "smsAlerts", label: "SMS (urgent only)", icon: Smartphone },
              ].map((c) => (
                <div key={c.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <c.icon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">{c.label}</p>
                  </div>
                  <Switch checked={notifs[c.key as keyof typeof notifs]} onCheckedChange={(v) => setNotifs({ ...notifs, [c.key]: v })} />
                </div>
              ))}
              <div className="flex justify-end pt-3">
                <Button className="rounded-none" onClick={() => save("Notification preferences")}><Save className="h-4 w-4 mr-2" />Save preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-4">
          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm font-semibold text-foreground">Password</p>
                  <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                </div>
                <Button variant="outline" className="rounded-none" onClick={() => setPwOpen(true)}>
                  <Lock className="h-4 w-4 mr-2" />Change password
                </Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm font-semibold text-foreground">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Adds a second verification step at login</p>
                </div>
                <Switch checked={security.twoFactor} onCheckedChange={(v) => { setSecurity({ ...security, twoFactor: v }); toast.success(`2FA ${v ? "enabled" : "disabled"}`); }} />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm font-semibold text-foreground">Login alerts</p>
                  <p className="text-xs text-muted-foreground">Email me when a new device signs in</p>
                </div>
                <Switch checked={security.loginAlerts} onCheckedChange={(v) => setSecurity({ ...security, loginAlerts: v })} />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm font-semibold text-foreground">IP whitelist</p>
                  <p className="text-xs text-muted-foreground">Restrict admin access to specific networks</p>
                </div>
                <Switch checked={security.ipWhitelist} onCheckedChange={(v) => setSecurity({ ...security, ipWhitelist: v })} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Session timeout</p>
                  <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                </div>
                <Select value={security.sessionTimeout} onValueChange={(v) => setSecurity({ ...security, sessionTimeout: v })}>
                  <SelectTrigger className="w-[140px] rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="rounded-none" onClick={() => save("Security settings")}><Save className="h-4 w-4 mr-2" />Save</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Active Sessions</CardTitle>
              <CardDescription>Devices currently signed in to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 border">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        {s.device} <span className="text-xs font-normal text-muted-foreground">· {s.browser}</span>
                        {s.current && <Badge className="rounded-none text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Current</Badge>}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{s.location} · {s.lastActive}</p>
                    </div>
                  </div>
                  {!s.current && (
                    <Button variant="outline" size="sm" className="rounded-none" onClick={() => toast.success(`${s.device} signed out`)}>
                      <LogOut className="h-3.5 w-3.5 mr-1" /> Sign out
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" className="rounded-none w-full" onClick={() => toast.success("Signed out of all other sessions")}>
                Sign out of all other sessions
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-none border border-destructive/40">
            <CardHeader>
              <CardTitle className="text-base font-display text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Delete workspace</p>
                <p className="text-xs text-muted-foreground">Permanently remove this workspace and all its data.</p>
              </div>
              <Button variant="destructive" className="rounded-none" onClick={() => setDelOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete workspace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HR Policies */}
        <TabsContent value="hr" className="space-y-4">
          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Leave & Time-off Policy</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Annual leave (days)</Label>
                <Input type="number" className="rounded-none" value={policies.leaveDaysAnnual} onChange={(e) => setPolicies({ ...policies, leaveDaysAnnual: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="text-xs">Sick leave (days)</Label>
                <Input type="number" className="rounded-none" value={policies.sickDaysAnnual} onChange={(e) => setPolicies({ ...policies, sickDaysAnnual: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="text-xs">Probation (months)</Label>
                <Input type="number" className="rounded-none" value={policies.probationMonths} onChange={(e) => setPolicies({ ...policies, probationMonths: Number(e.target.value) })} />
              </div>
              <div className="md:col-span-3 flex items-center justify-between border-t pt-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Auto-approve leave under 2 days</p>
                  <p className="text-xs text-muted-foreground">Skip manager approval for short requests</p>
                </div>
                <Switch checked={policies.autoApproveLeave} onCheckedChange={(v) => setPolicies({ ...policies, autoApproveLeave: v })} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Payroll & Compensation</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Payroll run day</Label>
                <Input type="number" min={1} max={28} className="rounded-none" value={policies.payrollDay} onChange={(e) => setPolicies({ ...policies, payrollDay: Number(e.target.value) })} />
                <p className="text-[11px] text-muted-foreground mt-1">Salaries are processed on this day each month</p>
              </div>
              <div>
                <Label className="text-xs">Overtime rate multiplier</Label>
                <Input type="number" step="0.1" className="rounded-none" value={policies.overtimeRate} onChange={(e) => setPolicies({ ...policies, overtimeRate: Number(e.target.value) })} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Attendance Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Enforce daily clock-in</p>
                  <p className="text-xs text-muted-foreground">Employees must clock in via the platform</p>
                </div>
                <Switch checked={policies.enforceClockIn} onCheckedChange={(v) => setPolicies({ ...policies, enforceClockIn: v })} />
              </div>
              <div className="max-w-xs">
                <Label className="text-xs">Late threshold (minutes)</Label>
                <Input type="number" className="rounded-none" value={policies.lateThresholdMinutes} onChange={(e) => setPolicies({ ...policies, lateThresholdMinutes: Number(e.target.value) })} />
              </div>
              <div className="flex justify-end">
                <Button className="rounded-none" onClick={() => save("HR policies")}><Save className="h-4 w-4 mr-2" />Save policies</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-4">
          <Card className="rounded-none border">
            <CardHeader>
              <CardTitle className="text-base font-display">Workspace Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge className="rounded-none mb-2 bg-primary/10 text-primary">Enterprise</Badge>
                  <p className="text-2xl font-bold font-display text-foreground">₦450,000<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <p className="text-xs text-muted-foreground mt-1">Up to 500 employees · Unlimited tasks · Priority support</p>
                  <p className="text-xs text-muted-foreground mt-3">Next billing date: <span className="text-foreground font-medium">May 25, 2026</span></p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="rounded-none" onClick={() => navigate("/dashboard/billing")}>
                    Manage billing
                  </Button>
                  <Button variant="ghost" className="rounded-none text-xs" onClick={() => toast.info("Invoice history opening")}>
                    View invoices
                  </Button>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 border">
                  <p className="text-xs text-muted-foreground">Employees</p>
                  <p className="text-xl font-bold text-foreground">248<span className="text-xs font-normal text-muted-foreground">/500</span></p>
                </div>
                <div className="p-3 border">
                  <p className="text-xs text-muted-foreground">Storage</p>
                  <p className="text-xl font-bold text-foreground">42<span className="text-xs font-normal text-muted-foreground">/100 GB</span></p>
                </div>
                <div className="p-3 border">
                  <p className="text-xs text-muted-foreground">API calls</p>
                  <p className="text-xl font-bold text-foreground">12.4K<span className="text-xs font-normal text-muted-foreground">/50K</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Change password */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent className="sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>Choose a strong password you don't use elsewhere.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { key: "current", label: "Current password" },
              { key: "new_", label: "New password" },
              { key: "confirm", label: "Confirm new password" },
            ].map((f) => (
              <div key={f.key}>
                <Label className="text-xs">{f.label}</Label>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} className="rounded-none pr-10"
                    value={pw[f.key as keyof typeof pw]}
                    onChange={(e) => setPw({ ...pw, [f.key]: e.target.value })} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setPwOpen(false)}>Cancel</Button>
            <Button className="rounded-none" onClick={changePassword}>Update password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete workspace */}
      <Dialog open={delOpen} onOpenChange={setDelOpen}>
        <DialogContent className="sm:max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete this workspace?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All employee records, payroll history, tasks and settings will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDelOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="rounded-none" onClick={() => { setDelOpen(false); toast.success("Deletion request submitted"); }}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExecutiveSettings;
