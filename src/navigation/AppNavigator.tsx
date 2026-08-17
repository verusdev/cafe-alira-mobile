import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {DashboardScreen} from '../screens/DashboardScreen';
import {MenuScreen} from '../screens/MenuScreen';
import {OrdersScreen} from '../screens/OrdersScreen';
import {OrderDetailScreen} from '../screens/OrderDetailScreen';
import {OrderCreateScreen} from '../screens/OrderCreateScreen';
import {PaymentScreen} from '../screens/PaymentScreen';
import {SettingsScreen} from '../screens/SettingsScreen';
import type {RootTabParamList, OrdersStackParamList} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();

function OrdersStackNavigator() {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#6200EE'},
        headerTintColor: '#fff',
      }}>
      <OrdersStack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={{title: 'Заказы'}}
      />
      <OrdersStack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{title: 'Заказ'}}
      />
      <OrdersStack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{title: 'Оплата'}}
      />
    </OrdersStack.Navigator>
  );
}

const ICON_MAP: Record<string, string> = {
  Dashboard: 'view-dashboard',
  Menu: 'food-fork-drink',
  Orders: 'clipboard-list-outline',
  Settings: 'cog-outline',
};

const ICON_MAP_FOCUSED: Record<string, string> = {
  Dashboard: 'view-dashboard',
  Menu: 'food-fork-drink',
  Orders: 'clipboard-list',
  Settings: 'cog',
};

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerStyle: {backgroundColor: '#6200EE'},
          headerTintColor: '#fff',
          tabBarIcon: ({focused, color, size}) => {
            const iconName = focused
              ? ICON_MAP_FOCUSED[route.name] ?? 'circle'
              : ICON_MAP[route.name] ?? 'circle-outline';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200EE',
          tabBarInactiveTintColor: '#9E9E9E',
        })}>
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{title: 'Главная', headerShown: false}}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{title: 'Меню', headerShown: false}}
        />
        <Tab.Screen
          name="Orders"
          component={OrdersStackNavigator}
          options={{headerShown: false, title: 'Заказы'}}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{title: 'Настройки', headerShown: false}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
