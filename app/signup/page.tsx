import Navigation from '@/components/navigation';
import SignupPage from '@/components/signup-page';
import Footer from '@/components/footer';

export default function Signup() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <SignupPage />
      <Footer />
    </div>
  );
}

