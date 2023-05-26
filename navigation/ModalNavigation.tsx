import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import BusinessScreen from '../screens/BusinessScreen';
import { EditPostScreen } from '../screens/EditPostScreen';
import { PostScreen } from '../screens/PostScreen';
import { UserScreen } from '../screens/UserScreen';
import { RandomBusinessScreen } from '../screens/RandomBusinessScreen';
import { PostsScreen } from '../screens/PostsScreen';

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
    <Stack.Screen
        key={3}
        name="发布点评"
        component={EditPostScreen}
    />,
    <Stack.Screen
        key={4}
        name="点评"
        options={{ headerTransparent: true }}
        component={PostScreen}
    />,
    <Stack.Screen
        key={4}
        name="用户"
        component={UserScreen}
    />,
    <Stack.Screen
        key={5}
        name="吃什么"
        component={RandomBusinessScreen}
    />,
    <Stack.Screen
        key={6}
        name="动态"
        component={PostsScreen}
    />,
];