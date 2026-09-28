import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cep-theme');
      // Default is light; only go dark if explicitly saved
      return stored === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('cep-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cep-theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      className={`
        relative grid h-9 w-9 place-items-center rounded-card
        border transition-all duration-300 ease-out
        ${isDark
          ? 'border-[#23356D] bg-[#182654] text-[#38bdf8] hover:bg-[#23356D] hover:shadow-[0_0_12px_rgba(56,189,248,0.3)]'
          : 'border-[#e2e8f0] bg-white text-[#0ea5e9] hover:bg-[#f0f9ff] hover:border-[#bae6fd] hover:shadow-[0_0_12px_rgba(14,165,233,0.2)]'
        }
        active:scale-90
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span
        className="transition-all duration-300"
        style={{ transform: isDark ? 'rotate(20deg)' : 'rotate(0deg)' }}
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </span>
    </button>
  );
}
