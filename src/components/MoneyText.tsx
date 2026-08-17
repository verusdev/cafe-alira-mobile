import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

interface Props {
  value: string | number;
  size?: 'small' | 'medium' | 'large';
}

/** Форматирует число как '350,00 ₽' */
export function MoneyText({value, size = 'medium'}: Props) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const formatted = isNaN(num)
    ? '0,00 ₽'
    : num.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' ₽';

  const fontSize =
    size === 'small' ? 13 : size === 'large' ? 22 : 16;

  return <Text style={[styles.money, {fontSize}]}>{formatted}</Text>;
}

const styles = StyleSheet.create({
  money: {
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
