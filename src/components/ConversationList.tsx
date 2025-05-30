import { useDarkMode } from '../context/DarkModeContext';
import { useConversations } from '../hooks/useConversations';
import type { Conversation } from '../types/api';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  setIsMenuOpen: (open: boolean) => void;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conv: Conversation | null) => void;
  userId: string;
}

export function ConversationList({ 
  setIsMenuOpen, 
  selectedConversation, 
  setSelectedConversation,
  userId 
}: ConversationListProps) {
  const { data: conversations=[], isLoading } = useConversations(userId);
  const { isDarkMode } = useDarkMode();
  
  const handleHeaderClick = () => {
    setSelectedConversation(null);
  };
  
  return (
    <div className={`
      w-80 border-r flex flex-col h-full
      transition-colors duration-300 ease-in-out
      ${isDarkMode ? 'border-[#415a77] bg-[#0d1b2a]' : 'border-gray-300 bg-[#fffbf6]'}
    `}>
      {/* Header */}
      <div className={`
        h-16 py-4 px-6 border-b flex items-center justify-between
        transition-colors duration-300 ease-in-out
        ${isDarkMode ? 'border-[#415a77]' : 'border-gray-300'}
      `}>
        {/* Header with logo -- click to clear selected conversation */}
        <div className="flex items-center gap-4">
          <div 
            className="flex flex-row items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleHeaderClick}
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </span>
            <span className="ps-2 font-semibold text-xl">Chatbot</span>
          </div>
        </div>
        {/* Close Sidebar Button */}
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
          <ConversationItem
            key={`conversation-item-${conv.id}`}
            conv={conv}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
        ))}
      </div>
    </div>
  );
}
