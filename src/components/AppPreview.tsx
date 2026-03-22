import appPreview from "@/assets/app-preview.png";
import { useEffect, useRef, useState } from "react";

const AppPreview = () => {
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
    <section className="py-28 bg-muted">
      <div className="container flex flex-col lg:flex-row items-center gap-12" ref={ref}>
        <div className={`flex-1 ${visible ? "reveal-up" : "opacity-0"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            See Your Dashboard in Action
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">
            Track applications, view AI-ranked matches, and manage your profile — all from one clean interface built around your verified identity.
          </p>
        </div>
        <div className={`flex-1 flex justify-center ${visible ? "reveal-up stagger-2" : "opacity-0"}`}>
          <img
            src={appPreview}
            alt="App dashboard preview"
            className="max-h-[500px] object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
