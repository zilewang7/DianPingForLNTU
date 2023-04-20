import { useTheme } from "@rneui/themed";
import { Appearance } from "react-native";

export const useAppearanceChangeListener = () => {
    const { updateTheme } = useTheme();
    Appearance.addChangeListener(({colorScheme}) => {
        updateTheme(() => ({
            mode: colorScheme,
        }));
    })
}

