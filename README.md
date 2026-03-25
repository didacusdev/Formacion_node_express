# Formacion Node.js, Express y MongoDB

> API RESTful desarrollada con Node.js, Express y MongoDB.

## Tecnologías

### En uso

| Tecnología | Uso |
|---|---|
| **Node.js** | Entorno de ejecución |
| **Express 5** | Framework HTTP |
| **MongoDB + Mongoose 9** | Base de datos y ODM |
| **mongoose-paginate-v2** | Paginación de consultas |
| **Argon2** | Hashing de contraseñas |
| **CORS** | Control de acceso entre dominios |
| **dotenv** | Variables de entorno |
| **Nodemon** | Recarga automática en desarrollo |
| **ESLint** | Linter para JavaScript |

### Pendientes de integración

Instaladas pero aún no activas en el código:

| Tecnología | Uso previsto |
|---|---|
| **JSON Web Token (JWT)** | Autenticación basada en tokens |
| **Helmet** | Cabeceras de seguridad HTTP |
| **Morgan** | Logging de peticiones HTTP |
| **express-rate-limit** | Limitación de peticiones |
| **DDoS** | Protección contra ataques DDoS |
| **Multer** | Subida de archivos |
| **mongoose-sequence** | Auto-incremento de campos |

### Planeadas

- OAuth2 o Passport.js para autenticación
- Swagger (documentación de API)
- Pruebas de estres (DDoS) con Artillery, JMeter o Locust (Python)

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd Formacion_node_express
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Copia el archivo de ejemplo y edítalo con tus datos:

   ```bash
   cp .example.env .env
   ```

   Contenido del `.env` a configurar:

   ```env
   PORT=3000
   DB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/formacion_node_express
   DB_URL2=mongodb://<user>:<password>@<shard1>:27017,.../<db>?ssl=true&replicaSet=...&authSource=admin
   DB_URL_LOCAL=mongodb://localhost:27017/formacion_node_express
   ```

   > Configura al menos una de las URLs de base de datos (`DB_URL`, `DB_URL2` o `DB_URL_LOCAL`). La aplicación intentará conectarse en ese orden.

4. **Ejecutar el servidor**

   ```bash
   # Desarrollo (con recarga automática)
   npm run dev

   # Producción
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`.

## Estructura del proyecto

```
src/
├── app.js                  # Configuración de Express y middlewares
├── server.js               # Punto de entrada, conexión a BD y arranque
├── controllers/            # Lógica de negocio
├── database/               # Conexión a MongoDB
├── middlewares/             # Middlewares personalizados
├── models/                 # Esquemas de Mongoose
├── routes/                 # Definición de rutas
├── utils/                  # Utilidades (regex, hash, etc.)
└── mocks/                  # Datos de prueba
```
