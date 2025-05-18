import { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import type { Conversation, Message } from "../types/api";
import { useMessages } from '../hooks/useMessages';

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
  
  const togglePinyin = (id: string) => {
    setShowPinyin((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sendMessage = () => {
    if (inputText.trim() && selectedConversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId: selectedConversation.id,
        sender: 'user',
        content: inputText,
        pinyin: [],
        createdAt: '',
      };

      setInputText('');
    }
  };

  return (
      <div className="flex flex-col flex-1">
      {!isMenuOpen && (
        <button className="m-4 underline text-sm" onClick={() => setIsMenuOpen(true)}>
          Open Menu
        </button>
      )}
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
                    msg.sender === 'user' ? isDarkMode ? 'bg-green-700' : 'bg-[#d0e7d2]' : isDarkMode ? 'bg-gray-700' : 'bg-[#f0e4d7]'
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
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-[#fffbf6]'} flex gap-2`}>
            <input
              type="text"
              placeholder="Type your message here..."
              className={`flex-1 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-800'} rounded-xl px-4 py-2 focus:outline-none`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className={`px-4 py-2 rounded-xl shadow ${isDarkMode ? 'bg-green-700 text-gray-100' : 'bg-[#a2c9a6] text-gray-800'}`}
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