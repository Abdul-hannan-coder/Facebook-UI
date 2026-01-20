import Navigation from '@/components/navigation';
import LoginPage from '@/components/login-page';
import Footer from '@/components/footer';

export default function Login() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <LoginPage />
      <Footer />
    </div>
  );
}

