import { useDarkMode } from '../context/DarkModeContext';

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer
        transition-colors duration-300 ease-in-out
        ${isDarkMode ? 'bg-[#17686c]' : 'bg-[#a2c9a6]'}
      `}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`
          absolute left-0.5 inline-block h-5 w-5 transform rounded-full
          transition duration-300 ease-in-out
          flex items-center justify-center
          ${isDarkMode ? 'translate-x-5 bg-[#e0e1dd]' : 'translate-x-0 bg-white'}
        `}
      >
        <span className="flex items-center justify-center w-full h-full">
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-[#17686c]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-[#a2c9a6]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
} 