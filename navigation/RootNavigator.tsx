import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@rneui/themed";
import { TabNavigation } from "./TabNavigation";

const Tab = createBottomTabNavigator();

export const RootNavigator = ({ onReady }) => {
    const { theme } = useTheme();

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
            <TabNavigation />
        </NavigationContainer>
    );
}
