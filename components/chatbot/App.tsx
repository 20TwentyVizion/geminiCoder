import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { ChatContainer } from './components/Chat/ChatContainer';
import { SettingsModal } from './components/settings/SettingsModal';
import { CalendarModal } from './components/Calendar/CalendarModal';
import { VoiceModal } from './components/Voice/VoiceModal';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { useSettings } from './hooks/useSettings';
import { useMessages } from './hooks/useMessages';
import { useTheme } from './hooks/useTheme';
import { useOnboarding } from './hooks/useOnboarding';
import { Message } from './types';
import { ChatbotSettings } from './types/settings';

interface AppProps {
  initialSettings?: ChatbotSettings;
  onMessageSend?: (content: string, addMessage: (message: Message) => void) => void;
}

export function App({ initialSettings, onMessageSend }: AppProps) {
  const { settings, setSettings, resetSettings } = useSettings(initialSettings);
  const { messages, addMessage, clearMessages } = useMessages();
  const currentTheme = useTheme(settings.theme);
  const { isOnboardingComplete, completeOnboarding } = useOnboarding();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const handleMessage = async (content: string) => {
    if (onMessageSend) {
      onMessageSend(content, addMessage);
    }
  };

  useEffect(() => {
    if (isOnboardingComplete && settings.profile.name && messages.length === 0) {
      addMessage({
        id: Date.now().toString(),
        content: `Hello ${settings.profile.name}! I'm your VizionCoder Assistant. You can ask me to build anything by starting your message with "Build me a...". For example, try saying "Build me a todo list app with dark mode"`,
        sender: "bot",
        timestamp: new Date().toISOString(),
      });
    }
  }, [isOnboardingComplete, settings.profile.name, messages.length]);

  return (
    <div className={`h-screen ${currentTheme === 'dark' ? 'dark' : ''}`}>
      <div className="w-full h-full flex flex-col overflow-hidden">
        <Header
          botName={settings.profile.botName}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onCalendarClick={() => setIsCalendarOpen(true)}
          onVoiceClick={() => setIsVoiceModalOpen(true)}
          isVoiceActive={isVoiceActive}
          isVoiceListening={isVoiceListening}
        />

        <ChatContainer
          messages={messages}
          onSendMessage={handleMessage}
          wallpaper={settings.theme.wallpaper}
          currentTheme={currentTheme}
        />

        {!isOnboardingComplete && (
          <OnboardingModal
            onComplete={(name) => {
              setSettings({
                ...settings,
                profile: { ...settings.profile, name }
              });
              completeOnboarding();
            }}
          />
        )}

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
          onResetChat={clearMessages}
          onRestoreDefaults={resetSettings}
        />

        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
        />

        <VoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          voiceSettings={settings.voice}
          onVoiceSettingsChange={(voice) => setSettings({ ...settings, voice })}
        />
      </div>
    </div>
  );
}
