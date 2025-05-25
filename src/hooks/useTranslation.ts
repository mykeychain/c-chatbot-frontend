import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { TranslationResponse } from '../types/api';

const TRANSLATION_CACHE_KEY = ['translations'] as const;

interface CachedTranslations {
  [text: string]: TranslationResponse;
}

const translateText = async (text: string): Promise<TranslationResponse> => {
  const { data } = await api.post<TranslationResponse>('/api/translate', { text });
  return data;
};

export function useTranslation(): UseMutationResult<TranslationResponse, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      const cache = queryClient.getQueryData<CachedTranslations>(TRANSLATION_CACHE_KEY);
      
      if (cache?.[text]) {
        return cache[text];
      }

      const result = await translateText(text);

      queryClient.setQueryData<CachedTranslations>(TRANSLATION_CACHE_KEY, (old = {}) => ({
        ...old,
        [text]: result,
      }));

      return result;
    },
    onError: (error) => {
      console.error('Translation error:', error);
    },
  });
} 