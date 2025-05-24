import { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import type { Message } from '../types/api';

interface MessageBubbleProps {
  msg: Message;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  const { isDarkMode } = useDarkMode();
  const [showPinyin, setShowPinyin] = useState(false);
  
  const togglePinyin = () => {
    setShowPinyin(!showPinyin);
  };

  return (
    <div
      key={msg.id}
      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-lg rounded-xl px-4 py-2 shadow-sm ${
          msg.sender === 'user' ? isDarkMode ? 'bg-[#108e94]' : 'bg-[#d0e7d2]' : isDarkMode ? 'bg-[#415a77]' : 'bg-[#f0e4d7]'
        }`}
      >
        <p>{msg.content}</p>
        {msg.sender === 'ai' && (
          <>
            {showPinyin && msg.pinyin && (
              <p className={`mt-1 text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{msg.pinyin}</p>
            )}
            <div className="mt-2 flex gap-2 text-sm">
              <button className="underline cursor-pointer" onClick={() => togglePinyin()}>
                Pinyin
              </button>
              <button className="underline">Translate</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}