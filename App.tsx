import React, {useEffect} from 'react';
import {StatusBar, Platform} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AppNavigator} from './src/navigation/AppNavigator';
import {useSettingsStore} from './src/store/useSettingsStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    secondary: '#03DAC6',
  },
};

export default function App() {
  const loadSettings = useSettingsStore(s => s.loadSettings);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" />
          {Platform.OS === 'android' && (
            // @ts-ignore -- backgroundColor доступен только на Android
            <StatusBar backgroundColor="#6200EE" />
          )}
          <AppNavigator />
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
