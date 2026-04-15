import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import rateLimit from "express-rate-limit";
// import Ddos from "ddos";

// ─── Configuraciones centralizadas ───
import corsOptions from '#config/corsConfig.js';
import helmetOptions from '#config/helmetConfig.js';
import { morganFile, morganConsole } from '#config/morganConfig.js';

// ─── Swagger ───
// swagger-ui-express: Middleware que sirve la interfaz visual de Swagger UI en un endpoint.
//   Renderiza una página HTML interactiva donde puedes ver y probar todos los endpoints de la API.
import swaggerUi from 'swagger-ui-express';

// swaggerSpec: Es el objeto JSON con la especificación OpenAPI completa de nuestra API,
//   generado por swagger-jsdoc a partir de la configuración y los comentarios @openapi en las rutas.
import swaggerSpec from '#config/swaggerConfig.js';

// Importamos las rutas de usuarios para poder usarlas en nuestra aplicación.
import userRoutes from '#routes/userRoutes.js';

const app = express();
app.use(express.json()); // Habilitamos express para poder procesar solicitudes con cuerpo en formato JSON


// ─── Helmet (Seguridad HTTP) ───
// Establece cabeceras de seguridad HTTP en cada respuesta.
// La configuración detallada de cada cabecera está en src/config/helmetConfig.js
app.use(helmet(helmetOptions));


// ─── CORS (Control de acceso entre dominios) ───
// Controla qué dominios pueden acceder a la API desde un navegador.
// La whitelist y configuración detallada están en src/config/corsConfig.js
app.use(cors(corsOptions));


// ─── Morgan (Logger HTTP) ───
// Registra cada petición HTTP que recibe el servidor.
// Usamos DOS instancias de Morgan simultáneamente:
//   1. morganFile → Escribe logs en archivo (logs/request.log) con formato detallado
//   2. morganConsole → Muestra logs en consola con formato 'dev' (coloreado y legible)
// Ambos se ejecutan en cada petición sin interferir entre sí.
// La configuración detallada (tokens, formato, stream) está en src/config/morganConfig.js
app.use(morganFile);
app.use(morganConsole);


// ─── Swagger UI ───
// Montamos Swagger UI en la ruta /api-docs.
// - swaggerUi.serve: Sirve los archivos estáticos de Swagger UI (HTML, CSS, JS).
// - swaggerUi.setup(swaggerSpec): Configura Swagger UI con nuestra especificación OpenAPI.
// 
// Al acceder a http://localhost:3000/api-docs verás la documentación interactiva de la API.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// También exponemos la especificación OpenAPI en formato JSON puro.
// Esto es útil para importar la spec en herramientas externas como Postman, Insomnia, etc.
// Accesible en: http://localhost:3000/api-docs/json
app.get('/api-docs/json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Usamos las rutas en la APP
app.use('/api', userRoutes); // Configuramos la ruta base para las rutas de usuarios (http://localhost:3000/api/users)


export default app;
