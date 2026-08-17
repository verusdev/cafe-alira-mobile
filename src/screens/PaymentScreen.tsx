import React, {useState} from 'react';
import {ScrollView, StyleSheet, Alert} from 'react-native';
import {Text, TextInput, Button, SegmentedButtons, Card} from 'react-native-paper';
import {useOrderPay} from '../api/useOrderPay';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {PaymentMethod} from '../api/types';
import type {OrdersStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<OrdersStackParamList, 'Payment'>;

export function PaymentScreen({route, navigation}: Props) {
  const {orderId, balance} = route.params;
  const balanceNum = parseFloat(balance);
  const mutation = useOrderPay(orderId);

  const [amount, setAmount] = useState(String(balanceNum.toFixed(2)));
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Ошибка', 'Введите корректную сумму');
      return;
    }
    if (amountNum > balanceNum) {
      Alert.alert('Ошибка', `Сумма не может превышать остаток (${balanceNum.toFixed(2)} ₽)`);
      return;
    }

    mutation.mutate(
      {amount: amountNum, method, comment: comment.trim() || undefined},
      {
        onSuccess: () => {
          Alert.alert('Оплата зафиксирована', `${amountNum.toFixed(2)} ₽`, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
        },
        onError: err => {
          Alert.alert('Ошибка', err.message);
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.label}>
              Остаток к оплате
            </Text>
            <Text variant="headlineMedium" style={styles.balance}>
              {balanceNum.toFixed(2)} ₽
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Сумма"
              value={amount}
              onChangeText={setAmount}
              mode="outlined"
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <Text variant="titleMedium" style={styles.label}>
              Способ оплаты
            </Text>
            <SegmentedButtons
              value={method}
              onValueChange={v => setMethod(v as PaymentMethod)}
              buttons={[
                {value: 'cash', label: 'Наличные'},
                {value: 'card', label: 'Карта'},
                {value: 'transfer', label: 'Перевод'},
              ]}
            />

            <TextInput
              label="Комментарий"
              value={comment}
              onChangeText={setComment}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={mutation.isPending}
          disabled={mutation.isPending}
          style={styles.submitBtn}
          buttonColor="#4CAF50">
          Зафиксировать оплату
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F5F5F5'},
  container: {padding: 16, paddingBottom: 40},
  card: {marginBottom: 12, borderRadius: 12},
  label: {marginBottom: 10, fontWeight: '700'},
  balance: {fontWeight: '800', color: '#2E7D32'},
  input: {marginBottom: 12},
  submitBtn: {marginTop: 8, borderRadius: 12, paddingVertical: 4},
});
