import Navigation from '@/components/navigation';
import AboutPage from '@/components/about-page';
import Footer from '@/components/footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-20">
        <AboutPage />
      </div>
      <Footer />
    </div>
  );
}

