import React from 'react';
import { View, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useTheme } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { PresetTheme } from '../constants/themes';
import { setTheme } from '../redux/slices/themeSlice';

type ThemeComponentProps = {};

export const ThemeComponent: React.FunctionComponent<ThemeComponentProps> = () => {
  const { updateTheme } = useTheme();
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();

  return (
    <View style={styles.view}>
      {
        Object.keys(PresetTheme).map((theme) => (
          <Pressable
            key={theme}
            style={{
              backgroundColor: PresetTheme[theme][colorScheme + 'Colors'].primary,
              height: 50,
              width: '100%',
              marginBottom: 10,
            }}
            onPress={() => {
              updateTheme({ ...PresetTheme[theme], mode: colorScheme });
              dispatch(setTheme(PresetTheme[theme]));
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