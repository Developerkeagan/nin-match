import { Button } from "@/components/ui/button";

const FloatingCTA = () => {
  return (
    <section className="relative bg-foreground h-[120px]">
      {/* Floating rectangle */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-20">
        <div className="bg-primary shadow-2xl px-10 py-6 flex items-center gap-6 rounded-md">
          <span className="text-primary-foreground font-display font-bold text-lg whitespace-nowrap">
            Ready to get started?
          </span>
          <Button
            variant="heroOutline"
            size="lg"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary whitespace-nowrap"
          >
            Open Bot
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FloatingCTA;
