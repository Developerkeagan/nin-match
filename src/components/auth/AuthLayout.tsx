import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  role: "company" | "admin";
  onRoleToggle: () => void;
}

const AuthLayout = ({ children, role, onRoleToggle }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="font-display text-2xl font-bold text-foreground tracking-tight inline-block"
          >
            NIN<span className="text-primary">Jobs</span>
          </button>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {role === "company" ? "Company Login" : "Admin Login"}
          </p>
          <button
            onClick={onRoleToggle}
            className="mt-1 text-xs text-primary hover:underline font-medium"
          >
            {role === "company" ? "Login as Admin" : "Login as Company"}
          </button>
        </div>

        {/* Auth content */}
        {children}

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-muted-foreground/60">
          © 2026 NINJobs. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
