import React from 'react';
import { View, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from '@rneui/themed';
import { PresetTheme } from '../constants/themes';

type ThemeComponentProps = {};

export const ThemeComponent: React.FunctionComponent<ThemeComponentProps> = () => {
  const { updateTheme } = useTheme();
  const colorScheme = useColorScheme();

  return (
      <View style={styles.view}>
      {
        Object.keys(PresetTheme).map((theme) => (
          <Pressable
            key={theme}
            style={{
              backgroundColor: PresetTheme[theme].lightColors.primary,
              height: 50,
              width: '100%',
              marginBottom: 10,
            }}
            onPress={() => {
              updateTheme({ ...PresetTheme[theme], mode: colorScheme });
            }}
          />
        ))
      }
      </View>
  );
};

const styles = StyleSheet.create({
  view: {
    margin: 10,
  },
})