import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import type { Conversation } from "../types/api";
import { useMessages, usePostMessage } from '../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { BotSelectionView } from './BotSelectionView';
import { DarkModeToggle } from './DarkModeToggle';

interface MessagePaneProps {
  isMenuOpen: boolean,
  setIsMenuOpen: (open: boolean) => void;
  selectedConversation: Conversation | null;
  userId: string;
  onConversationCreated: (conversationId: string) => void;
}

export function MessagePane({ 
  isMenuOpen, 
  setIsMenuOpen, 
  selectedConversation,
  userId,
  onConversationCreated
}: MessagePaneProps) {
  const { isDarkMode } = useDarkMode();
  const [inputText, setInputText] = useState('');
  const { data: messages = [], isLoading } = useMessages(selectedConversation?.id);
  const postMessage = usePostMessage(selectedConversation?.id);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  const sendMessage = () => {
    if (inputText.trim() && selectedConversation) {
      postMessage.mutate(inputText);
      setInputText('');
    }
  };

  return (
    <div className={`
      flex flex-col h-full
      transition-colors duration-300 ease-in-out
      ${isDarkMode ? 'text-[#e0e1dd]' : 'text-gray-800'}
    `}>
      {/* Messages Pane Menu */}
      <div className={`
        h-16 py-4 px-6 border-b font-semibold text-xl flex items-center justify-between
        transition-colors duration-300 ease-in-out
        ${isDarkMode ? 'border-[#415a77]' : 'border-gray-300'}
      `}>
        <div>
          {!isMenuOpen && (
            <button className="underline text-sm cursor-pointer" onClick={() => setIsMenuOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <span>User</span>
        </div>
      </div>
      {selectedConversation ? (
        <>
          {/* Messages */}
          <div className={`
            flex-1 overflow-y-auto p-6
            transition-colors duration-300 ease-in-out
            ${isDarkMode ? 'bg-[#1A1A24]' : 'bg-[#fffbf6]'}
          `}>
            <div className="flex flex-col justify-end min-h-full">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <MessageBubble key={`message-${msg.id}`} msg={msg}/>
                ))}
                <div className="h-0" ref={bottomRef} />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className={`
            p-4 border-t flex gap-2
            transition-colors duration-300 ease-in-out
            ${isDarkMode ? 'border-[#415a77] bg-[#1A1A24]' : 'border-gray-300 bg-[#fffbf6]'}
          `}>
            <input
              type="text"
              placeholder="Type your message here..."
              className={`
                flex-1 border rounded-xl px-4 py-2 focus:outline-none
                transition-colors duration-300 ease-in-out
                ${isDarkMode ? 'bg-[#0d1b2a] border-[#415a77] text-[#e0e1dd] placeholder-[#415a77]' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}
              `}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className={`
                px-4 py-2 rounded-xl shadow cursor-pointer
                transition-colors duration-300 ease-in-out
                ${isDarkMode ? 'bg-[#17686c] text-[#e0e1dd]' : 'bg-[#a2c9a6] text-gray-800'}
              `}
              onClick={sendMessage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1">
          <BotSelectionView 
            userId={userId} 
            onConversationCreated={onConversationCreated}
          />
        </div>
      )}
    </div>
  )
}