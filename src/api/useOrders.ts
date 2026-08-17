import {useQuery} from '@tanstack/react-query';
import {createApiClient} from './client';
import type {Order, OrderStatus} from './types';

/** GET /api/orders — список заказов, опционально по статусу */
export function useOrders(status?: OrderStatus | '') {
  return useQuery<Order[]>({
    queryKey: ['orders', status],
    queryFn: async () => {
      const client = createApiClient();
      const params = status ? {status} : undefined;
      const {data} = await client.get('/orders', {params});
      return data;
    },
    staleTime: 15_000,
  });
}

/** GET /api/orders/:id — один заказ */
export function useOrder(id: number | null) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) throw new Error('No order id');
      const client = createApiClient();
      const {data} = await client.get(`/orders/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}
