import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createApiClient} from './client';
import type {CreateOrderPayload, Order} from './types';

/** POST /api/orders — создать заказ */
export function useOrderCreate() {
  const qc = useQueryClient();
  return useMutation<Order, Error, CreateOrderPayload>({
    mutationFn: async payload => {
      const client = createApiClient();
      const {data} = await client.post('/orders', payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['orders']});
      qc.invalidateQueries({queryKey: ['menu']});
    },
  });
}
