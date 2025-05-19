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
      className={`px-6 py-4 cursor-pointer flex flex-row items-center hover:${isDarkMode ? 'bg-[#415a77]' : 'bg-[#f2e9db]'} ${
          selectedConversation?.id === conv.id ? isDarkMode ? 'bg-[#415a77]' : 'bg-[#f2e9db]' : ''
      }`}
      onClick={() => setSelectedConversation(conv)}
    >
      <div>
        <img src='https://placehold.co/100x100' className={`h-15 rounded-full`} alt='placeholder chatbot image' />
      </div>
      <div className={`ml-3`}>
        <div className={`font-bold`}>
          {conv.bot.name}
        </div>
        <div className={`text-sm italic text-gray-500`}>
          {conv.lastMessage.content}
        </div>
      </div>
    </div>
  )
}