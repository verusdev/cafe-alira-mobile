import React, {useState} from 'react';
import {ScrollView, StyleSheet, Alert} from 'react-native';
import {TextInput, Button, Text, Card} from 'react-native-paper';
import {useSettingsStore} from '../store/useSettingsStore';
import {testConnection} from '../api/client';
import {SafeAreaView} from 'react-native-safe-area-context';

export function SettingsScreen() {
  const {apiUrl, apiKey, setApiUrl, setApiKey, saveSettings} =
    useSettingsStore();
  const [url, setUrl] = useState(apiUrl);
  const [key, setKey] = useState(apiKey);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setApiUrl(url.trim());
    setApiKey(key.trim());
    setLoading(true);
    try {
      await saveSettings();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setApiUrl(url.trim());
    setApiKey(key.trim());
    await saveSettings();
    setLoading(true);
    try {
      const ok = await testConnection();
      Alert.alert(
        ok ? 'Успешно' : 'Ошибка',
        ok
          ? 'Соединение с сервером установлено!'
          : 'Не удалось подключиться к серверу. Проверьте URL и API-ключ.',
      );
    } catch {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Подключение к серверу
            </Text>

            <TextInput
              label="URL сервера"
              value={url}
              onChangeText={setUrl}
              mode="outlined"
              placeholder="http://127.0.0.1:8000"
              keyboardType="url"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              label="API-ключ"
              value={key}
              onChangeText={setKey}
              mode="outlined"
              placeholder="cafe-api-2026-local"
              secureTextEntry
              autoCapitalize="none"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
              style={styles.btn}>
              {saved ? 'Сохранено!' : 'Сохранить'}
            </Button>

            <Button
              mode="outlined"
              onPress={handleTest}
              loading={loading}
              disabled={loading}
              style={styles.btn}>
              Проверить соединение
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F5F5F5'},
  container: {flex: 1, padding: 16},
  card: {borderRadius: 16},
  title: {marginBottom: 16, fontWeight: '700'},
  input: {marginBottom: 12},
  btn: {marginTop: 8},
});
