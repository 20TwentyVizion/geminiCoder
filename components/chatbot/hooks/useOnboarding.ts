import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_complete');
    if (completed === 'true') {
      setIsOnboardingComplete(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setIsOnboardingComplete(true);
  };

  return {
    isOnboardingComplete,
    completeOnboarding,
  };
};
