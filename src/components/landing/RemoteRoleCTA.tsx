import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import officeImg from "@/assets/landing-office.jpg";

const locations = [
  { type: "Full Remote", places: "APAC & EMEA", note: "best for engineers" },
  { type: "Hybrid / Flexible", places: "LATAM & AFRICA", note: "product & design" },
  { type: "Onsite / Relocation", places: "EUROPE & USA", note: "leadership roles" },
];

const RemoteRoleCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container">
        <div className="bg-foreground text-background rounded-md overflow-hidden p-8 lg:p-12">
          <span className="inline-block text-[10px] font-bold tracking-[0.25em] uppercase text-primary border border-primary/40 px-3 py-1 rounded-full">
            ◆ Borderless Careers
          </span>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] max-w-2xl">
            Your Next World-Class{" "}
            <span className="text-primary">Remote Role</span> Starts Here.
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-background/60 leading-relaxed">
            We represent top-tier global companies seeking elite talent. Explore
            high-impact remote opportunities in tech, AI, aerospace and finance.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={() => navigate("/auth")}>
              Browse Remote Jobs
            </Button>
            <Button
              variant="heroOutline"
              size="lg"
              className="border-background/30 text-background hover:bg-background hover:text-foreground"
            >
              Build Your Profile
            </Button>
          </div>

          <img
            src={officeImg}
            alt="Modern open office"
            width={1280}
            height={720}
            loading="lazy"
            className="mt-10 w-full h-[180px] sm:h-[240px] object-cover rounded-md grayscale opacity-90"
          />

          <div className="mt-6 grid sm:grid-cols-3 gap-px bg-background/10 rounded-md overflow-hidden">
            {locations.map((l) => (
              <div key={l.type} className="bg-foreground p-4">
                <div className="text-sm font-semibold text-background">
                  {l.type}
                </div>
                <div className="mt-1 text-[11px] tracking-widest font-bold text-primary">
                  {l.places}
                </div>
                <div className="mt-1 text-xs text-background/50">{l.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RemoteRoleCTA;
