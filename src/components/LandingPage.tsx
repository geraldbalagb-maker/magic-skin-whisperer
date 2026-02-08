import LandingHero from "./landing/LandingHero";
import HowItWorks from "./landing/HowItWorks";
import CTABanner from "./landing/CTABanner";
import TrustBar from "./landing/TrustBar";
import Footer from "./landing/Footer";

interface LandingPageProps {
  onStartQuiz: () => void;
}

const LandingPage = ({ onStartQuiz }: LandingPageProps) => (
  <div className="min-h-screen bg-background">
    <LandingHero onStartQuiz={onStartQuiz} />
    <HowItWorks />
    <CTABanner onStartQuiz={onStartQuiz} />
    <TrustBar />
    <Footer />
  </div>
);

export default LandingPage;
