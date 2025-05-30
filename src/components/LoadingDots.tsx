import { useDarkMode } from '../context/DarkModeContext';

export function LoadingDots() {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className="flex min-w-[60px] min-h-[1.25rem] gap-1 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-[#e0e1dd]' : 'bg-gray-800'} animate-bounce`}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
} 