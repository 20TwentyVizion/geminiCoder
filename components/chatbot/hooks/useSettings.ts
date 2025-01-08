import { useState, useEffect } from 'react';
import { ChatbotSettings, defaultSettings } from '../types/settings';

export const useSettings = (initialSettings?: ChatbotSettings) => {
  const [settings, setSettings] = useState<ChatbotSettings>(
    initialSettings || defaultSettings
  );

  useEffect(() => {
    if (!initialSettings) {
      const savedSettings = localStorage.getItem('vizionCoder.settings');
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (e) {
          console.error('Failed to parse saved settings:', e);
        }
      }
    }
  }, [initialSettings]);

  useEffect(() => {
    if (!initialSettings) {
      localStorage.setItem('vizionCoder.settings', JSON.stringify(settings));
    }
  }, [settings, initialSettings]);

  const resetSettings = () => {
    setSettings(initialSettings || defaultSettings);
    if (!initialSettings) {
      localStorage.removeItem('vizionCoder.settings');
    }
  };

  return {
    settings,
    setSettings,
    resetSettings,
  };
};
