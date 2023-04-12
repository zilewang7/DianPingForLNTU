import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import ModelScreen from '../screens/3DModelScreen';
import HomeScreen from '../screens/HomeScreen';
import MineScreen from '../screens/MineScreen';

const Tab = createBottomTabNavigator();


export function TabNavigation() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="主页" component={HomeScreen} options={
                {
                    tabBarLabel: '主页',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='home' color={color} size={size} type='antdesign' />
                    ),
                }
            } />
            <Tab.Screen name="食堂" component={ModelScreen} options={
                {
                    tabBarLabel: '食堂',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='CodeSandbox' color={color} size={size} type='antdesign' />
                    ),
                }
            }
            />
            <Tab.Screen name="我的" component={MineScreen} options={
                {
                    tabBarLabel: '我的',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name='user' color={color} size={size} type='antdesign' />
                    ),
                }
            } />
        </Tab.Navigator>
    )
}
