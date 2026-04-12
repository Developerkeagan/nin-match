import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupStepper from "@/components/auth/SignupStepper";
import ForgotPassword from "@/components/auth/ForgotPassword";

type AuthView = "login" | "signup" | "forgot";

const Auth = () => {
  const [view, setView] = useState<AuthView>("login");

  return (
    <AuthLayout>
      {view === "login" && (
        <LoginForm
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
