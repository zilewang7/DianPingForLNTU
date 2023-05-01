import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import BusinessScreen from '../screens/BusinessScreen';

const Stack = createStackNavigator();

export const ModalNavigation = [
    <Stack.Screen
        key={1}
        name="登录/注册"
        component={LoginScreen}
    />,
    <Stack.Screen
        key={2}
        name="商家"
        component={BusinessScreen}
        options={{ headerTransparent: true }}
    />,
];