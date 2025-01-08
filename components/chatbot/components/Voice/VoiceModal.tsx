import React from 'react';
import { ChatbotSettings } from '../../types/settings';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatbotSettings;
  onUpdateSettings: (settings: ChatbotSettings) => void;
}

export function VoiceModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: VoiceModalProps) {
  if (!isOpen) return null;

  const handleVoiceToggle = () => {
    onUpdateSettings({
      ...settings,
      voice: {
        ...settings.voice,
        enabled: !settings.voice.enabled,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Voice Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Voice Control
              </label>
              <button
                onClick={handleVoiceToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full
                          ${settings.voice.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                            ${settings.voice.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice Language
              </label>
              <select
                value={settings.voice.language}
                onChange={(e) => onUpdateSettings({
                  ...settings,
                  voice: {
                    ...settings.voice,
                    language: e.target.value,
                  },
                })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                disabled={!settings.voice.enabled}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
              </select>
            </div>
            
            {settings.voice.enabled && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Voice control is enabled. You can now use voice commands to interact with the assistant.
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
