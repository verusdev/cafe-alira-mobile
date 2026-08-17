import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createApiClient} from './client';
import type {PayOrderPayload, Order} from './types';

/** POST /api/orders/:id/pay — зафиксировать оплату */
export function useOrderPay(orderId: number) {
  const qc = useQueryClient();
  return useMutation<Order, Error, PayOrderPayload>({
    mutationFn: async payload => {
      const client = createApiClient();
      const {data} = await client.post(`/orders/${orderId}/pay`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['orders']});
      qc.invalidateQueries({queryKey: ['order', orderId]});
    },
  });
}
