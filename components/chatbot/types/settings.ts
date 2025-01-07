import { Voice } from './index';

export interface ChatbotSettings {
  profile: {
    name: string;
    botName: string;
    birthday?: string | null;
  };
  theme: {
    mode: 'light' | 'dark';
    wallpaper: string;
  };
  voice: {
    enabled: boolean;
    voice: Voice | null;
  };
}

export const defaultSettings: ChatbotSettings = {
  profile: {
    name: '',
    botName: 'VizionCoder Assistant',
    birthday: null,
  },
  theme: {
    mode: 'dark',
    wallpaper: '',
  },
  voice: {
    enabled: false,
    voice: null,
  },
};
