import React from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChatbotSettings } from '../../types/settings';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatbotSettings;
  onUpdateSettings: (settings: ChatbotSettings) => void;
  onClearChat: () => void;
}

export function SettingsDialog({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearChat,
}: SettingsDialogProps) {
  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({
      ...settings,
      profile: {
        ...settings.profile,
        userName: e.target.value,
      },
    });
  };

  const handleBotNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({
      ...settings,
      profile: {
        ...settings.profile,
        botName: e.target.value,
      },
    });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({
      ...settings,
      profile: {
        ...settings.profile,
        theme: e.target.value as 'light' | 'dark',
      },
    });
  };

  const handleVoiceToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({
      ...settings,
      voice: {
        ...settings.voice,
        enabled: e.target.checked,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={settings.profile.userName}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assistant Name
                  </label>
                  <input
                    type="text"
                    value={settings.profile.botName}
                    onChange={handleBotNameChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter assistant name"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Theme</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mode
                </label>
                <select
                  value={settings.profile.theme}
                  onChange={handleThemeChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Voice</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="voice-control"
                  checked={settings.voice.enabled}
                  onChange={handleVoiceToggle}
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="voice-control" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable Voice Control
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Chat History</h3>
              <button
                onClick={onClearChat}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Clear Chat History
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This will permanently delete all chat messages.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
