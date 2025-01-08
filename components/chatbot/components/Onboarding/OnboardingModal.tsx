import React, { useState } from 'react';

interface OnboardingModalProps {
  onComplete: (name: string) => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Welcome to VizionCoder!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Let's get started by setting up your profile. What should I call you?
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white 
                         focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md 
                       hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
