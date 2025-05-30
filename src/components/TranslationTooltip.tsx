import { useEffect, useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { LoadingDots } from './LoadingDots';

interface TranslationTooltipProps {
  translation: string | null;
  isLoading: boolean;
  selectionRect: DOMRect | null;
}

export function TranslationTooltip({ translation, isLoading, selectionRect }: TranslationTooltipProps) {
  const { isDarkMode } = useDarkMode();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (selectionRect) {
      const tooltipTop = selectionRect.top - 45;
      const tooltipLeft = selectionRect.left + (selectionRect.width / 2);

      setPosition({
        top: tooltipTop,
        left: tooltipLeft,
      });
    }
  }, [selectionRect]);

  if (!selectionRect) return null;

  return (
    <div
      className={`
        fixed z-50 transform -translate-x-1/2
        px-4 py-2 rounded-lg shadow-lg min-w-[60px] min-h-[24px]
        ${isDarkMode ? 'bg-[#CF8F8B] text-[#e0e1dd]' : 'bg-[#F2C3C3] text-gray-800'}
      `}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="text-sm ">
        {isLoading ? (
          <LoadingDots />
        ) : (
          translation
        )}
      </div>
      <div
        className={`
          absolute w-3 h-3 transform rotate-45
          left-1/2 -translate-x-1/2 -bottom-1.5
          ${isDarkMode ? 'bg-[#CF8F8B]' : 'bg-[#F2C3C3]'}
        `}
      />
    </div>
  );
} 