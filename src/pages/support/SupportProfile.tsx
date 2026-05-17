import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Headset, Save, KeyRound, Bell, Camera } from "lucide-react";
import { toast } from "sonner";

export default function SupportProfile() {
  const [profile, setProfile] = useState({
    name: "Customer Care",
    username: "customercare",
    email: "customercare@gmail.com",
    phone: "+234 800 000 0000",
    bio: "Frontline support specialist at Hiravel.",
    awayMode: false,
    autoReply: "Thanks for reaching out — a Hiravel agent will be with you shortly.",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [notif, setNotif] = useState({ newChat: true, escalation: true, email: false, sound: true });

  const save = () => toast.success("Profile updated");
  const savePw = () => {
    if (!pw.current || !pw.next) return toast.error("Fill all password fields");
    if (pw.next !== pw.confirm) return toast.error("Passwords don't match");
    if (pw.next.length < 6) return toast.error("Password too short");
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password changed");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">CC</AvatarFallback>
          </Avatar>
          <button onClick={() => toast.info("Avatar upload coming soon")} className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <Badge variant="outline" className="mt-1 gap-1 border-primary/30 text-primary">
            <Headset className="h-3 w-3" /> Customer Care Agent
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>Full name</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                <div><Label>Username</Label><Input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
              </div>
              <div><Label>Bio</Label><Input value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
              <Button onClick={save}><Save className="h-4 w-4 mr-2" /> Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><KeyRound className="h-4 w-4" /> Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label>Current password</Label><Input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><Label>New password</Label><Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
                <div><Label>Confirm new password</Label><Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></div>
              </div>
              <Button onClick={savePw}>Update password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {([
                ["newChat", "New chat alerts"],
                ["escalation", "Admin escalations"],
                ["email", "Email digests"],
                ["sound", "Sound notifications"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between border-b py-2 last:border-b-0">
                  <span className="text-sm">{label}</span>
                  <Switch checked={notif[key]} onCheckedChange={(v) => setNotif({ ...notif, [key]: v })} />
                </div>
              ))}
              <Button onClick={() => toast.success("Preferences saved")}>Save preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Availability & Auto-Reply</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="text-sm font-semibold">Away mode</p>
                  <p className="text-xs text-muted-foreground">Incoming chats receive your auto-reply</p>
                </div>
                <Switch checked={profile.awayMode} onCheckedChange={(v) => setProfile({ ...profile, awayMode: v })} />
              </div>
              <div>
                <Label>Auto-reply message</Label>
                <Input value={profile.autoReply} onChange={(e) => setProfile({ ...profile, autoReply: e.target.value })} />
              </div>
              <Button onClick={save}>Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
