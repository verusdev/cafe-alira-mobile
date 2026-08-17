/** Типы навигации для всех стеков */
export type RootTabParamList = {
  Dashboard: undefined;
  Menu: undefined;
  Orders: undefined;
  Settings: undefined;
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: {orderId: number};
  Payment: {orderId: number; balance: string};
};

export type RootStackParamList = {
  Main: undefined;
  OrderCreate: undefined;
};
