import { useNavigate } from "react-router-dom";
import V2TopBar from "@/components/v2/V2TopBar";
import V2Header from "@/components/v2/V2Header";
import V2Hero from "@/components/v2/V2Hero";
import V2HowItWorks from "@/components/v2/V2HowItWorks";
import V2TrustBar from "@/components/v2/V2TrustBar";
import V2CTABanner from "@/components/v2/V2CTABanner";
import V2Footer from "@/components/v2/V2Footer";

const LandingV2 = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    // Navigate to the main page which handles quiz flow
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <V2TopBar />
      <V2Header />
      <V2Hero onStartQuiz={handleStartQuiz} />
      <V2HowItWorks />
      <V2TrustBar />
      <V2CTABanner onStartQuiz={handleStartQuiz} />
      <V2Footer />
    </div>
  );
};

export default LandingV2;
