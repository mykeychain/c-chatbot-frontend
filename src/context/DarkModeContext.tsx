import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface DarkModeContextType {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const setDarkMode = (value: boolean) => setIsDarkMode(value);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) {
    throw new Error('useDarkMode must be inside a DarkModeProvider');
  }
  return ctx;
}
