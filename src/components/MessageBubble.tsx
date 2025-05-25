import { useState, useEffect, useCallback } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationTooltip } from './TranslationTooltip';
import type { Message } from '../types/api';

interface MessageBubbleProps {
  msg: Message;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  const { isDarkMode } = useDarkMode();
  const [showPinyin, setShowPinyin] = useState(false);
  const [translation, setTranslation] = useState<{ original: string; translated: string } | null>(null);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [pendingRect, setPendingRect] = useState<DOMRect | null>(null);
  const { mutate: translate } = useTranslation();
  
  const togglePinyin = () => {
    setShowPinyin(!showPinyin);
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setTranslation(null);
      setSelectionRect(null);
      setPendingRect(null);
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      setTranslation(null);
      setSelectionRect(null);
      setPendingRect(null);
      return;
    }

    const messageElement = document.getElementById(`message-${msg.id}`);
    if (!messageElement?.contains(selection.anchorNode)) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // If there's no existing tooltip, update immediately
    if (!translation) {
      setSelectionRect(rect);
    } else {
      // If there's an existing tooltip, store the new position as pending
      setPendingRect(rect);
    }

    translate(selectedText, {
      onSuccess: (data) => {
        setTranslation({
          original: data.originalText,
          translated: data.translatedText,
        });
        // Update the position only after we have the new translation
        if (pendingRect || rect) {
          setSelectionRect(pendingRect || rect);
          setPendingRect(null);
        }
      },
    });
  }, [msg.id, translate, translation, pendingRect]);

  // Close translation tooltip when clicking outside of the message bubble
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const messageElement = document.getElementById(`message-${msg.id}`);
      if (messageElement && !messageElement.contains(event.target as Node)) {
        setTranslation(null);
        setSelectionRect(null);
        setPendingRect(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [msg.id]);

  // Close translation tooltip when conversation changes
  useEffect(() => {
    return () => {
      setTranslation(null);
      setSelectionRect(null);
      setPendingRect(null);
    };
  }, [msg.conversationId]);

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
        <p 
          id={`message-${msg.id}`} 
          onMouseUp={msg.sender === 'ai' ? handleTextSelection : undefined}
          className="relative"
        >
          {msg.content}
        </p>
        {msg.sender === 'ai' && translation && selectionRect && (
          <TranslationTooltip 
            translation={translation.translated} 
            selectionRect={selectionRect}
          />
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}