import React from 'react';
import { Cog6ToothIcon, CalendarIcon, MicrophoneIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  botName: string;
  onSettingsClick: () => void;
  onCalendarClick: () => void;
  onVoiceClick: () => void;
  isVoiceActive?: boolean;
  isVoiceListening?: boolean;
}

export function Header({
  botName,
  onSettingsClick,
  onCalendarClick,
  onVoiceClick,
  isVoiceActive,
  isVoiceListening
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {botName}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onVoiceClick}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isVoiceActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
            } ${isVoiceListening ? 'animate-pulse text-red-500' : ''}`}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>

          <button
            onClick={onCalendarClick}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>

          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
