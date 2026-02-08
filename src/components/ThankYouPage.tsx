import { useState, useEffect } from "react";
import CelebrationScreen from "./thankyou/CelebrationScreen";
import ReferralForm from "./thankyou/ReferralForm";

interface ThankYouPageProps {
  name: string;
}

const ThankYouPage = ({ name }: ThankYouPageProps) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [emails, setEmails] = useState(["", "", ""]);
  const [validEmails, setValidEmails] = useState([false, false, false]);
  const [heartBursts, setHeartBursts] = useState([false, false, false]);
  const [allSent, setAllSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (idx: number, value: string) => {
    const newEmails = [...emails];
    newEmails[idx] = value;
    setEmails(newEmails);

    if (isValidEmail(value) && !validEmails[idx]) {
      const newValid = [...validEmails];
      newValid[idx] = true;
      setValidEmails(newValid);

      const newBursts = [...heartBursts];
      newBursts[idx] = true;
      setHeartBursts(newBursts);
      setTimeout(() => {
        setHeartBursts((prev) => { const n = [...prev]; n[idx] = false; return n; });
      }, 1000);
    } else if (!isValidEmail(value)) {
      const newValid = [...validEmails];
      newValid[idx] = false;
      setValidEmails(newValid);
    }
  };

  const canSubmit = validEmails.every(Boolean);

  const handleSubmit = () => {
    if (canSubmit) {
      setShowConfetti(true);
      setAllSent(true);
    }
  };

  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  if (allSent) {
    return <CelebrationScreen name={name} showConfetti={showConfetti} />;
  }

  return (
    <ReferralForm
      name={name}
      envelopeOpened={envelopeOpened}
      onOpenEnvelope={() => setEnvelopeOpened(true)}
      emails={emails}
      validEmails={validEmails}
      heartBursts={heartBursts}
      onEmailChange={handleEmailChange}
      canSubmit={canSubmit}
      onSubmit={handleSubmit}
    />
  );
};

export default ThankYouPage;
