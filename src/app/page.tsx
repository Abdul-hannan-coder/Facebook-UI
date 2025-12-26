import { Navbar } from "@/components/sections/navbar";
import HeroSection from "@/components/sections/hero-section";
import StandoutFeatures from "@/components/sections/standout-features";
import PerformanceStats from "@/components/sections/performance-stats";
import { HowItWorks } from "@/components/sections/how-it-works";
import FAQ from "@/components/sections/faq";
import Reviews from "@/components/sections/reviews";
import ContactUs from "@/components/sections/contact-us";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StandoutFeatures />
      <PerformanceStats />
      <HowItWorks />
      <FAQ />
      <Reviews />
      <ContactUs />
      <Footer />
    </main>
  );
}
