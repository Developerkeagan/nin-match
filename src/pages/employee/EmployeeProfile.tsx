import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, KeyRound, Save, Bell } from "lucide-react";
import { toast } from "sonner";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState({
    name: "Employee",
    username: "employee",
    email: "employee@gmail.com",
    phone: "+234 802 000 1122",
    nin: "12345678901",
    department: "Engineering",
    role: "Senior Engineer",
    company: "Acme Corp",
    address: "Lekki Phase 1, Lagos",
    bio: "Building reliable services for our customers.",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [notif, setNotif] = useState({ tasks: true, salary: true, attendance: true, memos: true });

  const save = () => toast.success("Profile updated");
  const savePw = () => {
    if (!pw.current || !pw.next) return toast.error("Fill all fields");
    if (pw.next !== pw.confirm) return toast.error("Passwords don't match");
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password changed");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">EM</AvatarFallback>
          </Avatar>
          <button onClick={() => toast.info("Avatar upload coming soon")} className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.role} · {profile.department}</p>
          <Badge variant="outline" className="mt-1">{profile.company}</Badge>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="work">Work</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>Full name</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                <div><Label>Username</Label><Input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
                <div><Label>NIN</Label><Input value={profile.nin} disabled /></div>
                <div><Label>Address</Label><Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
              </div>
              <div><Label>Bio</Label><Input value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Employment</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>Company</Label><Input value={profile.company} disabled /></div>
                <div><Label>Department</Label><Input value={profile.department} disabled /></div>
                <div><Label>Role</Label><Input value={profile.role} disabled /></div>
              </div>
              <p className="text-xs text-muted-foreground">Work fields are managed by your company HR.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><KeyRound className="h-4 w-4" /> Password</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Current password</Label><Input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>New password</Label><Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
                <div><Label>Confirm</Label><Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></div>
              </div>
              <Button onClick={savePw}>Update password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {([
                ["tasks", "Task assignments"],
                ["salary", "Salary & payslip updates"],
                ["attendance", "Attendance reminders"],
                ["memos", "Company memos"],
              ] as const).map(([k, l]) => (
                <div key={k} className="flex items-center justify-between border-b py-2 last:border-b-0">
                  <span className="text-sm">{l}</span>
                  <Switch checked={notif[k]} onCheckedChange={(v) => setNotif({ ...notif, [k]: v })} />
                </div>
              ))}
              <Button onClick={() => toast.success("Preferences saved")}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
