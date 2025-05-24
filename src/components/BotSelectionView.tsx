import { useState } from 'react';
import type { Bot } from '../types/api';
import { api } from '../lib/api';
import { useAvailableBots } from '../hooks/useAvailableBots';
import { useDarkMode } from '../context/DarkModeContext';

interface BotSelectionViewProps {
  userId: string;
  onConversationCreated: (conversationId: string) => void;
}

export function BotSelectionView({ userId, onConversationCreated }: BotSelectionViewProps) {
  const { isDarkMode } = useDarkMode();
  const { data: bots, isLoading } = useAvailableBots(userId);
  const [isCreating, setIsCreating] = useState(false);

  const handleBotSelect = async (bot: Bot) => {
    try {
      setIsCreating(true);
      const response = await api.post('/api/conversations', {
        userId,
        botId: bot.id,
      });
      onConversationCreated(response.data.id);
    } catch (err) {
      console.error('Error creating conversation:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-4l">
      <h2 className="text-2xl font-semibold mb-6">Choose a Language Partner</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bots?.map((bot) => (
          <button
            key={bot.id}
            onClick={() => handleBotSelect(bot)}
            disabled={isCreating}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer disabled:opacity-50 ${
              isDarkMode ? 'hover:bg-[#415a77]' : 'hover:bg-[#f2e9db]'
            }`}
          >
            {/* {bot.pictureUrl && (
              <img
                src={bot.pictureUrl}
                alt={bot.name}
                className="w-24 h-24 rounded-full mb-3 object-cover"
              />
            )} */}
            <span className="text-lg font-medium">{bot.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 