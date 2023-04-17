import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

export const ModalNavigation = [
    <Stack.Screen
        key={1}
        name="登录/注册"
        component={LoginScreen}
    />
];