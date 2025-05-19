import React, { useState } from 'react';
import { ConversationList } from './components/ConversationList';
import { useDarkMode } from './context/DarkModeContext';
import type { Conversation } from './types/api'
import { MessagePane } from './components/MessagePane';

const ChatApp: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-[#1b263b] text-[#e0e1dd]' : 'bg-[#f7f3ea] text-gray-800'}`}>
      { isMenuOpen && (
        <ConversationList
          setIsMenuOpen={setIsMenuOpen}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      )}

      { <MessagePane 
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          selectedConversation={selectedConversation}
        /> }
    </div>
  );
};

export default ChatApp;
