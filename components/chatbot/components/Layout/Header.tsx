import React, { useState, useEffect } from 'react';
import { Cog6ToothIcon, CalendarIcon, MicrophoneIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { ChatbotSettings } from '../../types/settings';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  settings: ChatbotSettings;
  onOpenSettings: () => void;
  onOpenCalendar: () => void;
  onOpenVoice: () => void;
}

export function Header({
  settings,
  onOpenSettings,
  onOpenCalendar,
  onOpenVoice,
}: HeaderProps) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <header className={`content-overlay rounded-t-lg ${settings.profile.theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {settings.profile.botName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateTime(currentTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/coder')}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Open Coder"
          >
            <CodeBracketIcon className="w-6 h-6" />
          </button>

          <button
            onClick={onOpenVoice}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     ${settings.voice.enabled ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
            title="Voice Control"
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>

          <button
            onClick={onOpenCalendar}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Calendar"
          >
            <CalendarIcon className="w-6 h-6" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Settings"
          >
            <Cog6ToothIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
