import { Voice } from './index';

export interface ChatbotSettings {
  profile: {
    userName: string;
    botName: string;
    birthday?: string;
    interests: string[];
    preferredLanguages: string[];
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  voice: {
    enabled: boolean;
    language: string;
  };
  interface: {
    fontSize: 'small' | 'medium' | 'large';
    codeTheme: 'default' | 'monokai' | 'github';
    showLineNumbers: boolean;
    compactMode: boolean;
  };
}

export const defaultSettings: ChatbotSettings = {
  profile: {
    userName: '',
    botName: 'VizionCoder',
    interests: [],
    preferredLanguages: ['JavaScript', 'TypeScript'],
    experienceLevel: 'intermediate',
    theme: 'dark',
    notifications: true,
  },
  voice: {
    enabled: false,
    language: 'en-US',
  },
  interface: {
    fontSize: 'medium',
    codeTheme: 'default',
    showLineNumbers: true,
    compactMode: false,
  },
};

export const programmingLanguages = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'Go',
  'Rust',
  'PHP',
  'Swift',
  'Kotlin',
];

export const interestCategories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Game Development',
  'Blockchain',
  'Cybersecurity',
  'UI/UX Design',
];
