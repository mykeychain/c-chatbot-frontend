import { useDarkMode } from '../context/DarkModeContext';
import type { Conversation } from "../types/api";
import imgURL2 from '../../public/profile_picture_2.png';
import imgURL3 from '../../public/profile_picture_3.png';
import imgURL4 from '../../public/profile_picture_4.png';
import imgURL5 from '../../public/profile_picture_5.png';

interface ConversationItemProps {
  conv: Conversation;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conv: Conversation) => void;
}

export function ConversationItem({ conv, selectedConversation, setSelectedConversation }: ConversationItemProps) {
  const { isDarkMode } = useDarkMode();
  const pictureUrls = [imgURL2, imgURL3, imgURL4, imgURL5];

  return (
    <div
      key={conv.id}
      className={`px-6 py-4 cursor-pointer flex flex-row items-center hover:${isDarkMode ? 'bg-[#415a77]' : 'bg-[#f2e9db]'} ${
          selectedConversation?.id === conv.id ? isDarkMode ? 'bg-[#415a77]' : 'bg-[#f2e9db]' : ''
      }`}
      onClick={() => setSelectedConversation(conv)}
    >
      <div>
        <img src={pictureUrls[Number(conv.bot.id)-1]} className={`h-15 rounded-full`} alt='placeholder chatbot image' />
      </div>
      <div className={`ml-3`}>
        <div className={`font-bold`}>
          {conv.bot.name}
        </div>
        <div className={`text-sm italic text-gray-500`}>
          {conv.lastMessage?.content}
        </div>
      </div>
    </div>
  )
}