import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  Bell,
  Globe,
  Shield,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Key,
  MonitorSmartphone,
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Languages,
  Palette,
  UserCog,
  Save,
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new_: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: "", new_: "", confirm: "" });
  const [hasChanges, setHasChanges] = useState(false);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    newApplications: true,
    promotionUpdates: true,
    creditAlerts: true,
    weeklyDigest: false,
    systemUpdates: true,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "africa-lagos",
    dateFormat: "dd-mm-yyyy",
    currency: "ngn",
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    allowAnalytics: true,
  });

  const [sessions] = useState([
    { device: "Chrome on Windows", location: "Lagos, Nigeria", lastActive: "Now", current: true },
    { device: "Safari on iPhone", location: "Lagos, Nigeria", lastActive: "2 hours ago", current: false },
    { device: "Firefox on MacOS", location: "Abuja, Nigeria", lastActive: "3 days ago", current: false },
  ]);

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updatePreference = (key: keyof typeof preferences, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updatePrivacy = (key: keyof typeof privacy, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
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

  const handleExportData = () => {
    toast.success("Data export started. You'll receive an email when ready.");
    setShowExportModal(false);
  };

  const handleDeleteAccount = () => {
    toast.success("Account deletion scheduled. You have 30 days to cancel.");
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences, security, and account</p>
      </div>

      {/* ─── Notifications ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what updates you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "emailAlerts" as const, label: "Email Alerts", desc: "Receive important alerts via email", icon: Mail },
            { key: "pushNotifications" as const, label: "Push Notifications", desc: "Browser push notifications", icon: Smartphone },
            { key: "newApplications" as const, label: "New Applications", desc: "When someone applies to your jobs", icon: UserCog },
            { key: "promotionUpdates" as const, label: "Promotion Updates", desc: "Campaign performance milestones", icon: Bell },
            { key: "creditAlerts" as const, label: "Credit Alerts", desc: "Low balance and usage warnings", icon: AlertTriangle },
            { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Summary of your weekly activity", icon: FileText },
            { key: "systemUpdates" as const, label: "System Updates", desc: "Platform maintenance and features", icon: Globe },
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

      {/* ─── Preferences ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Preferences
          </CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Languages className="h-3.5 w-3.5" /> Language
              </Label>
              <Select value={preferences.language} onValueChange={(v) => updatePreference("language", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="ha">Hausa</SelectItem>
                  <SelectItem value="yo">Yoruba</SelectItem>
                  <SelectItem value="ig">Igbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Timezone
              </Label>
              <Select value={preferences.timezone} onValueChange={(v) => updatePreference("timezone", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="africa-lagos">Africa/Lagos (WAT)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                  <SelectItem value="america-newyork">America/New York (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={preferences.dateFormat} onValueChange={(v) => updatePreference("dateFormat", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={preferences.currency} onValueChange={(v) => updatePreference("currency", v)}>
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

      {/* ─── Security ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Password */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Password</p>
                <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
              <Key className="h-4 w-4 mr-2" /> Change Password
            </Button>
          </div>

          <Separator />

          {/* Two-Factor Auth */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add extra security to your account</p>
              </div>
            </div>
            <Badge variant="outline" className="text-muted-foreground">Coming Soon</Badge>
          </div>

          <Separator />

          {/* Active Sessions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                  <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Active Sessions</p>
                  <p className="text-xs text-muted-foreground">Devices logged into your account</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleLogoutAll}>
                <LogOut className="h-4 w-4 mr-1" /> Logout All
              </Button>
            </div>
            <div className="space-y-2 ml-11">
              {sessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">
                      {s.device}
                      {s.current && <Badge className="ml-2 bg-primary/15 text-primary border-0 text-[10px]">Current</Badge>}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.location}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {s.lastActive}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Privacy ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Privacy
          </CardTitle>
          <CardDescription>Control your visibility and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "profileVisible" as const, label: "Public Profile", desc: "Allow candidates to view your company profile" },
            { key: "showEmail" as const, label: "Show Email", desc: "Display contact email on your profile" },
            { key: "allowAnalytics" as const, label: "Usage Analytics", desc: "Help us improve with anonymous usage data" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch checked={privacy[key]} onCheckedChange={(v) => updatePrivacy(key, v)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ─── Data Management ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>Export or manage your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Export Account Data</p>
              <p className="text-xs text-muted-foreground">Download all your data in a portable format</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
              <Download className="h-4 w-4 mr-2" /> Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Danger Zone ─── */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your account. You have 30 days to cancel.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Sticky Save Bar ─── */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-md p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
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

      {/* ─── Change Password Modal ─── */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
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
                    onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword({ ...showPassword, [field]: !showPassword[field] })}
                  >
                    {showPassword[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Export Data Modal ─── */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Account Data</DialogTitle>
            <DialogDescription>We'll prepare a download of all your data and send it to your email.</DialogDescription>
          </DialogHeader>
          <div className="py-2 text-sm text-muted-foreground space-y-2">
            <p>This includes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Company profile information</li>
              <li>Job listings and applications</li>
              <li>Billing and credit history</li>
              <li>Analytics and promotion data</li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" /> Start Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Account Modal ─── */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This will schedule your account for permanent deletion. You have 30 days to cancel this action. After that, all data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" /> Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
