import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { TranslationResponse } from '../types/api';

const translateText = async (text: string): Promise<TranslationResponse> => {
  const { data } = await api.post<TranslationResponse>('/api/translate', { text });
  return data;
};

export function useTranslation(): UseMutationResult<TranslationResponse, Error, string> {
  return useMutation({
    mutationFn: translateText,
    onError: (error) => {
      console.error('Translation error:', error);
    },
  });
} 