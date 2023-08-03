'use client';
import { useTheme } from 'next-themes';
import { BsSunFill, BsFillMoonFill } from 'react-icons/bs';

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  return (
    <>
      {theme === 'dark' && (
        <button
          className="h-full flex items-center"
          onClick={() => setTheme('light')}
        >
          <BsSunFill />
        </button>
      )}
      {theme !== 'dark' && (
        <button
          className="h-full flex items-center"
          onClick={() => setTheme('dark')}
        >
          <BsFillMoonFill />
        </button>
      )}
    </>
  );
};
