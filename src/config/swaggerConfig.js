/**
 * ============================================
 *  CONFIGURACIÓN DE SWAGGER (OpenAPI 3.0)
 * ============================================
 * 
 * Este archivo configura swagger-jsdoc y swagger-ui-express para generar
 * documentación interactiva de la API automáticamente.
 * 
 * ¿Cómo funciona?
 * ────────────────
 * 1. swagger-jsdoc lee los comentarios JSDoc (con formato YAML/OpenAPI)
 *    que escribimos encima de cada ruta en los archivos de rutas.
 * 
 * 2. Con esos comentarios genera un objeto JSON que cumple la especificación
 *    OpenAPI 3.0 (antes conocida como Swagger).
 * 
 * 3. swagger-ui-express toma ese JSON y sirve una interfaz web interactiva
 *    (Swagger UI) donde puedes ver y probar cada endpoint de la API.
 * 
 * ¿Qué es cada sección de la configuración?
 * ──────────────────────────────────────────
 * - definition.openapi  → Versión de la especificación OpenAPI que usamos (3.0.0).
 * - definition.info     → Metadatos de la API (título, versión, descripción, etc.).
 * - definition.servers  → URLs base donde se puede acceder a la API.
 * - definition.components → Componentes reutilizables como esquemas de seguridad y modelos de datos, en pocas palabras,
 *   la "biblioteca" de tipos que usamos en la documentación.
 *    - definition.components.securitySchemes → Define los esquemas de autenticación
 *      (en nuestro caso Bearer JWT).
 *    - definition.components.schemas → Define los modelos de datos reutilizables
 *      (User, Address, etc.) que se referencian desde la documentación de las rutas.
 * - apis → Array de rutas (glob patterns) a los archivos que contienen las
 *   anotaciones JSDoc con la documentación de los endpoints.
 */

import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    // ─── Versión de OpenAPI ───
    // Usamos la versión 3.0.0 de la especificación OpenAPI.
    // Es el estándar actual para describir APIs REST.
    openapi: '3.0.0',

    // ─── Información general de la API ───
    // Estos metadatos aparecen en la cabecera de Swagger UI.
    info: {
      title: 'API de Usuarios - Formación Node/Express',
      version: '2.0.0',
      description: 
        'API REST para gestión de usuarios construida con **Node.js** y **Express 5**.\n\n' +
        'Incluye autenticación JWT, hashing de contraseñas con Argon2 y paginación con Mongoose.\n\n' +
        '### Autenticación\n' +
        'Los endpoints protegidos requieren un token JWT con rol `admin` en el header:\n' +
        '```\nAuthorization: Bearer <token>\n```',
      contact: {
        name: 'Equipo de Formación',
      },
    },

    // ─── Servidores ───
    // Define las URLs base donde corre la API.
    // Swagger UI usará estas URLs para hacer las peticiones de prueba.
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo local',
      },
    ],

    // ─── Componentes reutilizables ───
    components: {

      // ── Esquemas de seguridad ──
      // Aquí definimos cómo se autentica un usuario en la API.
      // bearerAuth: Usa el estándar Bearer Token (JWT) en el header Authorization.
      securitySchemes: {
        bearerAuth: {
          type: 'http',           // Tipo de esquema HTTP
          scheme: 'bearer',       // Esquema Bearer (Authorization: Bearer <token>)
          bearerFormat: 'JWT',    // Formato del token (informativo para Swagger UI)
          description: 'Token JWT generado al crear un usuario. Formato: `Bearer <token>`',
        },
        // Si tuviéramos otro esquema de autenticación (ej: API Key, Basic Auth), lo definiríamos aquí también, P. Ej: 
        // apiKeyAuth: {
        //   type: 'apiKey',
        //   in: 'header',
        //   name: 'X-API-KEY',
        //   description: 'API Key para acceder a los endpoints protegidos'
        // },
        // Otro ejemplo de esquema de autenticación (Basic Auth):
        // basicAuth: {
        //   type: 'http',
        //   scheme: 'basic',
        //   description: 'Autenticación básica con username y password'
        // },
        // y así sucesivamente para otros tipos de autenticación que quieras documentar (OAuth2, OpenID Connect, etc.)
      },

      // ── Schemas (Modelos de datos) ──
      // Definen la estructura de los objetos que maneja la API.
      // Se referencian desde las rutas con $ref: '#/components/schemas/NombreSchema'
      schemas: {

        // --- Modelo Address (sub-documento de User) ---
        Address: {
          type: 'object',
          description: 'Dirección del usuario',
          required: ['street', 'city', 'state', 'zip'],
          properties: {
            street: {
              type: 'string',
              description: 'Calle (solo letras, números y espacios, 5-100 chars)',
              example: '123 Main Street',
              minLength: 5,
              maxLength: 100,
            },
            city: {
              type: 'string',
              description: 'Ciudad (solo letras y espacios, 2-50 chars)',
              example: 'Madrid',
              minLength: 2,
              maxLength: 50,
            },
            state: {
              type: 'string',
              description: 'Estado/Provincia (solo letras y espacios, 2-50 chars)',
              example: 'Comunidad de Madrid',
              minLength: 2,
              maxLength: 50,
            },
            zip: {
              type: 'string',
              description: 'Código postal (formato: 12345 o 12345-6789)',
              example: '28001',
              pattern: '^\\d{5}(-\\d{4})?$',
            },
          },
        },

        // --- Modelo User (entrada para crear usuario) ---
        UserInput: {
          type: 'object',
          description: 'Datos necesarios para crear un nuevo usuario',
          required: ['name', 'email', 'password', 'address', 'phone'],
          properties: {
            name: {
              type: 'string',
              description: 'Nombre del usuario (solo letras y espacios, 3-50 chars)',
              example: 'Juan Garcia',
              minLength: 3,
              maxLength: 50,
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario (debe ser único)',
              example: 'juan.garcia@email.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña (mínimo 8 caracteres). Se almacena hasheada con Argon2id',
              example: 'MiPassword123',
              minLength: 8,
            },
            address: {
              $ref: '#/components/schemas/Address',
            },
            phone: {
              type: 'string',
              description: 'Teléfono (formato E.164: +[código país][número])',
              example: '+34612345678',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'Rol del usuario. Por defecto es "user"',
              example: 'user',
            },
          },
        },

        // --- Modelo User (respuesta de la API) ---
        UserResponse: {
          type: 'object',
          description: 'Usuario almacenado en base de datos (respuesta de la API)',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único generado por MongoDB',
              example: '663f1a2b3c4d5e6f7a8b9c0d',
            },
            name: {
              type: 'string',
              example: 'Juan Garcia',
            },
            email: {
              type: 'string',
              example: 'juan.garcia@email.com',
            },
            password: {
              type: 'string',
              description: 'Contraseña hasheada con Argon2id (nunca se devuelve en texto plano)',
              example: '$argon2id$v=19$m=65536,t=8,p=2$...',
            },
            tokenJWT: {
              type: 'string',
              description: 'Token JWT asignado al usuario al momento de su creación',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            address: {
              $ref: '#/components/schemas/Address',
            },
            phone: {
              type: 'string',
              example: '+34612345678',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación (generada automáticamente por Mongoose timestamps)',
              example: '2024-05-10T12:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización (generada automáticamente por Mongoose timestamps)',
              example: '2024-05-10T12:30:00.000Z',
            },
          },
        },

        // --- Respuesta paginada de usuarios ---
        PaginatedUsers: {
          type: 'object',
          description: 'Respuesta paginada generada con la lista de usuarios y metadatos de paginación',
          properties: {
            docs: {
              type: 'array',
              description: 'Array con los usuarios de la página actual',
              items: {
                $ref: '#/components/schemas/UserResponse',
              },
            },
            totalDocs: {
              type: 'integer',
              description: 'Número total de documentos en la colección',
              example: 25,
            },
            limit: {
              type: 'integer',
              description: 'Número máximo de documentos por página',
              example: 10,
            },
            totalPages: {
              type: 'integer',
              description: 'Número total de páginas',
              example: 3,
            },
            page: {
              type: 'integer',
              description: 'Página actual',
              example: 1,
            },
            pagingCounter: {
              type: 'integer',
              description: 'Índice del primer documento de la página actual',
              example: 1,
            },
            hasPrevPage: {
              type: 'boolean',
              description: '¿Existe una página anterior?',
              example: false,
            },
            hasNextPage: {
              type: 'boolean',
              description: '¿Existe una página siguiente?',
              example: true,
            },
            prevPage: {
              type: 'integer',
              nullable: true,
              description: 'Número de la página anterior (null si no existe)',
              example: null,
            },
            nextPage: {
              type: 'integer',
              nullable: true,
              description: 'Número de la página siguiente (null si no existe)',
              example: 2,
            },
          },
        },

        // --- Respuesta de error genérica ---
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje descriptivo del error',
              example: 'An error occurred',
            },
          },
        },

        // --- Respuesta de error de validación ---
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation failed',
            },
            details: {
              type: 'array',
              description: 'Lista de mensajes de error de validación de Mongoose',
              items: {
                type: 'string',
              },
              example: ['Name is required', 'Invalid email format'],
            },
          },
        },
      },
    },
  },

  // ─── Archivos a escanear ───
  // swagger-jsdoc buscará comentarios con formato OpenAPI (@openapi)
  // en estos archivos. Usamos un glob pattern para incluir todos los
  // archivos .js dentro de src/routes/
  apis: [
    './src/routes/*.js'
    // En caso de tener rutas en subcarpetas, podríamos usar: './src/routes/**/*.js'
  ],
};

// ─── Generar la especificación ───
// swaggerJsdoc() lee la configuración + los comentarios JSDoc de los archivos
// indicados en `apis` y genera un objeto JSON con la especificación OpenAPI completa.
const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;