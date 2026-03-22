import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";

const VerifyOTP = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    if (code.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Email verified!", description: "Redirecting to dashboard..." });
      navigate("/");
    }, 1500);
  };

  const handleResend = () => {
    toast({ title: "Code resent", description: "Check your email for a new verification code." });
  };

  return (
    <AuthLayout role="company" onRoleToggle={() => {}}>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the code sent to your email
          </p>
        </div>

        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="w-12 h-14 text-xl font-display font-bold border-border"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button
          variant="hero"
          size="lg"
          className="w-full"
          onClick={handleVerify}
          disabled={loading || code.length < 6}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify"
          )}
        </Button>

        <p className="text-sm text-muted-foreground">
          Didn't receive code?{" "}
          <button
            onClick={handleResend}
            className="text-primary font-medium hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
