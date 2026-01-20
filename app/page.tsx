import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AnalyticsInsights from "@/components/analytics-insights";
import FeaturesGrid from "@/components/features-grid";
import StandoutFeatures from "@/components/standout-features";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <AnalyticsInsights />
      <FeaturesGrid />
      <StandoutFeatures />
      <Testimonials />
      <Footer />
    </div>
  );
}
