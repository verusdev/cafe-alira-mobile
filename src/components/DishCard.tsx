import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {MoneyText} from './MoneyText';
import type {MenuItem} from '../api/types';

interface Props {
  item: MenuItem;
  onPress?: () => void;
  quantity?: number;
  onPlus?: () => void;
  onMinus?: () => void;
}

export function DishCard({item, onPress, quantity, onPlus, onMinus}: Props) {
  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text variant="titleMedium" style={styles.name}>
              {item.name}
            </Text>
            {item.description ? (
              <Text variant="bodySmall" style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
            <Text variant="labelSmall" style={styles.category}>
              {item.categoryLabel}
            </Text>
          </View>
          <View style={styles.right}>
            <MoneyText value={item.price} size="medium" />
            {quantity !== undefined && onPlus && onMinus && (
              <View style={styles.qtyRow}>
                <Text style={styles.qtyBtn} onPress={onMinus}>
                  −
                </Text>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <Text style={styles.qtyBtn} onPress={onPlus}>
                  +
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {marginHorizontal: 16, marginVertical: 5, borderRadius: 12},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  info: {flex: 1, marginRight: 12},
  name: {fontWeight: '700'},
  desc: {color: '#757575', marginTop: 2},
  category: {color: '#9E9E9E', marginTop: 4, textTransform: 'uppercase'},
  right: {alignItems: 'flex-end', gap: 8},
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  qtyBtn: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2196F3',
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    overflow: 'hidden',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
});
