import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createApiClient} from './client';
import type {Order, OrderStatus} from './types';

/** POST /api/orders/:id/status — смена статуса (требует расширения API) */
export function useOrderStatusChange(orderId: number) {
  const qc = useQueryClient();
  return useMutation<Order, Error, OrderStatus>({
    mutationFn: async (status) => {
      const client = createApiClient();
      const {data} = await client.post(`/orders/${orderId}/status`, {status});
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['orders']});
      qc.invalidateQueries({queryKey: ['order', orderId]});
    },
  });
}
