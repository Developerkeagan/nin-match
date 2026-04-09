import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Save,
  Shield,
  Trash2,
  Mail,
  CreditCard,
  ArrowUpRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new_: false, confirm: false });

  const [profile, setProfile] = useState({
    name: "Acme Corp",
    email: "hello@acmecorp.io",
    phone: "+234 801 234 5678",
    industry: "technology",
    size: "50-200",
    website: "https://acmecorp.io",
    address: "123 Victoria Island, Lagos, Nigeria",
  });

  const [passwords, setPasswords] = useState({ current: "", new_: "", confirm: "" });
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }, 1000);
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

  const handleDeleteAccount = () => {
    toast.success("Account deletion request submitted");
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/15 text-primary flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 border-border">
                AC
              </div>
              <button className="absolute inset-0 rounded-full bg-foreground/60 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">Acme Corp</h1>
                <Badge className="bg-primary/15 text-primary border-0">Active</Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">HO-463633</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined January 2026
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
          <CardDescription>Manage your company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select
                value={profile.industry}
                onValueChange={(v) => setProfile({ ...profile, industry: v })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Company Size</Label>
              <Select
                value={profile.size}
                onValueChange={(v) => setProfile({ ...profile, size: v })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1–10 employees</SelectItem>
                  <SelectItem value="11-50">11–50 employees</SelectItem>
                  <SelectItem value="50-200">50–200 employees</SelectItem>
                  <SelectItem value="200-500">200–500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription & Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subscription & Billing</CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Plan Card */}
            <div className="flex-1 rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-xl font-bold text-foreground">Business</p>
                </div>
                <Badge className="bg-primary/15 text-primary border-0">Active</Badge>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">$15<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="text-xs text-muted-foreground mt-1">Next billing: Feb 1, 2026</p>
            </div>

            {/* Usage */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Credits remaining</span>
                  <span className="font-semibold text-foreground">67 / 100</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Jobs posted this month</span>
                <span className="font-semibold text-foreground">4</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI matches used</span>
                <span className="font-semibold text-foreground">23</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/dashboard/billing")}>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/billing")}>
              <CreditCard className="h-4 w-4 mr-2" />
              Billing History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
            </div>
            <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">Email Verification</p>
              <Badge className="bg-primary/15 text-primary border-0 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your account and all data</p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and a new password.</DialogDescription>
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
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your data will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyProfile;
