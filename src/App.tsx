import React, { useState } from 'react';
import { ConversationList } from './components/ConversationList';
import { useDarkMode } from './context/DarkModeContext';
import type { Conversation } from './types/api'
import { MessagePane } from './components/MessagePane';
import { useQueryClient } from '@tanstack/react-query';

// TODO: Replace with actual user ID from authentication
const TEMP_USER_ID = '1';

const ChatApp: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { isDarkMode } = useDarkMode();
  const queryClient = useQueryClient();

  const handleConversationCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['conversations', TEMP_USER_ID] });
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#1A1A24] text-[#e0e1dd]' : 'bg-[#f7f3ea] text-gray-800'}`}>
      <div className={`
        transform transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'w-80' : 'w-0'}
        absolute z-10 h-full md:relative overflow-hidden
      `}>
        <div className={`
          transform transition-transform duration-300 ease-in-out h-full
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <ConversationList
            setIsMenuOpen={setIsMenuOpen}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            userId={TEMP_USER_ID}
          />
        </div>
      </div>

      <div className={`
        transition-all duration-300 ease-in-out flex-1
        ${isMenuOpen ? 'md:ml-0' : 'ml-0'}
      `}>
        <MessagePane 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          selectedConversation={selectedConversation}
          userId={TEMP_USER_ID}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </div>
  );
};

export default ChatApp;