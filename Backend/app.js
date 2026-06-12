import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
//ADMIN
import administradoresRoutes from "./src/routes/Administradores/administradores.js";
import loginAdminRoutes from "./src/routes/Administradores/login.js";
import recuperarContraseniaRoutes from "./src/routes/Administradores/recuperarcontrasena.js";
//ADMIN
//CLIENTES
import clientesRoutes from "./src/routes/Clientes/clientes.js";
import loginClientesRoutes from "./src/routes/Clientes/login.js";
import recuperarClientesRoutes from "./src/routes/Clientes/recuperarContrasenia.js";
import registerClientesRoutes from "./src/routes/Clientes/registerClient.js";
//CLIENTES
//BANNER
import bannerRoutes from "./src/routes/banner.js";
//BANNER
//CARRITO
import carritoRoutes from "./src/routes/carrito.js";
//CARRITO
//COMENTARIOS
import comentarioRoutes from "./src/routes/comentario.js";
//COMENTARIOS
//PEDIDO
import pedidoRoutes from "./src/routes/pedido.js";
//PEDIDO
//PRODUCTO
import productosRoutes from "./src/routes/producto.js";
//PRODUCTO
//PROMOCIONES
import promocionesRoutes from "./src/routes/promociones.js";
//PROMOCIONES
//REPARTIDORES
import repartidoresRoutes from "./src/routes/repartidores.js";
//REPARTIDORES
//VENDEDORES
import vendedoresRoutes from "./src/routes/vendedores.js";
//VENDEDORES

import limiter from "./src/middlewares/limiter.js";
//Ejecutar express
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    //Permitir el envío de cookies y credenciales
    credentials: true,
  }),
);

app.use(limiter);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Creamos los endPoints
//ADMIN

//LOGIN
app.use("/api/admin", administradoresRoutes);
app.use("/api/login-admin", loginAdminRoutes);
app.use("/api/recuperar-admin", recuperarContraseniaRoutes);
 

//CLIENTES
app.use("/api/cliente", clientesRoutes);
app.use("/api/login", loginClientesRoutes);
app.use("/api/recuperar-cliente", recuperarClientesRoutes);
app.use("/api/registrar-cliente", registerClientesRoutes);

//BANNER
app.use("/api/banner", bannerRoutes);
//CARRITO
app.use("/api/carrito", carritoRoutes);
//COMENTARIOS
app.use("/api/comentario", comentarioRoutes);
//PEDIDO
app.use("/api/pedido", pedidoRoutes);
//PRODUCTO
app.use("/api/producto", productosRoutes);
//PROMOCIONES
app.use("/api/promocion", promocionesRoutes);
//REPARTIDORES
app.use("/api/repartidor", repartidoresRoutes);
//VENDEDORES
app.use("/api/vendedor", vendedoresRoutes);
export default app; 