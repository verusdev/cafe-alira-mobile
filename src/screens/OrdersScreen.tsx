import React, {useState} from 'react';
import {FlatList, StyleSheet, RefreshControl} from 'react-native';
import {Text, Chip, ActivityIndicator} from 'react-native-paper';
import {useOrders} from '../api/useOrders';
import {OrderCard} from '../components/OrderCard';
import {EmptyState} from '../components/EmptyState';
import type {Order, OrderStatus} from '../api/types';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

const FILTERS: {label: string; value: OrderStatus | ''}[] = [
  {label: 'Все', value: ''},
  {label: 'Новые', value: 'new'},
  {label: 'В работе', value: 'confirmed'},
  {label: 'Готовятся', value: 'preparing'},
  {label: 'Готовы', value: 'done'},
];

export function OrdersScreen({navigation}: Props) {
  const [filter, setFilter] = useState<OrderStatus | ''>('');
  const {data, isLoading, refetch, isRefetching} = useOrders(filter);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={data}
        keyExtractor={item => String(item.id)}
        ListHeaderComponent={
          <FlatList
            horizontal
            data={FILTERS}
            keyExtractor={f => f.value}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
            renderItem={({item: f}) => (
              <Chip
                selected={filter === f.value}
                onPress={() => setFilter(f.value)}
                style={styles.chip}
                showSelectedOverlay>
                {f.label}
              </Chip>
            )}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <EmptyState
              icon="clipboard-text-outline"
              title="Заказов нет"
              description="Нет заказов с выбранным фильтром"
            />
          )
        }
        renderItem={({item}: {item: Order}) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetail', {orderId: item.id})}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F5F5F5'},
  filters: {paddingHorizontal: 12, paddingVertical: 10, gap: 8},
  chip: {marginRight: 4},
  list: {paddingBottom: 32},
  loader: {marginTop: 64},
});
