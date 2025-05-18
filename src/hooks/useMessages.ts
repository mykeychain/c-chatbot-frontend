import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Message, CreateMessagePayload } from '../types/api';

const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const { data } = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
  return data;
};

const postMessage = async (payload: CreateMessagePayload): Promise<Message> => {
  const { data } = await api.post<Message>('/messages', payload);
  return data;
};

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function usePostMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => postMessage({ conversationId, content }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages', conversationId] }),
  });
}
