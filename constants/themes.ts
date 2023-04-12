import { Colors, lightColors, darkColors } from "@rneui/themed";

type Mode = "light" | "dark";

interface Theme {
  lightColors: Colors;
  darkColors: Colors;
  mode: Mode;
}

const defaultTheme: Theme = {
  lightColors: lightColors,
  darkColors: { ...darkColors, background: "#333333" },
  mode: "light",
};

enum ThemeList {
  default = "default",
  warm = "warm",
  spring = "spring",
  coffee = "coffee",
  pink = "pink",
  gold = "gold",
}

const createNewTheme = ({
  lightColor,
  darkColor,
}: { lightColor?; darkColor? } = {}): Theme => {
  return {
    ...defaultTheme,
    lightColors: {
      ...defaultTheme.lightColors,
      ...lightColor,
    },
    darkColors: {
      ...defaultTheme.darkColors,
      ...darkColor,
    },
  };
};

export const PresetTheme: { [Key in ThemeList]: Theme } = {
  default: defaultTheme,
  warm: createNewTheme({
    lightColor: {
      primary: "#E74646",
      secondary: "#FA9884",
    },
    darkColor: {
      primary: "#FA9884",
      secondary: "#E74646",
    },
  }),
  spring: createNewTheme({
    lightColor: {
      primary: "#65C18C",
      secondary: "#FFBED8",
    },
    darkColor: {
      primary: "#C1F4C5",
      secondary: "#FF7BA9",
    },
  }),
  coffee: createNewTheme({
    lightColor: {
      primary: "#675D50",
      secondary: "#ABC4AA",
    },
    darkColor: {
      primary: "#F3DEBA",
      secondary: "#A9907E",
    },
  }),
  pink: createNewTheme({
    lightColor: {
      primary: "#E98EAD",
      secondary: "#3A4F7A",
    },
    darkColor: {
      primary: "#FFC6D3",
      secondary: "#FEA1BF",
    },
  }),
  gold: createNewTheme({
    lightColor: {
      primary: "#FFE300",
      secondary: "#FFBC97",
    },
    darkColor: {
      primary: "#FF7800",
      secondary: "#F7F7F7",
    },
  }),
};
