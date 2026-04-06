import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CreditCard, Zap, Crown, Info, Download, Check, Sparkles, Database, BarChart3, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: 15,
    credits: 100,
    icon: Zap,
    features: ["100 Free Credits", "AI Chat", "AI Suggestions"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 30,
    credits: 200,
    icon: Crown,
    features: ["200 Free Credits", "AI Search", "Talent Pool Optimization", "AI Database Optimization", "Direct Analytics"],
    highlighted: true,
  },
];

const CREDIT_PACKAGES = [
  { amount: 100, price: 10 },
  { amount: 200, price: 20 },
  { amount: 500, price: 50 },
];

const BILLING_HISTORY = [
  { date: "2026-04-01", item: "Pro Plan – Monthly", amount: "$15.00", status: "Paid" },
  { date: "2026-03-20", item: "200 Credits", amount: "$20.00", status: "Paid" },
  { date: "2026-03-01", item: "Pro Plan – Monthly", amount: "$15.00", status: "Paid" },
  { date: "2026-02-15", item: "100 Credits", amount: "$10.00", status: "Paid" },
];

const featureIcons: Record<string, React.ElementType> = {
  "AI Search": Search,
  "Talent Pool Optimization": Users,
  "AI Database Optimization": Database,
  "Direct Analytics": BarChart3,
  "AI Chat": Sparkles,
  "AI Suggestions": Sparkles,
};

const Billing = () => {
  const [currentPlan] = useState("pro");
  const [credits] = useState(320);
  const [totalCredits] = useState(500);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(0);
  const [customCredits, setCustomCredits] = useState("");
  const [confirmModal, setConfirmModal] = useState<{ type: string; detail: string } | null>(null);
  const { toast } = useToast();

  const activePlan = PLANS.find((p) => p.id === currentPlan)!;

  const purchaseTotal = selectedPackage !== null
    ? CREDIT_PACKAGES[selectedPackage].price
    : customCredits
      ? Math.ceil(Number(customCredits) / 10)
      : 0;

  const handleConfirm = () => {
    toast({ title: "Success!", description: confirmModal?.detail });
    setConfirmModal(null);
  };

  return (
    <div className="max-w-6xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your plan, credits, and billing history</p>
      </div>

      {/* Current Plan */}
      <Card className="border-2 border-primary/30 shadow-md">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <activePlan.icon className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold font-display">{activePlan.name} Plan</h2>
              <Badge className="bg-primary/15 text-primary border-0 font-semibold">Active</Badge>
            </div>
            <p className="text-2xl font-bold font-display text-foreground">${activePlan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <p className="text-sm text-muted-foreground">{activePlan.credits} credits included · Next billing: May 1, 2026</p>
          </div>
          <Button
            variant="hero"
            size="lg"
            onClick={() => setConfirmModal({ type: "renew", detail: "Plan renewed successfully." })}
          >
            Renew Plan
          </Button>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-lg font-bold font-display text-foreground mb-4">Plans</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {PLANS.map((plan) => {
            const isActive = plan.id === currentPlan;
            return (
              <Card
                key={plan.id}
                className={`transition-all duration-200 hover:shadow-lg ${
                  plan.highlighted ? "border-2 border-amber-400/60 shadow-md" : ""
                } ${isActive ? "border-2 border-primary/40" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <plan.icon className={`h-5 w-5 ${plan.highlighted ? "text-amber-500" : "text-primary"}`} />
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                    </div>
                    {isActive && <Badge variant="secondary" className="text-xs">Current</Badge>}
                    {plan.highlighted && !isActive && <Badge className="bg-amber-500/15 text-amber-600 border-0 text-xs">Popular</Badge>}
                  </div>
                  <p className="text-3xl font-bold font-display mt-2">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-2.5">
                    {plan.features.map((f) => {
                      const Icon = featureIcons[f] || Check;
                      return (
                        <li key={f} className="flex items-center gap-2.5 text-sm">
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          {f}
                        </li>
                      );
                    })}
                  </ul>
                  <Button
                    variant={isActive ? "outline" : plan.highlighted ? "hero" : "default"}
                    className="w-full mt-4"
                    disabled={isActive}
                    onClick={() =>
                      !isActive && setConfirmModal({ type: "upgrade", detail: `Upgraded to ${plan.name} successfully.` })
                    }
                  >
                    {isActive ? "Current Plan" : plan.highlighted ? "Upgrade to Enterprise" : "Choose Pro"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Credits + Purchase */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Credit Balance */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Credit Balance</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent><p className="max-w-[200px] text-xs">Credits are consumed when using AI features, promotions, and advanced search.</p></TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-5xl font-bold font-display text-primary">{credits}</p>
              <p className="text-sm text-muted-foreground mt-1">Available Credits</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Used</span>
                <span>{credits} / {totalCredits}</span>
              </div>
              <Progress value={(credits / totalCredits) * 100} className="h-2.5" />
            </div>
            {credits < 50 && (
              <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-md font-medium">
                ⚠️ Low credits — purchase more to continue using AI features.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Purchase Credits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Purchase Credits</CardTitle>
            <CardDescription>$10 = 100 Credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {CREDIT_PACKAGES.map((pkg, i) => (
                <button
                  key={pkg.amount}
                  onClick={() => { setSelectedPackage(i); setCustomCredits(""); }}
                  className={`p-3 border-2 rounded-md text-center transition-all duration-150 hover:shadow-md ${
                    selectedPackage === i
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <p className="text-lg font-bold font-display">{pkg.amount}</p>
                  <p className="text-xs text-muted-foreground">credits</p>
                  <p className="text-sm font-semibold mt-1 text-primary">${pkg.price}</p>
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Or enter custom amount</label>
              <Input
                type="number"
                placeholder="e.g. 350"
                value={customCredits}
                onChange={(e) => { setCustomCredits(e.target.value); setSelectedPackage(null); }}
                min={10}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">Total: <span className="text-foreground font-bold text-lg">${purchaseTotal}</span></p>
              <Button
                disabled={purchaseTotal === 0}
                onClick={() => setConfirmModal({ type: "credits", detail: `${selectedPackage !== null ? CREDIT_PACKAGES[selectedPackage].amount : customCredits} credits purchased.` })}
              >
                <CreditCard className="h-4 w-4 mr-1.5" /> Buy Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          {BILLING_HISTORY.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BILLING_HISTORY.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm">{row.date}</TableCell>
                    <TableCell className="text-sm font-medium">{row.item}</TableCell>
                    <TableCell className="text-sm">{row.amount}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{row.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm">No billing history yet.</div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={!!confirmModal} onOpenChange={() => setConfirmModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>Are you sure you want to proceed?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmModal(null)}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
