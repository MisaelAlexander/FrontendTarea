# Techne Meraki Móvil (MVP Usuario — Expo Go)

Versión móvil de `FrontendUsuario`, conectada al mismo backend.

## Requisitos
- Node 20+
- App **Expo Go** en tu celular (misma red/Wi-Fi no requerida si usas Render)

## Configurar
1. Copia `.env.example` a `.env` (opcional; por defecto usa Render):
   `EXPO_PUBLIC_API_URL=https://frontendtarea.onrender.com/api`
2. Instala: `npm install`
3. Arranca: `npx expo start`
4. Escanea el QR con Expo Go.

> En Expo Go el celular no alcanza `localhost`. Para backend local usa la IP LAN de tu PC:
> `EXPO_PUBLIC_API_URL=http://TU_IP:4000/api` y corre el backend en `0.0.0.0:4000`.

## Qué incluye el MVP (port de la web)
- Login / Registro en 2 pasos + sesión persistida (AsyncStorage)
- Inicio: lista + buscador + pull-to-refresh
- Detalle de producto
- Favoritos (GET/PUT `/api/cliente/:id`)
- Carrito: crear/actualizar, cantidades, total con descuento
- Checkout → POST `/api/pedido` (tarjeta/efectivo)
- Mis pedidos: GET `/api/pedido/cliente/:id`

## Estructura
- `App.js` — providers + tabs (Inicio, Favs, Carrito, Pedidos)
- `src/api/client.js` — port de `FrontendUsuario/src/services/api.js` (sin cookies; usa `clienteId`)
- `src/context/AuthContext.js` / `CartContext.js` — ports de la web con AsyncStorage
- `src/screens/` — Home, ProductDetail, Cart, Orders, Favorites, Login, Register
- `src/components/ProductCard.js` — port de `card.jsx`

## Notas
- El backend usa cookie `clienteToken` httpOnly; en móvil no se usa: se guarda `clienteId/nombre/usuario` y los endpoints de carrito/pedido/producto no exigen auth.
- `check-session` no se usa en móvil por las cookies; la sesión se restaura desde AsyncStorage.
