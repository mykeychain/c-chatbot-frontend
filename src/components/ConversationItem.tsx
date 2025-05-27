import { useDarkMode } from '../context/DarkModeContext';
import type { Conversation } from "../types/api";

interface ConversationItemProps {
  conv: Conversation;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conv: Conversation) => void;
}

export function ConversationItem({ conv, selectedConversation, setSelectedConversation }: ConversationItemProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      key={conv.id}
      className={`
        px-6 py-4 cursor-pointer flex flex-row items-center
        transition-colors duration-300 ease-in-out
        ${
          isDarkMode 
            ? `hover:bg-[#415a77] ${selectedConversation?.id === conv.id ? 'bg-[#415a77]' : ''}` 
            : `hover:bg-[#f2e9db] ${selectedConversation?.id === conv.id ? 'bg-[#f2e9db]' : ''}`
        }
      `}
      onClick={() => setSelectedConversation(conv)}
    >
      <div className="flex-shrink-0">
        <img src={conv.bot.pictureUrl} className="h-12 w-12 rounded-full" alt='placeholder chatbot image' />
      </div>
      <div className="ml-3 min-w-0 flex-1">
        <div className="font-bold truncate">
          {conv.bot.name}
        </div>
        <div className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
          {conv.lastMessage?.content}
        </div>
      </div>
    </div>
  )
}