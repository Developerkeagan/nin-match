import { Check, Globe } from "lucide-react";

const industries = ["Aerospace", "Healthcare", "Fintech", "Tech & SaaS"];
const features = [
  "GDPR & Compliance Management",
  "Optional Alignment Mapping",
  "Localised Compensation Strategy",
  "Rapid Cross-Border Deployment",
];

const stats = [
  { value: "120+", label: "Countries Covered", sub: "Success Rate" },
  { value: "24h", label: "Avg. Response Time", sub: "Tech Recruitment" },
  { value: "98%", label: "Success Rate", sub: "Verified Talent" },
  { value: "45%", label: "Avg. Cost Reduction", sub: "vs in-house team" },
];

const ExpertiseSection = () => {
  return (
    <section className="py-20 bg-muted/40">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="font-display text-xl font-semibold">
            Multi-Industry Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <span
                key={i}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-card border border-border"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          We speak the language of your niche.
        </p>

        {/* Dark feature card */}
        <div className="mt-10 bg-foreground text-background rounded-md p-8 lg:p-10">
          <Globe className="w-8 h-8 text-primary" />
          <p className="mt-4 italic text-primary text-lg font-display">
            Scaling has no borders.
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-background/80">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Market expansion */}
        <div className="mt-16">
          <h3 className="font-display text-sm font-semibold text-muted-foreground">
            Your Partner for
          </h3>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary">
            Market Expansion
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Whether you're launching a hub in the UAE, or hiring across Europe,
            Hiravel provides the infrastructure and talent to make it seamless.
          </p>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-md overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="bg-card p-5">
                <div className="font-display text-2xl sm:text-3xl font-bold">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-semibold">{s.label}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </div>

          <a
            href="#"
            className="mt-6 inline-flex text-[11px] font-bold tracking-widest text-primary"
          >
            EXPLORE GLOBAL SOLUTIONS →
          </a>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
