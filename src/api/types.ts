/** Типы, соответствующие JSON-ответам REST API кафе */

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: string;
  category: string;
  categoryLabel: string;
}

export type OrderType = 'takeout' | 'event';
export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'done' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'transfer';

export interface OrderItem {
  id: number;
  dishId: number;
  dishName: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

export interface Payment {
  id: number;
  amount: string;
  method: PaymentMethod;
  methodLabel: string;
  paidAt: string;
  comment: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderType: OrderType;
  orderTypeLabel: string;
  status: OrderStatus;
  statusLabel: string;
  customerName: string;
  customerPhone: string | null;
  eventDate: string | null;
  eventAddress: string | null;
  comment: string | null;
  createdAt: string;
  total: string;
  totalPaid: string;
  balance: string;
  items: OrderItem[];
  payments: Payment[];
}

export interface CreateOrderPayload {
  orderType: OrderType;
  customerName: string;
  customerPhone?: string;
  comment?: string;
  eventDate?: string;
  eventAddress?: string;
  items: Array<{ dishId: number; quantity: number }>;
}

export interface PayOrderPayload {
  amount: number;
  method: PaymentMethod;
  comment?: string;
  paidAt?: string;
}
