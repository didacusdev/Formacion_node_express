// Express Router es una función que nos permite crear un nuevo enrutador para manejar rutas específicas de nuestra aplicación. 
// Es útil para organizar el código y separar las rutas en módulos.
import { Router } from 'express'; 

// Middlewares
import { generateToken } from '#middlewares/generateToken.js'; // Middleware para generar un token JWT
import { validateAdminToken } from '#middlewares/validateToken.js'; // Middleware para validar el token JWT y verificar que el usuario tenga privilegios de admin

// Importamos el controlador para manejar la lógica de negocio de la ruta.
import { 
  getUsers,
  postUser,
} from '#controllers/userControllers.js'; 


const router = Router(); // Creamios una nueva instancia de Router


/**
 * @openapi
 * /api/users:
 *   get:
 *     # ─── Metadatos del endpoint ───
 *     tags:
 *       - Users
 *     summary: Obtener lista de usuarios (paginada)
 *     description: |
 *       Devuelve una lista paginada de todos los usuarios registrados en la base de datos.
 *       
 *       **Requiere autenticación:** Se necesita un token JWT con rol `admin` en el header `Authorization`.
 *       
 *       La paginación se controla mediante los query params `page` y `limit`.
 *
 *     # ─── Seguridad ───
 *     # Indica que este endpoint requiere el esquema bearerAuth (JWT).
 *     # En Swagger UI aparecerá un candado 🔒 junto al endpoint.
 *     security:
 *       - bearerAuth: []
 *
 *     # ─── Parámetros de la petición ───
 *     # Estos son query params que van en la URL: /api/users?page=1&limit=5
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *         description: Número de página a obtener (por defecto 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: false
 *         description: Número máximo de usuarios por página (por defecto 10)
 *         example: 10
 *
 *     # ─── Respuestas posibles ───
 *     # Cada código HTTP tiene su descripción y el schema del cuerpo de respuesta.
 *     responses:
 *
 *       # ✅ 200 - Éxito
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsers'
 *
 *       # 🔴 401 - No autenticado (no se envió token)
 *       401:
 *         description: Token no proporcionado en el header Authorization
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Token is required"
 *
 *       # 🔴 403 - Prohibido (token inválido, expirado o sin permisos de admin)
 *       403:
 *         description: Token inválido, expirado o el usuario no tiene rol admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               tokenInvalido:
 *                 summary: Token inválido o expirado
 *                 value:
 *                   error: "Invalid or expired token"
 *               tokenExpirado:
 *                 summary: Token expirado
 *                 value:
 *                   error: "Token has expired"
 *               sinPrivilegios:
 *                 summary: Sin privilegios de admin
 *                 value:
 *                   error: "Admin privileges required"
 *
 *       # 🔴 404 - No se encontraron usuarios
 *       404:
 *         description: No se encontraron usuarios en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "No users found"
 *
 *       # 🔴 500 - Error interno del servidor
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "An error occurred while fetching users"
 */
router.get('/users', validateAdminToken, getUsers); // Configuramos la ruta para manejar las solicitudes GET a /users y llamamos al controlador getUsers


/**
 * @openapi
 * /api/users:
 *   post:
 *     # ─── Metadatos del endpoint ───
 *     tags:
 *       - Users
 *     summary: Crear un nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en la base de datos.
 *       
 *       **Proceso interno:**
 *       1. El middleware `generateToken` genera un token JWT a partir del `email` y `role` del body.
 *       2. La contraseña se hashea con **Argon2id** antes de almacenarla.
 *       3. Se guarda el usuario con su token JWT en MongoDB.
 *       
 *       **No requiere autenticación previa** (es el endpoint de registro).
 *       El token JWT se genera automáticamente durante la creación y se devuelve en la respuesta.
 *
 *     # ─── Cuerpo de la petición ───
 *     # Define qué datos espera recibir en el body (JSON).
 *     requestBody:
 *       required: true
 *       description: Datos del nuevo usuario a crear
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *           # Ejemplo concreto que aparecerá en Swagger UI para probar
 *           example:
 *             name: "Juan Garcia"
 *             email: "juan.garcia@email.com"
 *             password: "MiPassword123"
 *             address:
 *               street: "123 Main Street"
 *               city: "Madrid"
 *               state: "Comunidad de Madrid"
 *               zip: "28001"
 *             phone: "+34612345678"
 *             role: "user"
 *
 *     # ─── Respuestas posibles ───
 *     responses:
 *
 *       # ✅ 201 - Usuario creado correctamente
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *                   example: "User created successfully"
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *
 *       # 🔴 400 - Error de validación o datos faltantes
 *       400:
 *         description: Datos inválidos o faltantes en la petición
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Error'
 *                 - $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               camposFaltantesToken:
 *                 summary: Faltan email o role (middleware generateToken)
 *                 value:
 *                   error: "Email and role are required to generate token"
 *               rolInvalido:
 *                 summary: Rol no válido (middleware generateToken)
 *                 value:
 *                   error: "Role must be either user or admin"
 *               validacionMongoose:
 *                 summary: Error de validación de Mongoose
 *                 value:
 *                   error: "Validation failed"
 *                   details:
 *                     - "Name is required"
 *                     - "Invalid email format"
 *                     - "Password must be at least 8 characters long"
 *
 *       # 🔴 500 - Error interno del servidor
 *       500:
 *         description: Error interno del servidor (fallo al crear usuario o generar token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               errorCreacion:
 *                 summary: Fallo al guardar el usuario
 *                 value:
 *                   error: "Failed to create user"
 *               errorGeneral:
 *                 summary: Error general
 *                 value:
 *                   message: "An error occurred while creating the user"
 *                   error: "Descripción del error"
 *               errorToken:
 *                 summary: Error al generar el token JWT
 *                 value:
 *                   error: "An error occurred while generating the token"
 */
router.post('/users', generateToken(), postUser); // Configuramos la ruta para manejar las solicitudes POST a /users y llamamos al controlador postUser

export default router; // Exportamos el enrutador para poder usarlo en otros archivos (como app.js)