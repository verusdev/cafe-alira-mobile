import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  apiUrl: string;
  apiKey: string;
  isConfigured: boolean;
  setApiUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

const STORAGE_KEY = 'cafe_settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  apiUrl: 'http://127.0.0.1:8000',
  apiKey: '',
  isConfigured: false,

  setApiUrl: (url: string) => set({apiUrl: url.replace(/\/+$/, '')}),
  setApiKey: (key: string) => set({apiKey: key}),

  loadSettings: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          apiUrl: data.apiUrl ?? 'http://127.0.0.1:8000',
          apiKey: data.apiKey ?? '',
          isConfigured: Boolean(data.apiKey),
        });
      }
    } catch {}
  },

  saveSettings: async () => {
    const {apiUrl, apiKey} = get();
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({apiUrl, apiKey}),
    );
    set({isConfigured: Boolean(apiKey)});
  },
}));
