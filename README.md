# Techne Meraki — Sistema de Tienda (Tarea Frontend)

Monorepo del sistema de comercio electrónico **Techne Meraki**: API REST, panel de
administración, tienda web para clientes y app móvil con Expo.

```
FrontendTarea/
├── Backend/           API REST (Node.js + Express + MongoDB/Mongoose)
├── FrontendAdmin/     Panel administrativo (React + Vite)
├── FrontendUsuario/   Tienda web para clientes (React + Vite)
└── FrontendMovil/     App móvil iOS/Android/Web (React Native + Expo SDK 57)
```

Repositorio: https://github.com/MisaelAlexander/FrontendTarea.git

## Equipo

| Estudiante | Rol |
|---|---|
| Misael Alexander Rivas López | Desarrollo full-stack |
| Erika Liseth Juarez Mejia | Desarrollo |
| Herbert Josue Cortez Alfaro | Desarrollo |
| Andres Gabriel Flores Herrera | Desarrollo |

## Funcionalidades

**Clientes (web y móvil):** registro con verificación por correo, inicio de sesión,
recuperación de contraseña en 3 pasos, edición de perfil, catálogo con búsqueda,
carrito de compras, pago con tarjeta (Wompi) o efectivo, historial de pedidos con
detalle, favoritos y valoraciones/comentarios con estrellas (1–5).

**Administración:** login de administradores, gestión de productos e inventario,
pedidos, clientes, vendedores, repartidores, empleados, banners y promociones,
recuperación de contraseña.

**Validaciones del sistema:** campos obligatorios, formato de correo, contraseña
mínimo 6 caracteres, cantidades enteras mayores a cero, control de inventario
(stope en UI + validación y descuento atómico en backend al crear el pedido),
tarjeta (titular, 15–16 dígitos, `MM/AA` no vencida, CVC 3–4) y calificación 1–5.

## Dependencias instaladas

**Backend** (`Backend/package.json`): `express`, `mongoose` (ODM),
`bcryptjs`, `jsonwebtoken`, `cookie-parser`, `cors`, `express-rate-limit`,
`multer` + `multer-storage-cloudinary` + `cloudinary`, `node-mailjet`,
`node-fetch`, `nodemailer` (paquete `node-mailer`, sin uso en código), `dotenv`.

**FrontendUsuario / FrontendAdmin** (React 19 + Vite): `react`, `react-dom`,
`react-router` / `react-router-dom`, `react-hook-form`, `framer-motion`,
`motion`, `lucide-react`, `tailwindcss` + `@tailwindcss/vite`, `axios` (admin).

**FrontendMovil** (Expo SDK ~57): `expo`, `expo-splash-screen`,
`expo-status-bar`, `react-native`, `react-native-safe-area-context`,
`react-native-web` + `react-dom` (soporte web),
`@react-native-async-storage/async-storage`.

## Configuraciones adicionales

- **Variables de entorno — Backend** (`.env`): `DB_URI` (MongoDB Atlas),
  `JWT_Secret_key`, `USER_EMAIL`/`USER_PASSWORD` (legado, en desuso),
  `CLOUDINARY_*`, `GRANT_TYPE`/`AUDIENCE`/`CLIENT_ID`/`CLIENT_SECRET` (Wompi,
  aceptan prefijo `WOMPI_`), `MAILJET_API_KEY`/`MAILJET_SECRET_KEY`/
  `MAILJET_FROM_EMAIL`/`MAILJET_FROM_NAME` (correos transaccionales).
- **Variables de entorno — frontends**: `VITE_API_URL` (webs) y
  `EXPO_PUBLIC_API_URL` (móvil, por defecto Render; en red local usar la IP del
  PC, el celular no alcanza `localhost`).
- **Correo**: Mailjet API v3.1 vía `Backend/src/utils/sendMailjet.js` (reemplaza
  a Nodemailer/Gmail); plantillas `sendMailRecovery.js` y `sendMailRegister.js`
  con los colores de la marca (`#2596be`, `#1e7a9b`, `#1a365d`).
- **Pagos**: cobro directo con tarjeta vía `POST /api/wompi` (el backend maneja
  el OAuth de Wompi); el móvil envía titular, tarjeta, vencimiento y CVC
  validados en cliente.
- **CORS**: permite `localhost:5173/5174`, Vercel y `*.onrender.com`, con
  `credentials: true`; los flujos móviles usan el token en el cuerpo (sin
  cookies httpOnly).
- **Despliegue webs**: `vercel.json` con rewrites SPA a `/index.html`;
  `vite.config.js` de usuario con proxy `/api → http://localhost:4000`.
- **Móvil**: icono, splash nativo (`expo-splash-screen`), splash de bienvenida
  de 3 s tras login y `SafeAreaProvider` (notch + gestos); formato de tarjeta
  en vivo (`4111 1111 1111 1111`, `MM/AA`) y `KeyboardAvoidingView` en
  formularios.

## Cómo correrlo

```bash
# Backend (puerto 4000)
cd Backend && npm install && npm run dev        # nodemon index.js

# Webs (5173 / 5174)
cd FrontendUsuario && npm install && npm run dev
cd FrontendAdmin && npm install && npm run dev

# Móvil
cd FrontendMovil && npm install && npx expo start   # escanear QR con Expo Go
```

## Licencia

Este proyecto está bajo licencia
[Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

Eres libre de compartir y adaptar el material con fines lícitos, siempre que des
el crédito correspondiente al equipo autor indicado arriba.
