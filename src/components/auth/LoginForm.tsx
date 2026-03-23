import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LoginFormProps {
  role: "company" | "admin";
  onForgotPassword: () => void;
  onSignup: () => void;
}

const LoginForm = ({ role, onForgotPassword, onSignup }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Logged in!", description: "Redirecting..." });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Username */}
      <div className="relative">
        <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={role === "admin" ? "Enter your email" : "Enter your username"}
          className="w-full bg-transparent border-b-2 border-border py-3 pl-7 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full bg-transparent border-b-2 border-border py-3 pr-10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          disabled={loading}
        />
        <button
          type="button"
          onClick={() => setShowPw(!showPw)}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
        >
          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <button
          onClick={onForgotPassword}
          className="text-xs text-primary font-medium hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login button */}
      <Button
        variant="hero"
        size="lg"
        className="w-full"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </Button>

      {/* Google login — only for company */}
      {role === "company" && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full gap-3"
            onClick={() => toast({ title: "Google login", description: "Enable Lovable Cloud to activate." })}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
            </svg>
            Continue with Google
          </Button>
        </>
      )}

      {/* Signup link — only for company */}
      {role === "company" && (
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={onSignup} className="text-primary font-medium hover:underline">
            Sign up
          </button>
        </p>
      )}
    </div>
  );
};

export default LoginForm;
