import {useQuery} from '@tanstack/react-query';
import {createApiClient} from './client';
import type {MenuItem} from './types';

/** GET /api/menu — активные блюда */
export function useMenu() {
  return useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: async () => {
      const client = createApiClient();
      const {data} = await client.get('/menu');
      return data;
    },
    staleTime: 60_000,
  });
}
