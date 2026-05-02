import Navbar from "@/components/Navbar";
import SponsorMarquee from "@/components/SponsorMarquee";
import HiravelHero from "@/components/landing/HiravelHero";
import SolutionsSection from "@/components/landing/SolutionsSection";
import RemoteRoleCTA from "@/components/landing/RemoteRoleCTA";
import ExpertiseSection from "@/components/landing/ExpertiseSection";
import EngagementPackages from "@/components/landing/EngagementPackages";
import HireAtScaleCTA from "@/components/landing/HireAtScaleCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-[70px]">
        <SponsorMarquee />
        <HiravelHero />
        <SolutionsSection />
        <RemoteRoleCTA />
        <ExpertiseSection />
        <EngagementPackages />
        <HireAtScaleCTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
