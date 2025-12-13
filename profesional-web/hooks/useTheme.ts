import { useState, useEffect } from 'react';

type Theme = 'olive' | 'navy';

export function useTheme() {
  // Initialize state with 'olive' as default
  // Real initialization happens in useEffect to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>('olive');

  useEffect(() => {
    // Check localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && (savedTheme === 'olive' || savedTheme === 'navy')) {
      setThemeState(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    } else {
      // Default to olive
      document.documentElement.dataset.theme = 'olive';
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.dataset.theme = newTheme;
  };

  return { theme, setTheme };
}
