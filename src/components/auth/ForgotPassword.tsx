import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast({ title: "Link sent!", description: "Check your email for the reset link." });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <ChevronLeft size={14} /> Back to login
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we'll send you a magic link
        </p>
      </div>

      {sent ? (
        <div className="text-center py-8 reveal-up">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary text-xl">✓</span>
          </div>
          <p className="text-sm text-foreground font-medium">
            A reset link has been sent to your email
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Check your inbox and click the link to reset your password
          </p>
        </div>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-transparent border-b-2 border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            disabled={loading}
          />
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleSend}
            disabled={loading || !email}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Send Magic Link"
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
