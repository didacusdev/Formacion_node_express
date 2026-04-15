/**
 * ============================================
 *  CONFIGURACIÓN DE CORS (Cross-Origin Resource Sharing)
 * ============================================
 * 
 * CORS es un mecanismo de seguridad del navegador que controla qué dominios (orígenes)
 * pueden acceder a los recursos de tu API.
 * 
 * ¿Cómo funciona?
 * ────────────────
 * 1. Cuando un navegador hace una petición a un dominio diferente al de la página actual,
 *    envía una cabecera "Origin" indicando de dónde viene la petición.
 * 
 * 2. El servidor responde con cabeceras CORS (Access-Control-Allow-Origin, etc.)
 *    indicando si ese origen tiene permiso.
 * 
 * 3. Si el origen NO está en la whitelist, el navegador bloquea la respuesta
 *    (la petición sí llega al servidor, pero el navegador no deja que el JS la lea).
 * 
 * 4. Para peticiones "complejas" (PUT, DELETE, headers custom, etc.), el navegador
 *    primero envía una petición preflight (OPTIONS) para verificar los permisos.
 * 
 * ¿Qué es cada opción?
 * ─────────────────────
 * - origin        → Función o array que decide qué orígenes están permitidos (whitelist).
 * - methods       → Métodos HTTP que el servidor acepta desde otros orígenes.
 * - allowedHeaders → Cabeceras que el cliente puede enviar en la petición.
 * - optionsSuccessStatus → Código de respuesta para peticiones preflight (OPTIONS).
 * 
 * IMPORTANTE: CORS es una protección del NAVEGADOR, no del servidor.
 * Herramientas como Postman, curl o scripts de backend ignoran CORS completamente.
 * Para proteger tu API de accesos no autorizados desde cualquier fuente, usa autenticación (JWT, API keys, etc.).
 */


// ─── Whitelist de orígenes permitidos ───
// Solo los dominios en esta lista pueden hacer peticiones a la API desde un navegador.
// Para permitir un nuevo dominio, simplemente añádelo a este array.
//
// ¿Por qué varios puertos?
// - :3000 → Puerto típico del servidor Express (para Swagger UI, por ejemplo)
// - :5173 → Puerto por defecto de Vite (React, Vue, Svelte en desarrollo)
// - :5500 → Puerto de Live Server (extensión de VS Code)
// - :4200 → Puerto por defecto de Angular CLI
// - :8080 → Puerto común alternativo
// - Sin puerto → Por si se accede directamente como http://localhost sin especificar puerto
const whitelist = [
  'http://localhost',
  'http://127.0.0.1',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
];


// ─── Blacklist de orígenes bloqueados ───
// Dominios/IPs explícitamente baneados. Se comprueban ANTES que la whitelist.
// Si un origen está en la blacklist, se rechaza aunque también esté en la whitelist.
// Para banear un dominio o IP, simplemente añádelo a este array.
//
// Ejemplo: 'http://malicious-site.com', 'http://192.168.1.50:3000'
const blacklist = [
  // Añadir aquí los orígenes a bloquear:
  // 'http://dominio-baneado.com',
  // 'http://192.168.1.100',
];


// ─── Opciones de CORS ───
const corsOptions = {

  // ── origin (función personalizada) ──
  // En lugar de pasar un array estático, usamos una función para tener control total.
  // Esta función se ejecuta en cada petición y decide si el origen está permitido.
  //
  // Parámetros:
  //   - origin: string con el dominio del cliente (ej: "http://localhost:5173"), 
  //             o undefined si la petición no viene de un navegador (Postman, curl, etc.)
  //   - callback: función(error, permitido) que debemos llamar con el resultado
  //     - callback(null, true)  → Origen permitido ✅
  //     - callback(new Error()) → Origen bloqueado 🔴
  origin: (origin, callback) => {
    // Si no hay origin (peticiones sin navegador: Postman, curl, server-to-server, etc.)
    // las permitimos. Estas herramientas no envían la cabecera Origin.
    // CORS es solo una protección del navegador, no del servidor.
    if (!origin) return callback(null, true);

    // 1. Comprobar BLACKLIST primero (tiene prioridad sobre la whitelist).
    // Si el origen está baneado, se rechaza inmediatamente sin importar si
    // también aparece en la whitelist. Esto permite banear orígenes específicos
    // sin tener que modificar la whitelist.
    if (blacklist.includes(origin)) {
      return callback(new Error(`Origin ${origin} is blacklisted by CORS`));
    }

    // 2. Comprobar WHITELIST.
    // Si el origin está en nuestra lista de permitidos, lo aceptamos.
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }

    // 3. Cualquier otro dominio no listado en ninguna de las dos listas es rechazado.
    // El navegador recibirá un error de CORS y bloqueará la respuesta.
    // El mensaje del Error aparecerá en los logs del servidor, no en el navegador.
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },

  // ── methods ──
  // Métodos HTTP que el servidor acepta desde otros orígenes.
  // Si un cliente intenta usar un método no listado aquí, la petición preflight fallará.
  methods: 'GET,POST,PUT,PATCH,DELETE',

  // ── allowedHeaders ──
  // Cabeceras que el cliente puede enviar en la petición.
  // - Content-Type: Necesaria para enviar JSON en el body (application/json)
  // - Authorization: Necesaria para enviar el token JWT (Bearer <token>)
  allowedHeaders: 'Content-Type,Authorization',

  // ── optionsSuccessStatus ──
  // Código HTTP para responder a las peticiones preflight (OPTIONS).
  // Usamos 204 (No Content) en lugar del 200 por defecto porque:
  // - La respuesta preflight no tiene body, así que 204 es más semánticamente correcto.
  // - Algunos navegadores antiguos tienen problemas con 200 en preflight.
  optionsSuccessStatus: 204,
};


export default corsOptions;