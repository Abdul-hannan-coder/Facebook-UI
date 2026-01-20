import Navigation from '@/components/navigation';
import FeaturesPage from '@/components/features-page';
import Footer from '@/components/footer';

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-20">
        <FeaturesPage />
      </div>
      <Footer />
    </div>
  );
}

