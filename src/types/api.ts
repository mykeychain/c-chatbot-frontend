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
}

export interface CreateConversationResponse {
  id: string;
}

export interface CreateMessagePayload {
  conversationId?: string;
  content: string;
}
  