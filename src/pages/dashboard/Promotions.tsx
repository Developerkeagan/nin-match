import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Upload,
  Image as ImageIcon,
  Video,
  Hash,
  AtSign,
  Twitter,
  Instagram,
  Send,
  Coins,
  Info,
  Megaphone,
  X,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Repeat2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// ── Types ──────────────────────────────────────────────────────────────
type Platform = "twitter" | "instagram" | "telegram";
type MediaType = "image" | "video" | null;
type Frequency = "1" | "3" | "5" | "7";
type Duration = "3" | "7" | "14" | "30";

interface PromotionConfig {
  media: MediaType;
  mediaPreviewUrl: string | null;
  caption: string;
  platforms: Platform[];
  frequency: Frequency;
  duration: Duration;
  tagAccount: boolean;
  handle: string;
}

// ── Credit cost logic ──────────────────────────────────────────────────
const PLATFORM_COST = 5;
const FREQUENCY_MULTIPLIER: Record<Frequency, number> = { "1": 1, "3": 2.5, "5": 4, "7": 6 };
const DURATION_MULTIPLIER: Record<Duration, number> = { "3": 1, "7": 2, "14": 3.5, "30": 6 };
const MEDIA_COST: Record<string, number> = { image: 2, video: 5 };

function calcCredits(c: PromotionConfig): number {
  const base = c.platforms.length * PLATFORM_COST;
  const media = c.media ? MEDIA_COST[c.media] : 0;
  const freq = FREQUENCY_MULTIPLIER[c.frequency];
  const dur = DURATION_MULTIPLIER[c.duration];
  return Math.round((base + media) * freq * dur);
}

// ── Platform preview components ────────────────────────────────────────
function TwitterPreview({ config }: { config: PromotionConfig }) {
  return (
    <div className="bg-card border rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">AC</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm text-foreground">Acme Corp</span>
            <span className="text-muted-foreground text-xs">@acmecorp · 1m</span>
          </div>
          <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
            {config.caption || "Your caption will appear here..."}
            {config.tagAccount && config.handle && (
              <span className="text-primary"> @{config.handle}</span>
            )}
          </p>
          {config.mediaPreviewUrl && (
            <div className="mt-2 rounded-xl overflow-hidden border bg-muted aspect-video flex items-center justify-center">
              {config.media === "video" ? (
                <Video className="h-10 w-10 text-muted-foreground" />
              ) : (
                <img src={config.mediaPreviewUrl} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          )}
          <div className="flex items-center justify-between mt-3 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <Repeat2 className="h-4 w-4" />
            <Heart className="h-4 w-4" />
            <Share2 className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InstagramPreview({ config }: { config: PromotionConfig }) {
  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">AC</div>
        <span className="font-semibold text-sm text-foreground">acmecorp</span>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground ml-auto" />
      </div>
      <div className="aspect-square bg-muted flex items-center justify-center border-y">
        {config.mediaPreviewUrl ? (
          config.media === "video" ? (
            <Video className="h-12 w-12 text-muted-foreground" />
          ) : (
            <img src={config.mediaPreviewUrl} alt="" className="w-full h-full object-cover" />
          )
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
        )}
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-4 text-foreground">
          <Heart className="h-5 w-5" />
          <MessageCircle className="h-5 w-5" />
          <Share2 className="h-5 w-5" />
          <Bookmark className="h-5 w-5 ml-auto" />
        </div>
        <p className="text-sm text-foreground">
          <span className="font-semibold">acmecorp</span>{" "}
          <span className="whitespace-pre-wrap break-words">
            {config.caption || "Your caption here..."}
            {config.tagAccount && config.handle && (
              <span className="text-primary"> @{config.handle}</span>
            )}
          </span>
        </p>
      </div>
    </div>
  );
}

function TelegramPreview({ config }: { config: PromotionConfig }) {
  return (
    <div className="bg-card border rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">AC</div>
        <span className="font-semibold text-sm text-foreground">Acme Corp Channel</span>
      </div>
      {config.mediaPreviewUrl && (
        <div className="rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
          {config.media === "video" ? (
            <Video className="h-10 w-10 text-muted-foreground" />
          ) : (
            <img src={config.mediaPreviewUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      )}
      <p className="text-sm text-foreground whitespace-pre-wrap break-words">
        {config.caption || "Your message will appear here..."}
        {config.tagAccount && config.handle && (
          <span className="text-primary"> @{config.handle}</span>
        )}
      </p>
      <div className="flex items-center gap-3 pt-1 text-muted-foreground text-xs">
        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> 1.2k</span>
        <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> 48</span>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
const Promotions = () => {
  const isMobile = useIsMobile();
  const [config, setConfig] = useState<PromotionConfig>({
    media: null,
    mediaPreviewUrl: null,
    caption: "",
    platforms: [],
    frequency: "1",
    duration: "7",
    tagAccount: false,
    handle: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const credits = useMemo(() => calcCredits(config), [config]);
  const userCredits = 500; // mock balance

  const update = useCallback(
    <K extends keyof PromotionConfig>(key: K, value: PromotionConfig[K]) =>
      setConfig((p) => ({ ...p, [key]: value })),
    [],
  );

  const togglePlatform = (p: Platform) =>
    setConfig((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video");
    update("media", isVideo ? "video" : "image");
    update("mediaPreviewUrl", URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!config.caption.trim()) {
      toast({ title: "Caption required", description: "Please write a caption for your promotion.", variant: "destructive" });
      return;
    }
    if (config.platforms.length === 0) {
      toast({ title: "Select platforms", description: "Choose at least one platform.", variant: "destructive" });
      return;
    }
    if (credits > userCredits) {
      toast({ title: "Insufficient credits", description: `You need ${credits} credits but only have ${userCredits}.`, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Promotion started! 🚀", description: `${credits} credits deducted. Your campaign is live.` });
    }, 1500);
  };

  // ── Render helpers ──────────────────────────────────────────────────
  const platformButtons: { id: Platform; label: string; icon: React.ReactNode }[] = [
    { id: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" /> },
    { id: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { id: "telegram", label: "Telegram", icon: <Send className="h-4 w-4" /> },
  ];

  const ConfigPanel = (
    <div className="space-y-6">
      {/* Credit Counter */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Estimated Cost</p>
              <p className="text-xs text-muted-foreground">Balance: {userCredits} credits</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{credits}</p>
            <p className="text-xs text-muted-foreground">credits</p>
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" /> Media Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {config.mediaPreviewUrl ? (
            <div className="relative rounded-lg overflow-hidden border bg-muted aspect-video flex items-center justify-center">
              {config.media === "video" ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Video className="h-10 w-10" />
                  <span className="text-xs">Video uploaded</span>
                </div>
              ) : (
                <img src={config.mediaPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => { update("media", null); update("mediaPreviewUrl", null); }}
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium text-foreground">Drop media here or click to upload</span>
              <span className="text-xs text-muted-foreground mt-1">Images or videos supported</span>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </CardContent>
      </Card>

      {/* Caption */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Hash className="h-4 w-4" /> Caption
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder="Write your promotion caption... Use #hashtags and @mentions"
            value={config.caption}
            onChange={(e) => update("caption", e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={2200}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> Hashtags</span>
              <span className="flex items-center gap-1"><AtSign className="h-3 w-3" /> Mentions</span>
            </div>
            <span>{config.caption.length}/2200</span>
          </div>
        </CardContent>
      </Card>

      {/* Platform Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4" /> Platforms
            <Tooltip>
              <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
              <TooltipContent>Each platform adds {PLATFORM_COST} credits to base cost</TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {platformButtons.map((p) => {
              const active = config.platforms.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {p.icon} {p.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Frequency & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={config.frequency} onValueChange={(v) => update("frequency", v as Frequency)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x / week</SelectItem>
                <SelectItem value="3">3x / week</SelectItem>
                <SelectItem value="5">5x / week</SelectItem>
                <SelectItem value="7">Daily</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={config.duration} onValueChange={(v) => update("duration", v as Duration)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">1 week</SelectItem>
                <SelectItem value="14">2 weeks</SelectItem>
                <SelectItem value="30">1 month</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Tagging */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tagging</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="tag-toggle" className="text-sm">Tag my account</Label>
            <Switch id="tag-toggle" checked={config.tagAccount} onCheckedChange={(v) => update("tagAccount", v)} />
          </div>
          {config.tagAccount && (
            <Input
              placeholder="Your handle (e.g. acmecorp)"
              value={config.handle}
              onChange={(e) => update("handle", e.target.value)}
            />
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={submitting}
        variant="cta"
        size="lg"
        className="w-full"
      >
        {submitting ? "Launching..." : `Start Promotion · ${credits} credits`}
      </Button>
    </div>
  );

  const PreviewPanel = (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</h3>
      {config.platforms.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <Eye className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Select a platform to see your post preview</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {config.platforms.includes("twitter") && (
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Twitter</Badge>
              <TwitterPreview config={config} />
            </div>
          )}
          {config.platforms.includes("instagram") && (
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Instagram</Badge>
              <InstagramPreview config={config} />
            </div>
          )}
          {config.platforms.includes("telegram") && (
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Telegram</Badge>
              <TelegramPreview config={config} />
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Promotions</h1>
        <p className="text-muted-foreground text-sm mt-1">Create and manage promotional campaigns</p>
      </div>

      {/* Layout */}
      {isMobile ? (
        <div className="space-y-8">
          {ConfigPanel}
          <Separator />
          {PreviewPanel}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-6 items-start">
          <div className="col-span-3">{ConfigPanel}</div>
          <div className="col-span-2 sticky top-20">{PreviewPanel}</div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
