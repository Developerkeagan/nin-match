import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const packages = [
  {
    name: "Starter",
    blurb: "For growing companies making their first hires.",
    pricing: "Percentage",
    pricingNote: "FEE PER HIRE",
    features: ["Core sourcing", "Identity verified pool", "3-position focus"],
    cta: "Start Hiring",
    highlight: false,
  },
  {
    name: "Growth",
    blurb: "Scale fast with a dedicated recruitment squad.",
    pricing: "Retainer",
    pricingNote: "+ PLACEMENT FEE",
    features: [
      "Private sourcing pipeline",
      "Advanced technical vetting",
      "Multi-region expansion",
      "Dedicated account manager",
    ],
    cta: "Accelerate Growth",
    highlight: true,
  },
  {
    name: "Enterprise (RAAS)",
    blurb: "Complete recruitment operations outsourcing.",
    pricing: "Custom",
    pricingNote: "BESPOKE PRICING",
    features: [
      "Fully embedded recruitment management",
      "Embedded recruiting team",
      "Employer branding advisory",
      "Global compliance & payroll setup",
    ],
    cta: "Contact Enterprise",
    highlight: false,
  },
];

const EngagementPackages = () => {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-balance">
          Engagement Packages
        </h2>
        <p className="mt-3 text-muted-foreground text-center max-w-md mx-auto">
          Flexible models designed to grow with your global company.
        </p>

        <div className="mt-12 grid lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-md p-7 flex flex-col ${
                p.highlight
                  ? "bg-foreground text-background lg:scale-[1.04] shadow-2xl z-10"
                  : "bg-card border border-border"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                  ◆ Most Popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <p
                className={`mt-2 text-sm ${
                  p.highlight ? "text-background/60" : "text-muted-foreground"
                }`}
              >
                {p.blurb}
              </p>

              <div className="mt-6">
                <div className="font-display text-3xl font-bold">{p.pricing}</div>
                <div
                  className={`text-[10px] font-bold tracking-widest mt-1 ${
                    p.highlight ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {p.pricingNote}
                </div>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        p.highlight ? "text-primary" : "text-primary"
                      }`}
                    />
                    <span className={p.highlight ? "text-background/90" : ""}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={p.highlight ? "hero" : "outline"}
                size="lg"
                className="mt-7 w-full"
                onClick={() => navigate("/auth")}
              >
                {p.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EngagementPackages;
