import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Conversation, CreateConversationResponse } from '../types/api';

const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  const { data } = await api.get<Conversation[]>(`/api/users/${userId}/conversations`);
  return data;
};

const createConversation = async (title: string): Promise<CreateConversationResponse> => {
  const { data } = await api.post<CreateConversationResponse>('/conversations', { title });
  return data;
};

export function useConversations(userId: string) {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => fetchConversations(userId),
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({ 
    mutationFn: createConversation, 
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
