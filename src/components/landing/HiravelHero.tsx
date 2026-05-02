import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import teamImg from "@/assets/landing-team.jpg";

const HiravelHero = () => {
  const navigate = useNavigate();
  return (
    <section id="home" className="bg-background">
      <div className="container pt-12 pb-16 lg:pt-20 lg:pb-24">
        <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-primary">
          ◆ Hire Smarter — Powered by AI
        </span>

        <h1 className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight max-w-3xl text-balance">
          Scale Your Team{" "}
          <span className="text-primary">Globally</span>{" "}
          with Hiravel
        </h1>

        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
          We connect verified Nigerian talent with companies worldwide through
          AI-powered job matching — no CVs, no friction, just identity-backed
          hiring at scale.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#2B7A05", "#1f5a04", "#3b9a13", "#7ab85e"].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: c }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              50k+ talents matched worldwide
            </span>
          </div>
        </div>

        <div className="mt-12 relative">
          <img
            src={teamImg}
            alt="Hiravel team collaboration"
            width={1280}
            height={800}
            className="w-full h-[260px] sm:h-[380px] lg:h-[460px] object-cover rounded-md"
          />
          <div className="absolute -bottom-6 left-4 sm:left-8 bg-card border border-border shadow-xl px-5 py-4 rounded-md">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              <Clock className="w-3 h-3" /> Avg. Time-to-Hire
            </div>
            <div className="mt-1 font-display text-2xl font-bold">
              18 <span className="text-base font-medium text-muted-foreground">Days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HiravelHero;
