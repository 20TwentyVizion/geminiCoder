import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { ChatContainer } from './components/Chat/ChatContainer';
import { SettingsDialog } from './components/Settings/SettingsDialog';
import { CalendarModal } from './components/Calendar/CalendarModal';
import { VoiceModal } from './components/Voice/VoiceModal';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { Message } from './types';
import { ChatbotSettings } from './types/settings';

interface AppProps {
  settings: ChatbotSettings;
  onUpdateSettings: (settings: ChatbotSettings) => void;
  messages: Message[];
  onSendMessage: (message: Message) => void;
  isLoading?: boolean;
  onClearChat: () => void;
}

export function App({ 
  settings, 
  onUpdateSettings, 
  messages, 
  onSendMessage, 
  isLoading,
  onClearChat 
}: AppProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Update theme when settings change
  useEffect(() => {
    if (settings.profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.profile.theme]);

  const handleSendMessage = (content: string) => {
    onSendMessage({
      id: Math.random().toString(),
      content,
      role: "user",
      createdAt: new Date().toISOString(),
    });
  };

  const handleClearChat = () => {
    onSendMessage({
      id: Math.random().toString(),
      content: "Chat history has been cleared.",
      role: "assistant",
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="h-screen">
      <div className="w-full h-full flex flex-col overflow-hidden content-overlay">
        <Header
          settings={settings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onOpenVoice={() => setIsVoiceModalOpen(true)}
        />

        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />

        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onClearChat={onClearChat}
        />

        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
        />

        <VoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
        />
      </div>
    </div>
  );
}
