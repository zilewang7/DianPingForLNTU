import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";
import { TabNavigation } from "./TabNavigation";
import { ModalNavigation } from "./ModalNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppearanceChangeListener } from "../util/theme-hook";

const RootStack = createStackNavigator();

export const RootNavigator = ({ onReady }) => {
    const { theme } = useTheme();
    useAppearanceChangeListener()

    return (
        <NavigationContainer onReady={onReady} theme={{
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
