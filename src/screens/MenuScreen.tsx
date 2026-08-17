import React from 'react';
import {SectionList, StyleSheet, RefreshControl} from 'react-native';
import {Text, ActivityIndicator} from 'react-native-paper';
import {useMenu} from '../api/useMenu';
import {DishCard} from '../components/DishCard';
import {EmptyState} from '../components/EmptyState';
import type {MenuItem} from '../api/types';
import {SafeAreaView} from 'react-native-safe-area-context';

/** Группировка блюд по категориям */
function groupByCategory(items: MenuItem[]) {
  const map = new Map<string, {title: string; data: MenuItem[]}>();
  for (const item of items) {
    const key = item.category;
    if (!map.has(key)) {
      map.set(key, {title: item.categoryLabel, data: []});
    }
    map.get(key)!.data.push(item);
  }
  return Array.from(map.values());
}

export function MenuScreen() {
  const {data, isLoading, refetch, isRefetching} = useMenu();
  const sections = data ? groupByCategory(data) : [];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <EmptyState
          icon="food-fork-drink"
          title="Меню пустое"
          description="Добавьте блюда в админ-панели"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => <DishCard item={item} />}
        renderSectionHeader={({section}) => (
          <Text variant="titleSmall" style={styles.sectionTitle}>
            {section.title}
          </Text>
        )}
        stickySectionHeadersEnabled
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
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  list: {paddingBottom: 32},
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: '#F5F5F5',
    fontWeight: '700',
    color: '#616161',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
