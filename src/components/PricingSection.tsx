import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "₦15,000",
    period: "/month",
    features: ["Post up to 5 jobs", "Access candidate pool", "Basic AI ranking", "Email support"],
    highlighted: false,
  },
  {
    name: "Business",
    price: "₦45,000",
    period: "/month",
    features: ["Unlimited job posts", "Advanced AI ranking", "Priority listing", "Dedicated account manager"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Everything in Business", "API access", "Custom integrations", "On-site support"],
    highlighted: false,
  },
];

const PricingSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="py-28 bg-muted">
      <div className="container" ref={ref}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-balance">
          Plans for Companies
        </h2>
        <p className="mt-3 text-muted-foreground text-center max-w-md mx-auto">
          Find, rank, and hire the right candidates faster.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`border bg-card p-8 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary shadow-xl scale-[1.03] relative z-10"
                  : "border-border hover:shadow-md"
              } ${visible ? `reveal-up stagger-${i + 1}` : "opacity-0"}`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 tracking-wide uppercase">
                  Recommended
                </span>
              )}
              <h3 className="font-display font-semibold text-lg">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-display">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? "hero" : "outline"}
                size="lg"
                className="mt-8 w-full"
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
