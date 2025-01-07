import { useEffect } from 'react';

export const useTheme = (theme: { mode: 'light' | 'dark' }) => {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme.mode === 'dark');
  }, [theme.mode]);

  return theme.mode;
};
