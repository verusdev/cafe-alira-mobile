/** Форматирование денег: '350' → '350,00 ₽' */
export function formatMoney(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0,00 ₽';
  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + ' ₽';
}

/** Форматирование даты ISO → '16.08.2026 14:35' */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

/** Форматирование даты ISO → '16.08.2026' */
export function formatDate(iso: string): string {
  return formatDateTime(iso).split(' ')[0];
}

/** Цвет статуса заказа */
export const STATUS_COLORS: Record<string, string> = {
  new: '#2196F3',
  confirmed: '#FF9800',
  preparing: '#9C27B0',
  done: '#4CAF50',
  cancelled: '#F44336',
};

/** Метка метода оплаты на русском */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Наличные',
  card: 'Карта',
  transfer: 'Перевод',
};
