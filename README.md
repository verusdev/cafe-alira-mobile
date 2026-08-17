# Cafe Alira Mobile

Mobile CRM for cafe employees (Android). Built with React Native 0.87 + TypeScript.

Connects to the Symfony REST API backend at `C:\develop\cafe`.

## Features

- **Dashboard** - daily stats, quick actions
- **Menu** - browse dishes with categories and prices
- **Orders** - list, filter, create, view details
- **Status management** - new -> confirmed -> preparing -> done / cancelled
- **Payments** - cash, card, transfer with balance tracking
- **Settings** - configure API URL and key

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.87 |
| Language | TypeScript |
| Navigation | React Navigation 7 (Bottom Tabs + Stack) |
| UI Kit | React Native Paper (Material Design 3) |
| State | TanStack Query 5 (server), Zustand (client) |
| Forms | React Hook Form + Zod |
| HTTP | Axios |

## Prerequisites

- Node.js 18+
- Android Studio (with SDK 34+)
- JDK 17+
- Symfony backend running on `http://127.0.0.1:8000`

## Getting Started

### 1. Install dependencies

```sh
cd cafe-mobile
npm install
```

### 2. Configure API connection

Open the app -> Settings tab, or set defaults in `src/store/useSettingsStore.ts`:

```typescript
apiUrl: 'http://10.0.2.2:8000',  // Android emulator -> host localhost
apiKey: 'cafe-api-2026-local',
```

> **Note**: `10.0.2.2` is the special alias for host `localhost` from Android emulator.
> For physical device on same network, use your machine's LAN IP (e.g. `http://192.168.1.x:8000`).

### 3. Start Metro bundler

```sh
npm start
```

### 4. Run on Android

In a separate terminal:

```sh
npm run android
```

Or from Android Studio: open `android/` folder -> Run.

### 5. Run backend

```sh
cd ../cafe
php -S 127.0.0.1:8000 -t public
```

## Project Structure

```
src/
  api/
    client.ts          # Axios instance, base config
    types.ts           # TypeScript types for API entities
    useMenu.ts         # GET /api/dishes
    useOrders.ts       # GET /api/orders
    useOrderCreate.ts  # POST /api/orders
    useOrderPay.ts     # POST /api/orders/:id/pay
    useOrderStatus.ts  # POST /api/orders/:id/status
  components/
    DishCard.tsx       # Menu item card
    OrderCard.tsx      # Order list item
    StatusBadge.tsx    # Colored status pill
    MoneyText.tsx      # Formatted currency
    EmptyState.tsx     # Placeholder for empty lists
  screens/
    DashboardScreen.tsx
    MenuScreen.tsx
    OrdersScreen.tsx
    OrderDetailScreen.tsx
    OrderCreateScreen.tsx
    PaymentScreen.tsx
    SettingsScreen.tsx
  navigation/
    AppNavigator.tsx   # Bottom tabs + stack navigation
    types.ts          # Navigation type definitions
  store/
    useSettingsStore.ts  # Zustand store (API URL, key)
  utils/
    format.ts         # Date, money, status color helpers
```

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dishes` | List all menu items |
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create a new order |
| POST | `/api/orders/:id/pay` | Add payment to order |
| POST | `/api/orders/:id/status` | Change order status |

All requests require `X-API-Key` header.

## Troubleshooting

**Metro can't connect to backend**
- Ensure `php -S 127.0.0.1:8000` is running
- Check API URL in Settings (use `10.0.2.2` for emulator)

**Build fails**
- Run `cd android && ./gradlew clean` then try again
- Ensure JDK 17 and Android SDK are installed

**TypeScript errors**
- Run `npx tsc --noEmit` to check
