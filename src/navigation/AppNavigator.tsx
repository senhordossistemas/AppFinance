import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { AddPersonScreen } from '../screens/AddPersonScreen';
import { AddAccountScreen } from '../screens/AddAccountScreen';

export type RootStackParamList = {
  Home: undefined;
  AddTransaction: undefined;
  AddPerson: undefined;
  AddAccount: undefined;
  Transactions: undefined;
  Reports: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F7FAFC' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
        <Stack.Screen name="AddPerson" component={AddPersonScreen} />
        <Stack.Screen name="AddAccount" component={AddAccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
