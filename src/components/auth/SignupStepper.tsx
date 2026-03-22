import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check, X, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const STEPS = ["Basic Info", "Details", "Location", "Security", "Plan"];

const industries = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Other"];
const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];
const plans = [
  { id: "starter", name: "Starter", price: "₦15,000/mo", desc: "Up to 5 job posts" },
  { id: "business", name: "Business", price: "₦45,000/mo", desc: "Unlimited posts + AI ranking" },
  { id: "enterprise", name: "Enterprise", price: "Custom", desc: "Full API access + support" },
];

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
];

interface SignupStepperProps {
  onBack: () => void;
}

const SignupStepper = ({ onBack }: SignupStepperProps) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Form data
  const [data, setData] = useState({
    companyName: "", companyEmail: "", username: "",
    industry: "", companySize: "", website: "",
    country: "", state: "", city: "", address: "",
    password: "", confirmPassword: "",
    plan: "business",
  });

  const set = (field: string, value: string) => setData((d) => ({ ...d, [field]: value }));

  const canNext = () => {
    switch (step) {
      case 0: return data.companyName && data.companyEmail && data.username;
      case 1: return data.industry && data.companySize;
      case 2: return data.country && data.state && data.city;
      case 3: return passwordRules.every((r) => r.test(data.password)) && data.password === data.confirmPassword;
      case 4: return !!data.plan;
      default: return false;
    }
  };

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Account created!", description: "Please verify your email." });
      navigate("/verify-otp");
    }, 1500);
  };

  const inputClass = "w-full bg-transparent border-b-2 border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors";
  const selectClass = "w-full bg-transparent border-b-2 border-border py-3 text-foreground focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer";

  return (
    <div className="flex flex-col gap-6">
      {/* Back to login */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <ChevronLeft size={14} /> Back to login
      </button>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "border-2 border-primary text-primary"
                  : "border-2 border-border text-muted-foreground/40"
              }`}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">{STEPS[step]}</p>

      {/* Step content */}
      <div className="min-h-[200px]">
        {step === 0 && (
          <div className="flex flex-col gap-5 reveal-up">
            <input value={data.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Company Name" className={inputClass} />
            <input value={data.companyEmail} onChange={(e) => set("companyEmail", e.target.value)} placeholder="Company Email" type="email" className={inputClass} />
            <input value={data.username} onChange={(e) => set("username", e.target.value)} placeholder="Username" className={inputClass} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5 reveal-up">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Industry</label>
              <select value={data.industry} onChange={(e) => set("industry", e.target.value)} className={selectClass}>
                <option value="">Select industry</option>
                {industries.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Company Size</label>
              <select value={data.companySize} onChange={(e) => set("companySize", e.target.value)} className={selectClass}>
                <option value="">Select size</option>
                {companySizes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <input value={data.website} onChange={(e) => set("website", e.target.value)} placeholder="Website (optional)" className={inputClass} />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5 reveal-up">
            <input value={data.country} onChange={(e) => set("country", e.target.value)} placeholder="Country" className={inputClass} />
            <input value={data.state} onChange={(e) => set("state", e.target.value)} placeholder="State" className={inputClass} />
            <input value={data.city} onChange={(e) => set("city", e.target.value)} placeholder="City" className={inputClass} />
            <input value={data.address} onChange={(e) => set("address", e.target.value)} placeholder="Address (optional)" className={inputClass} />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5 reveal-up">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={data.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Password"
                className={`${inputClass} pr-10`}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="space-y-1.5">
              {passwordRules.map((r) => (
                <div key={r.label} className="flex items-center gap-2 text-xs">
                  {r.test(data.password) ? <Check size={14} className="text-primary" /> : <X size={14} className="text-muted-foreground/40" />}
                  <span className={r.test(data.password) ? "text-foreground" : "text-muted-foreground/60"}>{r.label}</span>
                </div>
              ))}
            </div>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={data.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                placeholder="Confirm Password"
                className={`${inputClass} pr-10`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {data.confirmPassword && data.password !== data.confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3 reveal-up">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => set("plan", p.id)}
                className={`text-left p-4 border transition-all duration-200 ${
                  data.plan === p.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold">{p.name}</span>
                  <span className="text-sm font-bold text-primary">{p.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button variant="hero" size="lg" className="flex-1" onClick={() => setStep(step + 1)} disabled={!canNext()}>
            Next
          </Button>
        ) : (
          <Button variant="hero" size="lg" className="flex-1" onClick={handleCreate} disabled={loading || !canNext()}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SignupStepper;
