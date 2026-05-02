import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HireAtScaleCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-primary py-14">
      <div className="container text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
          Ready to Hire at Scale?
        </h2>
        <p className="mt-3 text-sm text-primary-foreground/80 max-w-md mx-auto">
          Book a discovery call today and see how our RAAS model can transform
          your recruitment pipeline.
        </p>
        <Button
          variant="heroOutline"
          size="lg"
          className="mt-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          onClick={() => navigate("/auth")}
        >
          Request Consultation
        </Button>
      </div>
    </section>
  );
};

export default HireAtScaleCTA;
