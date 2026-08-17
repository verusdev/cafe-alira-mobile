import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

const STATUS_MAP: Record<string, {label: string; bg: string; fg: string}> = {
  new: {label: 'Новый', bg: '#E3F2FD', fg: '#1565C0'},
  confirmed: {label: 'Подтверждён', bg: '#FFF3E0', fg: '#E65100'},
  preparing: {label: 'Готовится', bg: '#F3E5F5', fg: '#6A1B9A'},
  done: {label: 'Выполнен', bg: '#E8F5E9', fg: '#2E7D32'},
  cancelled: {label: 'Отменён', bg: '#FFEBEE', fg: '#C62828'},
};

export function StatusBadge({status}: {status: string}) {
  const s = STATUS_MAP[status] ?? {label: status, bg: '#F5F5F5', fg: '#616161'};
  return (
    <View style={[styles.badge, {backgroundColor: s.bg}]}>
      <Text style={[styles.text, {color: s.fg}]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {fontSize: 12, fontWeight: '700'},
});
