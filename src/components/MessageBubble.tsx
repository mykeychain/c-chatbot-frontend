import { useState, useEffect, useCallback, useRef } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationTooltip } from './TranslationTooltip';
import { Tooltip } from './Tooltip';
import { formatPinyinText } from '../utils/textProcessing';
import type { Message } from '../types/api';

interface MessageBubbleProps {
  msg: Message;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  const { isDarkMode } = useDarkMode();
  const [showPinyin, setShowPinyin] = useState(false);
  const [showWholeTranslation, setShowWholeTranslation] = useState(false);
  const [translation, setTranslation] = useState<{ original: string; translated: string } | null>(null);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { mutate: translate } = useTranslation();
  
  const togglePinyin = () => {
    setShowPinyin(!showPinyin);
  };

  const toggleWholeTranslation = () => {
    setShowWholeTranslation(!showWholeTranslation);
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setTranslation(null);
      setSelectionRect(null);
      setIsLoading(false);
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      setTranslation(null);
      setSelectionRect(null);
      setIsLoading(false);
      return;
    }

    const messageElement = document.getElementById(`message-${msg.id}`);
    if (!messageElement?.contains(selection.anchorNode)) {
      return;
    }

    // Cancel any pending translation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSelectionRect(rect);
    setIsLoading(true);
    setTranslation(null);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    translate(selectedText, {
      onSuccess: (data) => {
        // Only update if we haven't been aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setTranslation({
            original: data.originalText,
            translated: data.translatedText,
          });
          setIsLoading(false);
        }
      },
      onError: () => {
        // Handle error state if needed
        if (!abortControllerRef.current?.signal.aborted) {
          setIsLoading(false);
          setSelectionRect(null);
        }
      }
    });
  }, [msg.id, translate]);

  // Close translation tooltip when clicking outside of the message bubble
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const messageElement = document.getElementById(`message-${msg.id}`);
      if (messageElement && !messageElement.contains(event.target as Node)) {
        setTranslation(null);
        setSelectionRect(null);
        setIsLoading(false);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
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
      setIsLoading(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
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
          className={`relative ${msg.sender === 'ai' ? 'text-lg' : ''}`}
        >
          {msg.content}
        </p>
        {msg.sender === 'ai' && selectionRect && (isLoading || translation) && (
          <TranslationTooltip 
            translation={translation?.translated || null}
            isLoading={isLoading}
            selectionRect={selectionRect}
          />
        )}
        {/* Subtitles and buttons on ai messages */}
        {msg.sender === 'ai' && (
          <>
            {/* Pinyin subtitle */}
            {showPinyin && msg.pinyin && (
              <p className={`mt-1 text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                { formatPinyinText(msg.pinyin) }
              </p>
            )}
            {showWholeTranslation && msg.translation && (
              <p className={`mt-1 text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                { msg.translation }
              </p>
            )}
            
            {/* Buttons */}
            <div className="mt-2 flex gap-2 text-sm">
              {/* Toggle Pinyin button */}
              <Tooltip text="Toggle Pinyin">
                <button 
                  className={`flex items-center justify-center cursor-pointer border rounded-md w-9 h-5 transition-colors duration-200 ${
                    showPinyin 
                      ? isDarkMode 
                        ? 'bg-[#e0e1dd] border-[#e0e1dd]' 
                        : 'bg-gray-800 border-gray-800'
                      : isDarkMode
                        ? 'border-[#e0e1dd] hover:bg-[#e0e1dd]/60'
                        : 'border-gray-800 hover:bg-gray-800/60'
                  }`} 
                  onClick={() => togglePinyin()}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    fill={
                      showPinyin 
                        ? isDarkMode ? '#415a77' : '#f0e4d7' 
                        : 'currentColor'} 
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.226 10.88H0l2.056-6.26h1.42l2.047 6.26h-1.29l-.48-1.61H1.707l-.48 1.61ZM2.76 5.818h-.054l-.75 2.532H3.51zm3.217 5.062V4.62h2.56c1.09 0 1.808.582 1.808 1.54 0 .762-.444 1.22-1.05 1.372v.055c.736.074 1.365.587 1.365 1.528 0 1.119-.89 1.766-2.133 1.766zM7.18 5.55v1.675h.8c.812 0 1.171-.308 1.171-.853 0-.51-.328-.822-.898-.822zm0 2.537V9.95h.903c.951 0 1.342-.312 1.342-.909 0-.591-.382-.954-1.095-.954zm5.089-.711v.775c0 1.156.49 1.803 1.347 1.803.705 0 1.163-.454 1.212-1.096H16v.12C15.942 10.173 14.95 11 13.607 11c-1.648 0-2.573-1.073-2.573-2.849v-.78c0-1.775.934-2.871 2.573-2.871 1.347 0 2.34.849 2.393 2.087v.115h-1.172c-.05-.665-.516-1.156-1.212-1.156-.849 0-1.347.67-1.347 1.83"/>
                  </svg>
                </button>
              </Tooltip>
              {/* Toggle Translation button */}
              <Tooltip text="Translate">
                <button className={`flex items-center justify-center cursor-pointer border rounded-md w-9 h-5 transition-colors duration-200 ${
                  showWholeTranslation 
                    ? isDarkMode 
                      ? 'bg-[#e0e1dd] border-[#e0e1dd]' 
                      : 'bg-gray-800 border-gray-800'
                    : isDarkMode
                      ? 'border-[#e0e1dd] hover:bg-[#e0e1dd]/60'
                      : 'border-gray-800 hover:bg-gray-800/60'
                  }`}
                  onClick={() => toggleWholeTranslation()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg" 
                    width="14"
                    height="14"
                    fill={
                      showWholeTranslation 
                        ? isDarkMode ? '#415a77' : '#f0e4d7' 
                        : 'currentColor'} 
                    viewBox="0 0 16 16">
                    <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
                    <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
                  </svg>
                </button>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </div>
  );
}