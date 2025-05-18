import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Message, CreateMessagePayload } from '../types/api';

const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  if (!conversationId) { return [] }
  const { data } = await api.get<Message[]>(`/api/conversations/${conversationId}/messages`);
  return data;
};

const postMessage = async (payload: CreateMessagePayload): Promise<Message> => {
  if (!payload.conversationId) { throw new Error('Conversation ID missing from message POST request.') };
  const { data } = await api.post<Message>('/api/message', payload);
  return data;
};

export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: !!conversationId,
  });
}

export function usePostMessage(conversationId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => { 
      if (!conversationId) { throw new Error('Conversation ID missing from message POST request.') };

      const previous = qc.getQueryData<Message[]>(['messages', conversationId]) || [];
      const draft: Message = {
        id: Date.now().toString(),
        conversationId: conversationId,
        sender: 'user',
        content: content,
        pinyin: [],
        createdAt: '',
      };
      qc.setQueryData(['messages', conversationId], [...previous, draft]);

      await postMessage({ conversationId, content });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages', conversationId] }),
  });
}
