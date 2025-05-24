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

  const handleConversationCreated = (conversationId: string) => {
    // Invalidate and refetch conversations
    queryClient.invalidateQueries({ queryKey: ['conversations', TEMP_USER_ID] });
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-[#1b263b] text-[#e0e1dd]' : 'bg-[#f7f3ea] text-gray-800'}`}>
      {isMenuOpen && (
        <ConversationList
          setIsMenuOpen={setIsMenuOpen}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          userId={TEMP_USER_ID}
        />
      )}

      <MessagePane 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        selectedConversation={selectedConversation}
        userId={TEMP_USER_ID}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
};

export default ChatApp;