import type { ReactNode } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

export function Tooltip({ children, text }: TooltipProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="group relative inline-block">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 translate-y-2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className={`rounded ${isDarkMode ? 'bg-[#CF8F8B] text-[#e0e1dd]' : 'bg-[#F2C3C3] text-gray-800'} px-2 py-1 text-xs whitespace-nowrap`}>
          {text}
        </div>
      </div>
    </div>
  );
} 