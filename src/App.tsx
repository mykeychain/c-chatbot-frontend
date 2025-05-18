import React, { useState } from 'react';
import { ConversationList } from './components/ConversationList';

interface Conversation {
  id: string;
  bot: string;
  messages: Message[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  pinyin?: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    bot: 'Lily',
    messages: [
      { id: '1', sender: 'bot', text: '你好！你今天过得怎么样？', pinyin: 'Nǐ hǎo! Nǐ jīntiān guò dé zěnme yàng?' },
      { id: '2', sender: 'user', text: '很好，谢谢你！', pinyin: 'Hěn hǎo, xièxiè nǐ!' },
    ],
  },
  {
    id: '2',
    bot: 'Mark',
    messages: [
      { id: '1', sender: 'bot', text: '今天天气不错，你想出去玩吗？', pinyin: 'Jīntiān tiānqì bùcuò, nǐ xiǎng chūqù wán ma?' },
      { id: '2', sender: 'user', text: '好的，我们去公园吧！', pinyin: 'Hǎo de, wǒmen qù gōngyuán ba!' },
    ],
  },
];

const ChatApp: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showPinyin, setShowPinyin] = useState<Record<string, boolean>>({});
  const [inputText, setInputText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const togglePinyin = (id: string) => {
    setShowPinyin((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sendMessage = () => {
    if (inputText.trim() && selectedConversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: inputText,
      };

      setSelectedConversation({
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage],
      });

      setInputText('');
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#f7f3ea] text-gray-800'}`}>
      {/* Left Side */}
      { isMenuOpen && <ConversationList />}
      {isMenuOpen && (
        <div className={`w-1/4 border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-[#fffbf6]'} flex flex-col`}>
          <div className={`py-4 px-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} font-semibold text-xl flex justify-between`}>
            <span>Chatbot</span>
            <button className="text-sm underline" onClick={() => setIsMenuOpen(false)}>Close</button>
          </div>
          <div className="overflow-auto flex-1">
            {mockConversations.map((conv) => (
              <div
                key={conv.id}
                className={`px-6 py-4 cursor-pointer hover:${isDarkMode ? 'bg-gray-700' : 'bg-[#f2e9db]'} ${
                  selectedConversation?.id === conv.id ? isDarkMode ? 'bg-gray-700' : 'bg-[#f2e9db]' : ''
                }`}
                onClick={() => setSelectedConversation(conv)}
              >
                {conv.bot}
              </div>
            ))}
          </div>
          <button className="p-4 border-t border-gray-300" onClick={() => setIsDarkMode(!isDarkMode)}>
            Toggle {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {!isMenuOpen && (
          <button className="m-4 underline text-sm" onClick={() => setIsMenuOpen(true)}>
            Open Menu
          </button>
        )}
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-lg rounded-xl px-4 py-2 shadow-sm ${
                      msg.sender === 'user' ? isDarkMode ? 'bg-green-700' : 'bg-[#d0e7d2]' : isDarkMode ? 'bg-gray-700' : 'bg-[#f0e4d7]'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.sender === 'bot' && (
                      <>
                        {showPinyin[msg.id] && msg.pinyin && (
                          <p className="mt-1 text-sm italic text-gray-500">{msg.pinyin}</p>
                        )}
                        <div className="mt-2 flex gap-2 text-sm">
                          <button className="underline" onClick={() => togglePinyin(msg.id)}>
                            Pinyin
                          </button>
                          <button className="underline">Translate</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-[#fffbf6]'} flex gap-2`}>
              <input
                type="text"
                placeholder="Type your message here..."
                className={`flex-1 border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-800'} rounded-xl px-4 py-2 focus:outline-none`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                className={`px-4 py-2 rounded-xl shadow ${isDarkMode ? 'bg-green-700 text-gray-100' : 'bg-[#a2c9a6] text-gray-800'}`}
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xl">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
