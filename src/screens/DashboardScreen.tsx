import React from 'react';
import {ScrollView, StyleSheet, View, RefreshControl} from 'react-native';
import {Text, Card, ActivityIndicator} from 'react-native-paper';
import {useOrders} from '../api/useOrders';
import {useMenu} from '../api/useMenu';
import {MoneyText} from '../components/MoneyText';
import {OrderCard} from '../components/OrderCard';
import {EmptyState} from '../components/EmptyState';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

export function DashboardScreen({navigation}: Props) {
  const {data: orders, isLoading: ordersLoading, refetch: refetchOrders, isRefetching} = useOrders('');
  const {data: menu, refetch: refetchMenu} = useMenu();

  const activeOrders = orders?.filter(o => !['done', 'cancelled'].includes(o.status)) ?? [];
  const recentOrders = orders?.slice(0, 10) ?? [];

  const todayTotal = orders
    ?.filter(o => {
      const d = new Date(o.createdAt);
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    })
    .reduce((sum, o) => sum + parseFloat(o.total), 0) ?? 0;

  const refresh = () => {
    refetchOrders();
    refetchMenu();
  };

  if (ordersLoading) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refresh} />
        }>
        {/* Статистика */}
        <View style={styles.statsRow}>
          <Card style={[styles.statCard, {backgroundColor: '#E3F2FD'}]}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statNumber}>{activeOrders.length}</Text>
              <Text style={styles.statLabel}>Активных</Text>
            </Card.Content>
          </Card>
          <Card style={[styles.statCard, {backgroundColor: '#E8F5E9'}]}>
            <Card.Content style={styles.statContent}>
              <MoneyText value={todayTotal} size="large" />
              <Text style={styles.statLabel}>Выручка сегодня</Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={[styles.statCard, {backgroundColor: '#FFF3E0', marginHorizontal: 16}]}>
          <Card.Content style={styles.statContent}>
            <Text style={styles.statNumber}>{menu?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Блюд в меню</Text>
          </Card.Content>
        </Card>

        {/* Последние заказы */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Последние заказы
        </Text>
        {recentOrders.length === 0 ? (
          <EmptyState
            icon="clipboard-text-outline"
            title="Заказов пока нет"
            description="Создайте первый заказ"
          />
        ) : (
          recentOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() =>
                navigation.navigate('Orders', {
                  screen: 'OrderDetail',
                  params: {orderId: order.id},
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F5F5F5'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: {padding: 16, paddingBottom: 40},
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
});
