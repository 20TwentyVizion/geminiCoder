import { useState, useEffect } from 'react';
import { ChatbotSettings, defaultSettings } from '../types/settings';

export const useSettings = (initialSettings?: ChatbotSettings) => {
  const [settings, setSettings] = useState<ChatbotSettings>(
    initialSettings || defaultSettings
  );

  useEffect(() => {
    if (!initialSettings) {
      const savedSettings = localStorage.getItem('chatbot_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [initialSettings]);

  useEffect(() => {
    if (!initialSettings) {
      localStorage.setItem('chatbot_settings', JSON.stringify(settings));
    }
  }, [settings, initialSettings]);

  const resetSettings = () => {
    setSettings(initialSettings || defaultSettings);
    if (!initialSettings) {
      localStorage.removeItem('chatbot_settings');
    }
  };

  return {
    settings,
    setSettings,
    resetSettings,
  };
};
