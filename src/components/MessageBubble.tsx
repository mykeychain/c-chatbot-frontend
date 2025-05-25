import { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { useTranslation } from '../hooks/useTranslation';
import type { Message } from '../types/api';

interface MessageBubbleProps {
  msg: Message;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  const { isDarkMode } = useDarkMode();
  const [showPinyin, setShowPinyin] = useState(false);
  const [translation, setTranslation] = useState<{ original: string; translated: string } | null>(null);
  const { mutate: translate } = useTranslation();
  
  const togglePinyin = () => {
    setShowPinyin(!showPinyin);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const messageElement = document.getElementById(`message-${msg.id}`);
    if (!messageElement?.contains(selection.anchorNode)) return;

    translate(selectedText, {
      onSuccess: (data) => {
        setTranslation({
          original: data.originalText,
          translated: data.translatedText,
        });
      },
    });
  };

  return (
    <div
      key={msg.id}
      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-lg rounded-xl px-4 py-2 shadow-sm ${
          msg.sender === 'user' ? isDarkMode ? 'bg-[#108e94]' : 'bg-[#d0e4d2]' : isDarkMode ? 'bg-[#415a77]' : 'bg-[#f0e4d7]'
        }`}
      >
        <p id={`message-${msg.id}`} onMouseUp={msg.sender === 'ai' ? handleTextSelection : undefined}>
          {msg.content}
        </p>
        {translation && (
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {translation.translated}
          </p>
        )}
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
  );
}