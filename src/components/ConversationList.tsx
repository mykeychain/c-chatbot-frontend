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
    <div className={`w-1/4 border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-[#fffbf6]'} flex flex-col`}>
      <div className={`py-4 px-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} font-semibold text-xl flex justify-between`}>
        <span>Chatbot</span>
        <button className="text-sm underline" onClick={() => setIsMenuOpen(false)}>Close</button>
      </div>
      <div className="overflow-auto flex-1">
        {isLoading && <p>Loading</p>}
        {!isLoading && conversations.map((conv) => (
          <div
          key={conv.id}
          className={`px-6 py-4 cursor-pointer hover:${isDarkMode ? 'bg-gray-700' : 'bg-[#f2e9db]'} ${
              selectedConversation?.id === conv.id ? isDarkMode ? 'bg-gray-700' : 'bg-[#f2e9db]' : ''
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
