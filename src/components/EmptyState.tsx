import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Icon} from 'react-native-paper';

interface Props {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({icon = 'tray-alert', title, description}: Props) {
  return (
    <View style={styles.container}>
      <Icon source={icon} size={48} color="#BDBDBD" />
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>
      {description && (
        <Text variant="bodyMedium" style={styles.desc}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    marginTop: 12,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  desc: {
    marginTop: 4,
    color: '#BDBDBD',
    textAlign: 'center',
  },
});
