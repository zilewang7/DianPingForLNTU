import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";
import { useEffect } from "react";
import { TabNavigation } from "./TabNavigation";
import { ModalNavigation } from "./ModalNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppearanceChangeListener } from "../util/theme-hook";
import { navigationRef } from "./RootNavigation";
import { useSelector } from "../redux/hook";
import { useColorScheme } from "react-native";

const RootStack = createStackNavigator();

export const RootNavigator = ({ onReady }) => {
    const { theme, updateTheme } = useTheme();
    useAppearanceChangeListener(); //深色模式监听


    // 初始化，加载主题
    const userTheme = useSelector(state => state.theme);
    const colorScheme = useColorScheme();
    useEffect(() => {
        updateTheme({ ...userTheme, mode: colorScheme })
    }, []);

    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={onReady}
            theme={{
                colors: {
                    primary: theme?.colors.primary,
                    background: theme?.colors.background,
                    card: theme?.colors.white,
                    text: theme?.colors.black,
                    border: theme?.colors.divider,
                    notification: theme?.colors.secondary,
                },
                dark: theme.mode === 'dark',
            }}>
            <RootStack.Navigator>
                <RootStack.Group>
                    <RootStack.Screen name="Home" component={TabNavigation} options={{ headerShown: false }} />
                </RootStack.Group>
                <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                    {ModalNavigation}
                </RootStack.Group>
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
