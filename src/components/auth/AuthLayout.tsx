import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
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
            Hire<span className="text-primary">On</span>
          </button>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Welcome back
          </p>
        </div>

        {/* Auth content */}
        {children}

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-muted-foreground/60">
          © 2026 HireOn. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
