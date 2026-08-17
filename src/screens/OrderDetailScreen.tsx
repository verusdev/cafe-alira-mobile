import React from 'react';
import {ScrollView, StyleSheet, View, Alert} from 'react-native';
import {Text, Button, Divider, Card} from 'react-native-paper';
import {useOrder} from '../api/useOrders';
import {useOrderStatusChange} from '../api/useOrderStatus';
import {StatusBadge} from '../components/StatusBadge';
import {MoneyText} from '../components/MoneyText';
import {formatDateTime} from '../utils/format';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {OrderStatus} from '../api/types';

type Props = NativeStackScreenProps<any>;

const STATUS_ACTIONS: {from: OrderStatus[]; to: OrderStatus; label: string}[] =
  [
    {from: ['new'], to: 'confirmed', label: 'Подтвердить'},
    {from: ['confirmed'], to: 'preparing', label: 'Готовить'},
    {from: ['preparing', 'confirmed'], to: 'done', label: 'Выполнено'},
    {
      from: ['new', 'confirmed', 'preparing'],
      to: 'cancelled',
      label: 'Отменить',
    },
  ];

export function OrderDetailScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {data: order, isLoading} = useOrder(orderId);
  const statusMutation = useOrderStatusChange(orderId);

  if (isLoading || !order) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <Text>Загрузка...</Text>
      </SafeAreaView>
    );
  }

  const allowedActions = STATUS_ACTIONS.filter(a =>
    a.from.includes(order.status),
  );

  const handleStatus = (newStatus: OrderStatus) => {
    Alert.alert('Смена статуса', `Перевести в "${newStatus}"?`, [
      {text: 'Отмена', style: 'cancel'},
      {
        text: 'Да',
        onPress: () => statusMutation.mutate(newStatus),
      },
    ]);
  };

  const canPay = !['cancelled', 'done'].includes(order.status);
  const balance = parseFloat(order.balance);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Шапка */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={{flex: 1}}>
                <Text variant="headlineSmall" style={styles.number}>
                  {order.orderNumber}
                </Text>
                <Text variant="bodyMedium" style={styles.customer}>
                  {order.customerName}
                  {order.customerPhone
                    ? ` · ${order.customerPhone}`
                    : ''}
                </Text>
                <Text style={styles.date}>
                  {formatDateTime(order.createdAt)}
                </Text>
              </View>
              <StatusBadge status={order.status} />
            </View>
            {order.eventDate && (
              <Text style={styles.event}>
                Мероприятие: {formatDateTime(order.eventDate)}
                {order.eventAddress ? ` · ${order.eventAddress}` : ''}
              </Text>
            )}
            {order.comment && (
              <Text style={styles.comment}>💬 {order.comment}</Text>
            )}
          </Card.Content>
        </Card>

        {/* Позиции */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Позиции
            </Text>
            {order.items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.dishName}
                </Text>
                <Text style={styles.itemQty}>×{item.quantity}</Text>
                <MoneyText value={item.subtotal} size="small" />
              </View>
            ))}
            <Divider style={styles.divider} />
            <View style={styles.totalRow}>
              <Text variant="titleMedium" style={{fontWeight: '700'}}>
                Итого
              </Text>
              <MoneyText value={order.total} size="large" />
            </View>
          </Card.Content>
        </Card>

        {/* Оплаты */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Оплаты
            </Text>
            {order.payments.length === 0 ? (
              <Text style={styles.noPayments}>Оплат нет</Text>
            ) : (
              order.payments.map(p => (
                <View key={p.id} style={styles.paymentRow}>
                  <View style={{flex: 1}}>
                    <Text>{p.methodLabel}</Text>
                    <Text style={styles.payDate}>
                      {formatDateTime(p.paidAt)}
                    </Text>
                  </View>
                  <MoneyText value={p.amount} size="small" />
                </View>
              ))
            )}
            <Divider style={styles.divider} />
            <View style={styles.balanceRow}>
              <Text>Оплачено:</Text>
              <MoneyText value={order.totalPaid} size="small" />
            </View>
            <View style={styles.balanceRow}>
              <Text style={{fontWeight: '700'}}>Остаток:</Text>
              <MoneyText
                value={order.balance}
                size={balance > 0 ? 'medium' : 'small'}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Кнопки */}
        {allowedActions.map(action => (
          <Button
            key={action.to}
            mode={action.to === 'cancelled' ? 'outlined' : 'contained'}
            onPress={() => handleStatus(action.to)}
            loading={statusMutation.isPending}
            style={styles.actionBtn}
            buttonColor={
              action.to === 'done'
                ? '#4CAF50'
                : action.to === 'cancelled'
                ? undefined
                : '#FF9800'
            }>
            {action.label}
          </Button>
        ))}

        {canPay && balance > 0 && (
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('Payment', {
                orderId: order.id,
                balance: order.balance,
              })
            }
            style={styles.actionBtn}
            buttonColor="#2196F3">
            Оплатить (осталось {parseFloat(order.balance).toFixed(2)} ₽)
          </Button>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F5F5F5'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {padding: 16, paddingBottom: 40},
  card: {marginBottom: 12, borderRadius: 12},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  number: {fontWeight: '800'},
  customer: {color: '#616161', marginTop: 2},
  date: {color: '#9E9E9E', fontSize: 12, marginTop: 4},
  event: {color: '#2E7D32', marginTop: 8, fontSize: 13},
  comment: {color: '#757575', marginTop: 6, fontStyle: 'italic'},
  sectionTitle: {marginBottom: 10, fontWeight: '700'},
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  itemName: {flex: 1, fontSize: 14},
  itemQty: {color: '#757575', minWidth: 32, textAlign: 'center'},
  divider: {marginVertical: 10},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noPayments: {color: '#9E9E9E', fontStyle: 'italic'},
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  payDate: {fontSize: 11, color: '#9E9E9E'},
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  actionBtn: {marginBottom: 8, borderRadius: 12},
});
