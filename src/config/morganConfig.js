/**
 * ============================================
 *  CONFIGURACIÓN DE MORGAN (Logger HTTP)
 * ============================================
 * 
 * Morgan es un middleware de logging para Express que registra las peticiones HTTP
 * que recibe el servidor. Cada vez que alguien hace una request a la API,
 * Morgan genera una línea de log con la información configurada.
 * 
 * ¿Cómo funciona?
 * ────────────────
 * 1. Morgan intercepta cada petición HTTP que llega a Express.
 * 2. Cuando la respuesta se envía, Morgan recopila los datos de la request/response.
 * 3. Formatea esos datos según el formato (token string) que le definamos.
 * 4. Escribe la línea de log en el destino configurado (consola, archivo, o ambos).
 * 
 * ¿Qué es un "token" en Morgan?
 * ─────────────────────────────
 * Un token es un placeholder como :method, :url, :status, etc.
 * Morgan los reemplaza por los valores reales de cada petición.
 * También puedes crear tokens personalizados con morgan.token().
 * 
 * ¿Qué configuramos aquí?
 * ────────────────────────
 * - Tokens personalizados: :timestamp y :client
 * - Formato de log personalizado para el archivo request.log
 * - Stream de escritura hacia el archivo logs/request.log
 * - Rotación implícita con flag 'a' (append) para no sobrescribir logs anteriores
 */

import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// ─── Obtener __dirname en ES Modules ───
// En CommonJS tenemos __dirname disponible globalmente, pero en ES Modules (type: "module") no existe.
// Necesitamos reconstruirlo a partir de import.meta.url:
//   - import.meta.url → devuelve la URL del archivo actual (ej: file:///C:/proyecto/src/config/morganConfig.js)
//   - fileURLToPath() → convierte esa URL a una ruta del sistema de archivos (ej: C:\proyecto\src\config\morganConfig.js)
//   - path.dirname() → extrae el directorio padre (ej: C:\proyecto\src\config)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ─── Crear directorio de logs si no existe ───
// path.join() construye la ruta de forma segura independientemente del SO (Windows usa \, Linux usa /)
// Subimos dos niveles desde src/config/ para llegar a la raíz del proyecto: ../../logs
const logsDir = path.join(__dirname, '..', '..', 'logs');

// fs.existsSync() comprueba si el directorio ya existe de forma síncrona.
// Si no existe, fs.mkdirSync() lo crea.
// Usamos { recursive: true } para crear directorios intermedios si fuera necesario.
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}


// ─── Stream de escritura para el archivo de logs ───
// fs.createWriteStream() crea un flujo de escritura continuo hacia un archivo.
// - path.join(logsDir, 'request.log') → ruta completa del archivo: /logs/request.log
// - { flags: 'a' } → modo "append" (agregar al final). Sin esto, cada reinicio del servidor
//   sobrescribiría el archivo. Con 'a', los logs se acumulan.
const logStream = fs.createWriteStream(path.join(logsDir, 'request.log'), { flags: 'a' });


// ─── Tokens personalizados ───
// morgan.token() permite definir tokens propios que se pueden usar en el formato de log.
// Cada token recibe (req, res) y debe devolver un string.

/**
 * Token :timestamp
 * ────────────────
 * Genera la fecha y hora actual en formato ISO 8601 (ej: 2024-05-10T12:30:45.123Z).
 * Morgan tiene :date pero este formato es más estándar y fácil de parsear.
 */
morgan.token('timestamp', () => {
  return new Date().toISOString();
});

/**
 * Token :client
 * ─────────────
 * Identifica desde dónde se realizó la petición (navegador, Postman, curl, etc.).
 * Lee la cabecera User-Agent de la request, que los clientes HTTP envían automáticamente.
 * 
 * Ejemplos de User-Agent:
 *   - Navegador Chrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
 *   - Postman: "PostmanRuntime/7.36.0"
 *   - curl: "curl/8.4.0"
 *   - Swagger UI: "Mozilla/5.0..." (viene del navegador donde se abre)
 *   - Si no hay cabecera: "Unknown"
 */
morgan.token('client', (req) => {
  return req.headers['user-agent'] || 'Unknown';
});


// ─── Formato personalizado del log ───
// Definimos el formato como un string con los tokens de Morgan.
// Cada :token será reemplazado por su valor real en cada petición.
//
// Formato resultante en el archivo:
// [2024-05-10T12:30:45.123Z] GET /api/users 200 - 192.168.1.1 - PostmanRuntime/7.36.0
//
// Desglose:
//   :timestamp   → Fecha y hora ISO 8601 (token personalizado)
//   :method      → Método HTTP (GET, POST, PUT, DELETE, PATCH, etc.)
//   :url         → Ruta de la petición (/api/users, /api/users?page=1, etc.)
//   :status      → Código de estado HTTP de la respuesta (200, 201, 404, 500, etc.)
//   :remote-addr → Dirección IP del cliente que hizo la petición
//   :client      → User-Agent del cliente (token personalizado)
const logFormat = '[:timestamp] :method :url :status - :remote-addr - :client';


// ─── Crear instancias del middleware de Morgan ───

/**
 * morganFile: Logger que escribe en el archivo logs/request.log
 * ─────────────────────────────────────────────────────────────
 * - Primer parámetro: formato del log (nuestro formato personalizado)
 * - Segundo parámetro: opciones
 *   - stream: destino de escritura (nuestro WriteStream al archivo)
 * 
 * Este middleware se ejecuta en cada petición y escribe una línea en el archivo.
 */
const morganFile = morgan(logFormat, { stream: logStream });

/**
 * morganConsole: Logger que muestra en consola (modo desarrollo)
 * ──────────────────────────────────────────────────────────────
 * Usa el formato 'dev' predefinido de Morgan, que muestra:
 *   - Método, URL, status, tiempo de respuesta
 *   - Con colores según el status (verde=2xx, amarillo=3xx, rojo=4xx/5xx)
 * 
 * Es más legible que nuestro formato personalizado para desarrollo.
 * Si no se pasa { stream }, Morgan escribe en stdout (consola) por defecto.
 */
const morganConsole = morgan('dev');


export { morganFile, morganConsole };