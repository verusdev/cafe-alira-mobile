import React, {useState, useMemo} from 'react';
import {ScrollView, StyleSheet, View, Alert} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Divider,
  Card,
} from 'react-native-paper';
import {useMenu} from '../api/useMenu';
import {useOrderCreate} from '../api/useOrderCreate';
import {DishCard} from '../components/DishCard';
import {MoneyText} from '../components/MoneyText';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {OrderType} from '../api/types';

type Props = NativeStackScreenProps<any>;

interface CartItem {
  dishId: number;
  name: string;
  price: string;
  quantity: number;
}

export function OrderCreateScreen({navigation}: Props) {
  const {data: menu} = useMenu();
  const mutation = useOrderCreate();

  const [orderType, setOrderType] = useState<OrderType>('takeout');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [comment, setComment] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0,
    );
  }, [cart]);

  const addToCart = (dishId: number, name: string, price: string) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.dishId === dishId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {...next[idx], quantity: next[idx].quantity + 1};
        return next;
      }
      return [...prev, {dishId, name, price, quantity: 1}];
    });
  };

  const removeFromCart = (dishId: number) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.dishId === dishId);
      if (idx < 0) return prev;
      if (prev[idx].quantity <= 1) return prev.filter(i => i.dishId !== dishId);
      const next = [...prev];
      next[idx] = {...next[idx], quantity: next[idx].quantity - 1};
      return next;
    });
  };

  const handleSubmit = () => {
    if (!customerName.trim()) {
      Alert.alert('Ошибка', 'Введите имя клиента');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы одну позицию');
      return;
    }
    if (orderType === 'event' && !eventDate.trim()) {
      Alert.alert('Ошибка', 'Укажите дату мероприятия');
      return;
    }

    mutation.mutate(
      {
        orderType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        comment: comment.trim() || undefined,
        eventDate: orderType === 'event' ? eventDate.trim() : undefined,
        eventAddress: orderType === 'event' ? eventAddress.trim() : undefined,
        items: cart.map(c => ({dishId: c.dishId, quantity: c.quantity})),
      },
      {
        onSuccess: order => {
          Alert.alert('Заказ создан', order.orderNumber, [
            {
              text: 'OK',
              onPress: () => navigation.navigate('OrderDetail', {orderId: order.id}),
            },
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
        {/* Тип заказа */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Тип заказа
            </Text>
            <SegmentedButtons
              value={orderType}
              onValueChange={v => setOrderType(v as OrderType)}
              buttons={[
                {value: 'takeout', label: 'На вынос'},
                {value: 'event', label: 'Мероприятие'},
              ]}
            />
          </Card.Content>
        </Card>

        {/* Клиент */}
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Имя клиента *"
              value={customerName}
              onChangeText={setCustomerName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Телефон"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />
            {orderType === 'event' && (
              <>
                <TextInput
                  label="Дата мероприятия *"
                  value={eventDate}
                  onChangeText={setEventDate}
                  mode="outlined"
                  placeholder="2026-08-20 18:00"
                  style={styles.input}
                />
                <TextInput
                  label="Адрес"
                  value={eventAddress}
                  onChangeText={setEventAddress}
                  mode="outlined"
                  style={styles.input}
                />
              </>
            )}
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

        {/* Корзина */}
        {cart.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Корзина ({cart.length})
              </Text>
              {cart.map(item => (
                <View key={item.dishId} style={styles.cartRow}>
                  <Text style={styles.cartName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.qtyRow}>
                    <Text
                      style={styles.qtyBtn}
                      onPress={() => removeFromCart(item.dishId)}>
                      −
                    </Text>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <Text
                      style={styles.qtyBtn}
                      onPress={() =>
                        addToCart(item.dishId, item.name, item.price)
                      }>
                      +
                    </Text>
                  </View>
                  <MoneyText
                    value={parseFloat(item.price) * item.quantity}
                    size="small"
                  />
                </View>
              ))}
              <Divider style={styles.divider} />
              <View style={styles.totalRow}>
                <Text variant="titleMedium" style={{fontWeight: '700'}}>
                  Итого
                </Text>
                <MoneyText value={total} size="large" />
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Меню */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Добавить блюдо
            </Text>
            {menu?.map(item => (
              <DishCard
                key={item.id}
                item={item}
                quantity={cart.find(c => c.dishId === item.id)?.quantity}
                onPlus={() => addToCart(item.id, item.name, item.price)}
                onMinus={() => removeFromCart(item.id)}
              />
            ))}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={mutation.isPending}
          disabled={mutation.isPending}
          style={styles.submitBtn}
          buttonColor="#4CAF50">
          Создать заказ
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F5F5F5'},
  container: {padding: 16, paddingBottom: 40},
  card: {marginBottom: 12, borderRadius: 12},
  sectionTitle: {marginBottom: 10, fontWeight: '700'},
  input: {marginBottom: 10},
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  cartName: {flex: 1, fontSize: 14},
  qtyRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  qtyBtn: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
    width: 28,
    height: 28,
    textAlign: 'center',
    lineHeight: 28,
  },
  qtyValue: {fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center'},
  divider: {marginVertical: 10},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitBtn: {marginTop: 8, borderRadius: 12, paddingVertical: 4},
});
