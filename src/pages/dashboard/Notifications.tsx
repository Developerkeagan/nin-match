import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Megaphone,
  Wallet,
  UserRound,
  AlertTriangle,
  CheckCheck,
  Settings,
  BellOff,
  ChevronRight,
  Mail,
  Smartphone,
  Volume2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type NotificationType = "promotion" | "credit" | "talent" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  // Today
  { id: "1", type: "promotion", title: "Campaign started", description: "Your 'Senior Dev' promotion is now live on Twitter and Instagram.", timestamp: "10 mins ago", read: false, link: "/dashboard/promotions" },
  { id: "2", type: "talent", title: "New candidate match", description: "A candidate with 95% AI match applied to your Frontend Developer role.", timestamp: "32 mins ago", read: false, link: "/dashboard/candidates" },
  { id: "3", type: "credit", title: "Credits low warning", description: "You have 15 credits remaining. Purchase more to continue promotions.", timestamp: "1 hour ago", read: false, link: "/dashboard/billing" },
  { id: "4", type: "promotion", title: "Post reached 5,000 views", description: "Your Instagram campaign for Product Manager hit 5K views.", timestamp: "2 hours ago", read: true, link: "/dashboard/promotions" },
  // Yesterday
  { id: "5", type: "talent", title: "Candidate applied", description: "John D. applied to your Backend Engineer role.", timestamp: "Yesterday", read: true, link: "/dashboard/applications" },
  { id: "6", type: "credit", title: "100 credits added", description: "Your credit purchase of $10 was successful.", timestamp: "Yesterday", read: true, link: "/dashboard/billing" },
  { id: "7", type: "system", title: "Scheduled maintenance", description: "Platform maintenance is scheduled for Sunday 2:00 AM – 4:00 AM UTC.", timestamp: "Yesterday", read: true },
  // Earlier
  { id: "8", type: "promotion", title: "Campaign completed", description: "Your 7-day Telegram promotion has ended with 12,400 impressions.", timestamp: "3 days ago", read: true, link: "/dashboard/analytics" },
  { id: "9", type: "talent", title: "New candidate matched", description: "3 new candidates matched your UX Designer job posting.", timestamp: "4 days ago", read: true, link: "/dashboard/candidates" },
  { id: "10", type: "system", title: "Terms of Service updated", description: "We've updated our Terms of Service. Please review the changes.", timestamp: "5 days ago", read: true },
];

const typeConfig: Record<NotificationType, { icon: typeof Megaphone; color: string; bg: string }> = {
  promotion: { icon: Megaphone, color: "text-primary", bg: "bg-primary/10" },
  credit: { icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10" },
  talent: { icon: UserRound, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  system: { icon: AlertTriangle, color: "text-muted-foreground", bg: "bg-muted" },
};

function groupByDate(notifications: Notification[]) {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];
  notifications.forEach((n) => {
    if (n.timestamp === "Yesterday") yesterday.push(n);
    else if (n.timestamp.includes("day") || n.timestamp.includes("week")) earlier.push(n);
    else today.push(n);
  });
  return { today, yesterday, earlier };
}

const NotificationCard = ({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  const handleClick = () => {
    onRead(notification.id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <Card
      onClick={handleClick}
      className={`group cursor-pointer transition-all duration-200 hover:shadow-md border ${
        notification.read ? "bg-background" : "bg-accent/40 border-primary/20"
      }`}
    >
      <CardContent className="flex items-start gap-4 p-4">
        {/* Icon */}
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm truncate ${notification.read ? "font-medium text-foreground" : "font-bold text-foreground"}`}>
              {notification.title}
            </p>
            {!notification.read && (
              <span className="shrink-0 w-2 h-2 rounded-full bg-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.description}</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1.5">{notification.timestamp}</p>
        </div>

        {/* Action */}
        {notification.link && (
          <ChevronRight className="shrink-0 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
        )}
      </CardContent>
    </Card>
  );
};

const DateGroup = ({
  label,
  notifications,
  onRead,
}: {
  label: string;
  notifications: Notification[];
  onRead: (id: string) => void;
}) => {
  if (notifications.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{label}</p>
      <div className="space-y-2">
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} onRead={onRead} />
        ))}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      <BellOff className="h-8 w-8 text-muted-foreground" />
    </div>
    <p className="text-base font-semibold text-foreground">No notifications yet</p>
    <p className="text-sm text-muted-foreground mt-1">Your updates will appear here</p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="flex items-start gap-4 p-4">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");
  const [loading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ title: "All caught up", description: "All notifications marked as read." });
  };

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => {
          if (activeTab === "promotions") return n.type === "promotion";
          if (activeTab === "credits") return n.type === "credit";
          if (activeTab === "talent") return n.type === "talent";
          if (activeTab === "system") return n.type === "system";
          return true;
        });

  const { today, yesterday, earlier } = groupByDate(filtered);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="default" className="text-[11px] px-2 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Stay updated with your activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4 mr-1.5" />
            Mark all read
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="talent">Talent</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          <DateGroup label="Today" notifications={today} onRead={markAsRead} />
          <DateGroup label="Yesterday" notifications={yesterday} onRead={markAsRead} />
          <DateGroup label="Earlier" notifications={earlier} onRead={markAsRead} />
        </div>
      )}
    </div>
  );
};

export default Notifications;
