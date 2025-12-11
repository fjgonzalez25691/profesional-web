'use client';

import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    const newTheme = theme === 'olive' ? 'navy' : 'olive';
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95 border border-slate-700"
      aria-label="Toggle theme"
    >
      <span className="relative flex h-3 w-3">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${theme === 'olive' ? 'bg-green-400' : 'bg-cyan-400'}`}></span>
        <span className={`relative inline-flex h-3 w-3 rounded-full ${theme === 'olive' ? 'bg-green-500' : 'bg-cyan-500'}`}></span>
      </span>
      <span className="capitalize">{theme} Theme</span>
    </button>
  );
}
