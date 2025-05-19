import { useDarkMode } from '../context/DarkModeContext';
import { useConversations } from '../hooks/useConversations';
import type { Conversation } from '../types/api';

interface ConversationListProps {
  setIsMenuOpen: (open: boolean) => void;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conv: Conversation) => void;
}

export function ConversationList({ setIsMenuOpen, selectedConversation, setSelectedConversation }: ConversationListProps) {
  const { data: conversations=[], isLoading } = useConversations('1');
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  return (
    <div className={`w-1/4 border-r ${isDarkMode ? 'border-[#415a77] bg-[#0d1b2a]' : 'border-gray-300 bg-[#fffbf6]'} flex flex-col`}>
      {/* Header */}
      <div className={`h-16 py-4 px-6 border-b ${isDarkMode ? 'border-[#415a77]' : 'border-gray-300'} font-semibold text-xl flex items-center justify-between`}>
        <div className={`flex flex-row items-center`}>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </span>
          <span className={`ps-2`}>Chatbot</span>
        </div>
        <button className="text-sm underline cursor-pointer" onClick={() => setIsMenuOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      {/* Conversation List */}
      <div className="overflow-auto flex-1">
        {isLoading && <p>Loading</p>}
        {!isLoading && conversations.map((conv) => (
          <div
          key={conv.id}
          className={`px-6 py-4 cursor-pointer hover:${isDarkMode ? 'bg-[#415a77]' : 'bg-[#f2e9db]'} ${
              selectedConversation?.id === conv.id ? isDarkMode ? 'bg-[#415a77]' : 'bg-[#f2e9db]' : ''
          }`}
          onClick={() => setSelectedConversation(conv)}
          >
            {conv.bot.name}
          </div>
        ))}
      </div>
      <button className="p-4 border-t border-gray-300 cursor-pointer" onClick={() => toggleDarkMode()}>
        Toggle {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
}
