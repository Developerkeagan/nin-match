import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/75" />

      <div className="relative z-10 container text-center max-w-3xl py-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] text-balance reveal-up">
          AI-Powered Job Matching with NIN Identity
        </h1>
        <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto text-balance reveal-up stagger-1">
          Connect your identity, skills, and opportunities seamlessly across platforms.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 reveal-up stagger-2">
          <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
          <Button
            variant="heroOutline"
            size="xl"
            className="border-white/40 text-white hover:bg-white hover:text-foreground"
          >
            Learn More
          </Button>
        </div>

        <p className="mt-6 text-sm text-white/40 reveal-up stagger-3">
          No CV uploads required. Powered by AI.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
