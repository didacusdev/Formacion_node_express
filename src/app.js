import express from 'express';
import cors from 'cors';
// import morgan from "morgan";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import Ddos from "ddos";

// Importamos las rutas de usuarios para poder usarlas en nuestra aplicación.
import userRoutes from '#routes/userRoutes.js';

const app = express();
app.use(express.json()); // Habilitamos express para poder procesar solicitudes con cuerpo en formato JSON

// const corsOptions = {
//   origin: ["http://localhost:3000", "http://example.com"], // Orígenes permitidos o Lista blanca de dominios
//   methods: "GET,POST,PUT,PATCH,DELETE", // Métodos HTTP permitidos
//   allowedHeaders: "Content-Type,Authorization", // Encabezados permitidos
//   optionsSuccessStatus: 204 // Respuesta para solicitudes preflight (OPTIONS)
// };

// CORS: Permite o restringe el acceso a recursos en un servidor desde dominios diferentes al del servidor. 
// Es útil para controlar quién puede acceder a tu API.
// app.use(cors(corsOptions)); 

app.use(cors()); 

// Usamos las rutas en la APP
app.use('/api', userRoutes); // Configuramos la ruta base para las rutas de usuarios (http://localhost:3000/api/users)


export default app;

