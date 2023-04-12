import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, createTheme } from '@rneui/themed';
import * as SplashScreen from 'expo-splash-screen';
import { PresetTheme } from './constants/themes';
import { ModeView } from './components/ModeView';
import { RootNavigator } from './navigation/RootNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Todo
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);


  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={createTheme(PresetTheme.default)}>
        <ModeView>
            <RootNavigator onReady={onLayoutRootView}/>
        </ModeView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}