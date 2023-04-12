import { useTheme } from "@rneui/themed";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export const ModeView = ({ children }) => {
    const { updateTheme } = useTheme();
    const colorScheme = useColorScheme();
    useEffect(() => {
        updateTheme(() => ({
            mode: colorScheme,
        }));
    }, [colorScheme])

    return <>{children}</>
}

