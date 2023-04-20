import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import ModelScreen from '../screens/3DModelScreen';
import HomeScreen from '../screens/HomeScreen';
import MineScreen from '../screens/MineScreen';
import { HeaderRight } from '../components/HeaderTitle';

const Tab = createBottomTabNavigator();

export function TabNavigation() {
    const [isTabSwitchAllowed, setTabSwitchAllowed] = useState(true);

    const listeners = ({ navigation }) => ({
        tabPress: (e) => {
            // 检查当前tab
            const currentRoute = navigation.getState().routes[navigation.getState().index].name;
            if (currentRoute !== '食堂' && !e.target.indexOf('食堂')) {
                setTabSwitchAllowed(false);
            }

            // 在切换到其他 tab 时检查是否允许切换
            if (!!e.target.indexOf('食堂') && !isTabSwitchAllowed) {
                // 阻止 tab 切换
                e.preventDefault();
            }
        },
    });

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="主页"
                component={HomeScreen}
                options={{
                    tabBarLabel: '主页',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={size} type="antdesign" />
                    ),
                }}
                listeners={listeners}
            />
            <Tab.Screen
                name="食堂"
                options={{
                    tabBarLabel: '食堂',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="CodeSandbox" color={color} size={size} type="antdesign" />
                    ),
                }}
                listeners={listeners}
            >
                {() => <ModelScreen setTabSwitchAllowed={setTabSwitchAllowed} />}
            </Tab.Screen>
            <Tab.Screen
                name="我的"
                component={MineScreen}
                options={{
                    tabBarLabel: '我的',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="user" color={color} size={size} type="antdesign" />
                    ),
                    headerRight: () => (<HeaderRight />)
                }}
                listeners={listeners}
            />
        </Tab.Navigator>
    );
}
