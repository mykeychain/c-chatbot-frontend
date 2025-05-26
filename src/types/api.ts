export interface Conversation {
  id: string;
  userId: string;
  bot: {
    id: string,
    name: string,
    pictureUrl?: string,
  };
  createdAt: string,
  lastMessage: {
    content: string,
  }
}
  
export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  content: string;
  pinyin: string[];
  createdAt: string;
  translation?: string;
}

export interface CreateConversationResponse {
  userId: string;
  botId: string;
}

export interface CreateMessagePayload {
  conversationId?: string;
  content: string;
}

export interface Bot {
  id: string;
  name: string;
  pictureUrl?: string;
}

export interface CreateConversationPayload {
  userId: string;
  botId: string;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
}
  