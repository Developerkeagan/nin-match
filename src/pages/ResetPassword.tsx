import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Check, X } from "lucide-react";

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
];

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const allValid = rules.every((r) => r.test(password)) && password === confirm && password.length > 0;

  const handleReset = () => {
    if (!allValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Password updated!", description: "You can now log in with your new password." });
      navigate("/auth");
    }, 1500);
  };

  return (
    <AuthLayout role="company" onRoleToggle={() => {}}>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a new password for your account
          </p>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">New Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-transparent border-b-2 border-border py-3 pr-10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Password rules */}
        <div className="space-y-1.5">
          {rules.map((r) => (
            <div key={r.label} className="flex items-center gap-2 text-xs">
              {r.test(password) ? (
                <Check size={14} className="text-primary" />
              ) : (
                <X size={14} className="text-muted-foreground/40" />
              )}
              <span className={r.test(password) ? "text-foreground" : "text-muted-foreground/60"}>
                {r.label}
              </span>
            </div>
          ))}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-transparent border-b-2 border-border py-3 pr-10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirm.length > 0 && password !== confirm && (
            <p className="text-xs text-destructive mt-1">Passwords do not match</p>
          )}
        </div>

        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleReset}
          disabled={loading || !allValid}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
