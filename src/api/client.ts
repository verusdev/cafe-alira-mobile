import axios from 'axios';
import {useSettingsStore} from '../store/useSettingsStore';

/**
 * Axios-инстанс для REST API кафе.
 * baseURL и заголовок X-API-Key берутся из store настроек.
 */
export function createApiClient() {
  const {apiUrl, apiKey} = useSettingsStore.getState();
  return axios.create({
    baseURL: `${apiUrl}/api`,
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });
}

/** Проверка соединения: GET /api/menu */
export async function testConnection(): Promise<boolean> {
  try {
    const client = createApiClient();
    await client.get('/menu');
    return true;
  } catch {
    return false;
  }
}
