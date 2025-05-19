import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import type { Conversation } from "../types/api";
import { useMessages, usePostMessage } from '../hooks/useMessages';

interface MessagePaneProps {
  isMenuOpen: boolean,
  setIsMenuOpen: (open: boolean) => void;
  selectedConversation: Conversation | null;
}

export function MessagePane({ isMenuOpen, setIsMenuOpen, selectedConversation }: MessagePaneProps) {
  const { isDarkMode } = useDarkMode();
  const [showPinyin, setShowPinyin] = useState<Record<string, boolean>>({});
  const [inputText, setInputText] = useState('');
  const { data: messages = [], isLoading } = useMessages(selectedConversation?.id);
  const postMessage = usePostMessage(selectedConversation?.id);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, showPinyin]);
  
  const togglePinyin = (id: string) => {
    setShowPinyin((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sendMessage = () => {
    if (inputText.trim() && selectedConversation) {
      postMessage.mutate(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Messages Pane Menu */}
      <div className={`h-16 py-4 px-6 border-b ${isDarkMode ? 'border-[#415a77]' : 'border-gray-300'} font-semibold text-xl flex items-center justify-between`}>
        <div>
          {!isMenuOpen && (
            <button className="underline text-sm cursor-pointer" onClick={() => setIsMenuOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}
        </div>
        <span>User</span>
      </div>
      {/* Messages */}
      {selectedConversation ? (
        <>
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {messages.map((msg) => (
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
                      {showPinyin[msg.id] && msg.pinyin && (
                        <p className="mt-1 text-sm italic text-gray-500">{msg.pinyin}</p>
                      )}
                      <div className="mt-2 flex gap-2 text-sm">
                        <button className="underline" onClick={() => togglePinyin(msg.id)}>
                          Pinyin
                        </button>
                        <button className="underline">Translate</button>
                      </div>
                    </>
                  )}
                </div>
                <div ref={bottomRef} />
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-[#415a77] bg-[#0d1b2a]' : 'border-gray-300 bg-[#fffbf6]'} flex gap-2`}>
            <input
              type="text"
              placeholder="Type your message here..."
              className={`flex-1 border ${isDarkMode ? 'bg-[#1b263b] border-[#415a77] text-[#e0e1dd]' : 'bg-white border-gray-300 text-gray-800'} rounded-xl px-4 py-2 focus:outline-none`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className={`px-4 py-2 rounded-xl shadow ${isDarkMode ? 'bg-[#17686c] text-[#e0e1dd]' : 'bg-[#a2c9a6] text-gray-800'}`}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  )
}