import { Brain, Fingerprint, Bot, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const services = [
  { icon: Brain, title: "AI Job Matching", desc: "Intelligent algorithms pair your skills with the right roles instantly." },
  { icon: Fingerprint, title: "NIN Identity System", desc: "Verified national identity ensures trust and eliminates fraud." },
  { icon: Bot, title: "Bot-Based Profiles", desc: "Create and manage your professional profile through conversational bots." },
  { icon: Globe, title: "Cross-Platform Access", desc: "One identity, many platforms — apply anywhere from a single profile." },
];

const ServicesSection = () => {
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
    <section id="features" className="py-24 bg-background">
      <div className="container" ref={ref}>
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-balance">
          What We Offer
        </h2>
        <p className="mt-3 text-muted-foreground text-center max-w-lg mx-auto">
          Built for speed, trust, and accessibility.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`group border border-border bg-card p-6 rounded-none transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                visible ? `reveal-up stagger-${i + 1}` : "opacity-0"
              }`}
            >
              <s.icon className="w-8 h-8 text-primary mb-4 transition-transform duration-200 group-hover:scale-110" />
              <h3 className="font-display font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
