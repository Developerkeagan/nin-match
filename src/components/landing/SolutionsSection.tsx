import { Briefcase, Cpu, Globe2, Search } from "lucide-react";

const solutions = [
  {
    tag: "RAAS",
    icon: Briefcase,
    title: "Recruitment as a Service",
    desc: "End-to-end managed hiring pipelines for growing companies.",
  },
  {
    tag: "TECH",
    icon: Cpu,
    title: "Elite Tech Sourcing",
    desc: "Vetted engineers and product talent ready to scale your roadmap.",
  },
  {
    tag: "EXPANSION",
    icon: Globe2,
    title: "Market Entry",
    desc: "Build local teams across new regions without setting up an office.",
  },
  {
    tag: "AI SEARCH",
    icon: Search,
    title: "Talent Intelligence",
    desc: "AI ranking that surfaces the right candidate in seconds, not weeks.",
  },
];

const SolutionsSection = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-background">
      <div className="container">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-balance">
          Comprehensive Solutions
        </h2>
        <p className="mt-3 text-muted-foreground text-center max-w-md mx-auto">
          Everything you need to build a global powerhouse from one partner.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-md overflow-hidden">
          {solutions.map((s) => (
            <div
              key={s.title}
              className="bg-card p-7 group hover:bg-accent/40 transition-colors"
            >
              <div className="text-[10px] font-bold tracking-[0.2em] text-primary">
                {s.tag}
              </div>
              <s.icon className="w-6 h-6 mt-4 text-foreground" />
              <h3 className="mt-4 font-display font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
              <a
                href="#"
                className="mt-5 inline-flex text-[11px] font-bold tracking-widest text-primary group-hover:translate-x-1 transition-transform"
              >
                LEARN MORE →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
