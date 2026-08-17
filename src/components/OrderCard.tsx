import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {StatusBadge} from './StatusBadge';
import {MoneyText} from './MoneyText';
import {formatDateTime} from '../utils/format';
import type {Order} from '../api/types';

interface Props {
  order: Order;
  onPress: () => void;
}

export function OrderCard({order, onPress}: Props) {
  const badge =
    order.orderType === 'event' ? (
      <View style={styles.eventBadge}>
        <Text style={styles.eventText}>Мероприятие</Text>
      </View>
    ) : null;

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.header}>
            <View style={{flex: 1}}>
              <View style={styles.row}>
                <Text variant="titleMedium" style={styles.number}>
                  {order.orderNumber}
                </Text>
                {badge}
              </View>
              <Text variant="bodyMedium" style={styles.name}>
                {order.customerName}
              </Text>
            </View>
            <StatusBadge status={order.status} />
          </View>

          <View style={styles.footer}>
            <MoneyText value={order.total} size="medium" />
            <Text style={styles.date}>{formatDateTime(order.createdAt)}</Text>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 16, marginVertical: 6, borderRadius: 12},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: 8},
  number: {fontWeight: '700'},
  name: {color: '#757575', marginTop: 2},
  eventBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  eventText: {fontSize: 11, color: '#2E7D32', fontWeight: '600'},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  date: {fontSize: 12, color: '#9E9E9E'},
});
