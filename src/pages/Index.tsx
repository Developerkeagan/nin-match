import Navbar from "@/components/Navbar";
import SponsorMarquee from "@/components/SponsorMarquee";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import ReviewsMarquee from "@/components/ReviewsMarquee";
import AppPreview from "@/components/AppPreview";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-[70px]">
        <SponsorMarquee />
        <HeroSection />
        <ServicesSection />
        <PricingSection />
        <ReviewsMarquee />
        <AppPreview />
        <FloatingCTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
