import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Bot } from '../types/api';

const fetchAvailableBots = async (userId: string): Promise<Bot[]> => {
  const { data } = await api.get<Bot[]>(`/api/users/${userId}/available-bots`);
  return data;
};

export function useAvailableBots(userId: string) {
  return useQuery({
    queryKey: ['availableBots', userId],
    queryFn: async () => fetchAvailableBots(userId),
    staleTime: 1000 * 60 * 5,
  });
}