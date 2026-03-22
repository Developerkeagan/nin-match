import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupStepper from "@/components/auth/SignupStepper";
import ForgotPassword from "@/components/auth/ForgotPassword";

type AuthView = "login" | "signup" | "forgot";

const Auth = () => {
  const [view, setView] = useState<AuthView>("login");
  const [role, setRole] = useState<"company" | "admin">("company");
  const navigate = useNavigate();

  return (
    <AuthLayout
      role={role}
      onRoleToggle={() => setRole(role === "company" ? "admin" : "company")}
    >
      {view === "login" && (
        <LoginForm
          role={role}
          onForgotPassword={() => setView("forgot")}
          onSignup={() => setView("signup")}
        />
      )}
      {view === "signup" && (
        <SignupStepper onBack={() => setView("login")} />
      )}
      {view === "forgot" && (
        <ForgotPassword onBack={() => setView("login")} />
      )}
    </AuthLayout>
  );
};

export default Auth;
