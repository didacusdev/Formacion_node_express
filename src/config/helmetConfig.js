/**
 * ============================================
 *  CONFIGURACIÓN DE HELMET (Seguridad HTTP)
 * ============================================
 * 
 * Helmet es una colección de middlewares que establecen cabeceras HTTP de seguridad
 * en las respuestas del servidor. Estas cabeceras instruyen al navegador sobre
 * cómo debe comportarse al interactuar con tu API/sitio.
 * 
 * ¿Cómo funciona?
 * ────────────────
 * 1. Cuando Express envía una respuesta, Helmet intercepta y añade/modifica
 *    las cabeceras HTTP antes de que lleguen al cliente.
 * 
 * 2. Cada sub-middleware de Helmet controla una cabecera específica.
 *    Se pueden activar, desactivar o personalizar individualmente.
 * 
 * 3. El navegador lee estas cabeceras y ajusta su comportamiento de seguridad
 *    (bloquear iframes, forzar HTTPS, restringir scripts, etc.).
 * 
 * ¿Por qué es importante?
 * ────────────────────────
 * Sin estas cabeceras, el navegador usa sus valores por defecto, que suelen ser
 * más permisivos. Un atacante podría aprovechar esa permisividad para:
 * - Inyectar scripts maliciosos (XSS)
 * - Incrustar tu sitio en un iframe para clickjacking
 * - Interceptar tráfico si no se fuerza HTTPS
 * - Obtener información del servidor (X-Powered-By: Express)
 * 
 * NOTA: Helmet protege a los CLIENTES (navegadores). No protege al servidor
 * de ataques directos (DDoS, fuerza bruta, etc.) — para eso se usan rate-limit, DDoS, etc.
 */


// ─── Opciones de Helmet ───
// Cada propiedad corresponde a un sub-middleware de Helmet.
// Todas están activadas aquí con su configuración por defecto explícita.
const helmetOptions = {

  // ══════════════════════════════════════════════════════════════════
  // 1. Content-Security-Policy (CSP)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: Content-Security-Policy
  //
  // ¿Qué hace?
  //   Define una política de seguridad que controla QUÉ RECURSOS puede cargar el navegador
  //   y DESDE DÓNDE. Es la cabecera de seguridad más potente y compleja.
  //
  // ¿Por qué importa?
  //   Previene ataques XSS (Cross-Site Scripting) e inyección de datos al restringir
  //   de dónde se pueden cargar scripts, estilos, imágenes, fonts, etc.
  //
  // ¿Cómo funciona?
  //   Cada directiva (default-src, script-src, etc.) define una política para un tipo
  //   de recurso. Los valores posibles son:
  //     - 'self'          → Solo permite recursos del mismo origen (tu dominio)
  //     - 'none'          → Bloquea completamente ese tipo de recurso
  //     - 'unsafe-inline' → Permite estilos/scripts inline (⚠️ reduce seguridad)
  //     - 'unsafe-eval'   → Permite eval() y similares (⚠️ reduce seguridad)
  //     - URLs específicas → Permite recursos solo de esos dominios
  //
  // Para una API REST que solo sirve JSON, la config por defecto es ideal
  // porque bloquea todo lo que no necesitas.
  contentSecurityPolicy: {
    directives: {
      // default-src: Política por defecto para todos los tipos de recursos
      // que no tengan su propia directiva definida.
      // 'self' = solo permite cargar recursos del mismo origen (tu dominio).
      defaultSrc: ["'self'"],

      // base-uri: Controla qué URLs se pueden usar en la etiqueta <base>.
      // La etiqueta <base> define la URL base para todas las URLs relativas del documento.
      // Limitarlo a 'self' previene que un atacante cambie la base y redirija enlaces.
      baseUri: ["'self'"],

      // font-src: Controla desde dónde se pueden cargar fuentes (Google Fonts, etc.).
      // 'self' + https: + data: = fuentes locales, por HTTPS o embebidas en base64.
      fontSrc: ["'self'", 'https:', 'data:'],

      // form-action: Controla a qué URLs pueden enviar datos los formularios (<form action="...">).
      // 'self' = solo puede enviar formularios a tu propio dominio.
      formAction: ["'self'"],

      // frame-ancestors: Controla quién puede incrustar tu página en un <iframe>, <frame>, etc.
      // 'self' = solo tu propio dominio puede incrustarla.
      // Es el reemplazo moderno de X-Frame-Options (que también activamos por compatibilidad).
      frameAncestors: ["'self'"],

      // img-src: Controla desde dónde se pueden cargar imágenes.
      // 'self' + data: = imágenes locales y embebidas en base64 (data:image/png;base64,...).
      imgSrc: ["'self'", 'data:'],

      // object-src: Controla la carga de plugins como Flash, Java Applets, etc.
      // 'none' = bloquea completamente. Estos plugins están obsoletos y son un vector de ataque.
      objectSrc: ["'none'"],

      // script-src: Controla desde dónde se pueden cargar y ejecutar scripts JavaScript.
      // 'self' = solo scripts servidos desde tu propio dominio.
      // Bloquea scripts inline y de dominios externos (principal protección contra XSS).
      scriptSrc: ["'self'"],

      // script-src-attr: Controla scripts inline en atributos HTML (onclick, onload, etc.).
      // 'none' = bloquea completamente. Estos atributos son un vector de XSS muy común.
      scriptSrcAttr: ["'none'"],

      // style-src: Controla desde dónde se pueden cargar hojas de estilo CSS.
      // 'self' + https: + 'unsafe-inline' = estilos locales, por HTTPS y estilos inline.
      // 'unsafe-inline' es necesario porque muchas librerías (incluida Swagger UI) usan estilos inline.
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],

      // upgrade-insecure-requests: Instruye al navegador a convertir automáticamente
      // todas las peticiones HTTP a HTTPS. Útil en producción con certificado SSL.
      // Es un array vacío porque esta directiva no toma valores, solo se activa o no.
      upgradeInsecureRequests: [],
    },
  },


  // ══════════════════════════════════════════════════════════════════
  // 2. Cross-Origin-Embedder-Policy (COEP)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: Cross-Origin-Embedder-Policy: require-corp
  //
  // ¿Qué hace?
  //   Exige que todos los recursos de otros orígenes que tu página cargue
  //   (imágenes, scripts, iframes) tengan permiso explícito para ser embebidos
  //   (via CORS o Cross-Origin-Resource-Policy).
  //
  // ¿Por qué importa?
  //   Junto con COOP (siguiente), habilita el "cross-origin isolation" del navegador,
  //   que es necesario para usar APIs sensibles como SharedArrayBuffer y de alta precisión (performance.now).
  //   También previene ataques tipo Spectre que explotan la memoria compartida entre procesos.
  //
  // Valores posibles:
  //   - 'require-corp' → Los recursos cross-origin deben tener CORP o CORS headers (más seguro)
  //   - 'credentialless' → Carga recursos cross-origin sin credenciales
  //   - 'unsafe-none' → Desactiva la política
  crossOriginEmbedderPolicy: true,


  // ══════════════════════════════════════════════════════════════════
  // 3. Cross-Origin-Opener-Policy (COOP)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: Cross-Origin-Opener-Policy: same-origin
  //
  // ¿Qué hace?
  //   Aísla el contexto de navegación de tu página. Impide que ventanas de otros
  //   orígenes (abiertas con window.open o enlaces) puedan acceder al window de tu página.
  //
  // ¿Por qué importa?
  //   Previene ataques donde una página maliciosa abre tu app en una ventana nueva
  //   y manipula su DOM o roba información a través de la referencia window.opener.
  //   También es requisito para el "cross-origin isolation" (junto con COEP).
  //
  // Valores posibles:
  //   - 'same-origin' → Solo tu mismo origen puede acceder al window (más seguro)
  //   - 'same-origin-allow-popups' → Permite que popups abiertos por tu página accedan al window
  //   - 'unsafe-none' → Sin restricción
  crossOriginOpenerPolicy: true,


  // ══════════════════════════════════════════════════════════════════
  // 4. Cross-Origin-Resource-Policy (CORP)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: Cross-Origin-Resource-Policy: same-origin
  //
  // ¿Qué hace?
  //   Controla quién puede cargar tus recursos (imágenes, scripts, CSS, JSON, etc.)
  //   desde otros orígenes. Es la contrapartida de COEP: COEP controla lo que TÚ cargas
  //   de otros, CORP controla lo que OTROS cargan de ti.
  //
  // ¿Por qué importa?
  //   Previene que otros sitios incrusten tus recursos en sus páginas (hotlinking,
  //   robo de contenido, ataques Spectre side-channel).
  //
  // Valores posibles:
  //   - 'same-origin' → Solo tu dominio puede cargar tus recursos (más restrictivo)
  //   - 'same-site' → Dominios del mismo site (ej: api.example.com ↔ example.com)
  //   - 'cross-origin' → Cualquier dominio puede cargar tus recursos
  crossOriginResourcePolicy: true,


  // ══════════════════════════════════════════════════════════════════
  // 5. DNS Prefetch Control
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: X-DNS-Prefetch-Control: off
  //
  // ¿Qué hace?
  //   Desactiva la precarga de DNS del navegador. Sin esta cabecera, el navegador
  //   resuelve el DNS de todos los enlaces de la página ANTES de que el usuario haga clic.
  //
  // ¿Por qué importa?
  //   La precarga DNS filtra los dominios que aparecen en tu página al servidor DNS.
  //   Esto puede revelar información sensible (ej: si tu app carga recursos de un dominio
  //   interno corporativo, el DNS público lo sabría).
  //
  // Trade-off:
  //   - off → Más privacidad, pero la resolución DNS será ligeramente más lenta al hacer clic.
  //   - on → Más velocidad, pero menos privacidad.
  //   Para APIs REST que sirven JSON esto no afecta rendimiento (no hay enlaces HTML).
  dnsPrefetchControl: { allow: false },


  // ══════════════════════════════════════════════════════════════════
  // 6. Frameguard (X-Frame-Options)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: X-Frame-Options: SAMEORIGIN
  //
  // ¿Qué hace?
  //   Controla si tu página puede ser cargada dentro de un <iframe>, <frame> o <object>.
  //
  // ¿Por qué importa?
  //   Previene ataques de clickjacking: un atacante pone tu página en un iframe transparente
  //   sobre su página maliciosa. El usuario cree que hace clic en la página del atacante,
  //   pero en realidad interactúa con tu app (ej: borrar cuenta, transferir dinero).
  //
  // Valores posibles:
  //   - 'SAMEORIGIN' → Solo tu dominio puede incrustar tu página en un iframe
  //   - 'DENY' → Nadie puede incrustar tu página (ni tú mismo)
  //
  // NOTA: Esta cabecera es legacy. El reemplazo moderno es frame-ancestors en CSP.
  // Helmet mantiene ambas por compatibilidad con navegadores antiguos.
  frameguard: { action: 'sameorigin' },


  // ══════════════════════════════════════════════════════════════════
  // 7. Hide Powered-By
  // ══════════════════════════════════════════════════════════════════
  // Elimina la cabecera: X-Powered-By: Express
  //
  // ¿Qué hace?
  //   Express añade por defecto la cabecera X-Powered-By: Express a cada respuesta.
  //   Este middleware la elimina.
  //
  // ¿Por qué importa?
  //   Revelar la tecnología del servidor facilita ataques dirigidos.
  //   Si un atacante sabe que usas Express, puede buscar vulnerabilidades conocidas
  //   de Express específicamente. Es "seguridad por oscuridad" — no es suficiente
  //   por sí sola, pero no cuesta nada y reduce la superficie de información expuesta.
  hidePoweredBy: true,


  // ══════════════════════════════════════════════════════════════════
  // 8. HSTS (HTTP Strict Transport Security)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: Strict-Transport-Security: max-age=15552000; includeSubDomains
  //
  // ¿Qué hace?
  //   Le dice al navegador: "A partir de ahora, SIEMPRE usa HTTPS para conectar a
  //   este dominio durante los próximos X segundos. Si alguien intenta cargar HTTP,
  //   conviértelo automáticamente a HTTPS sin ni siquiera hacer la petición HTTP."
  //
  // ¿Por qué importa?
  //   Previene ataques de downgrade (forzar HTTP en lugar de HTTPS) y
  //   ataques Man-in-the-Middle donde el atacante intercepta la petición HTTP
  //   inicial antes de la redirección a HTTPS.
  //
  // Opciones:
  //   - maxAge: Tiempo en segundos que el navegador recuerda la política.
  //     15552000 = 180 días. En producción se recomienda 31536000 (1 año).
  //   - includeSubDomains: Aplica también a todos los subdominios (api.example.com, etc.)
  //
  // NOTA: Solo tiene efecto real en producción con HTTPS. En localhost con HTTP
  // el navegador recibe la cabecera pero no la aplica.
  hsts: {
    maxAge: 15552000,           // 180 días en segundos
    includeSubDomains: true,    // Aplicar también a subdominios
  },


  // ══════════════════════════════════════════════════════════════════
  // 9. IE No Open (X-Download-Options)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: X-Download-Options: noopen
  //
  // ¿Qué hace?
  //   En Internet Explorer, cuando se descarga un archivo HTML, IE ofrece la opción
  //   de "Abrir" directamente (sin guardar). Si el usuario lo abre, el HTML se ejecuta
  //   en el contexto de seguridad de tu sitio, pudiendo acceder a cookies, session, etc.
  //   Esta cabecera desactiva esa opción, forzando a "Guardar" primero.
  //
  // ¿Por qué importa?
  //   Previene que archivos HTML descargados de tu servidor se ejecuten con los
  //   privilegios de tu dominio. Es específico de IE pero no tiene costo mantenerlo.
  ieNoOpen: true,


  // ══════════════════════════════════════════════════════════════════
  // 10. No Sniff (X-Content-Type-Options)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: X-Content-Type-Options: nosniff
  //
  // ¿Qué hace?
  //   Desactiva el "MIME sniffing" del navegador. Sin esta cabecera, si el servidor
  //   envía un archivo con Content-Type: text/plain pero el contenido parece HTML o JS,
  //   el navegador lo "adivina" y lo ejecuta como tal.
  //
  // ¿Por qué importa?
  //   Un atacante podría subir un archivo .txt con contenido JavaScript malicioso.
  //   Sin nosniff, el navegador lo ejecutaría como JS a pesar del Content-Type.
  //   Con nosniff, el navegador respeta estrictamente el Content-Type declarado.
  noSniff: true,


  // ══════════════════════════════════════════════════════════════════
  // 11. Origin-Agent-Cluster
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: Origin-Agent-Cluster: ?1
  //
  // ¿Qué hace?
  //   Sugiere al navegador que aísle tu origen en su propio "agent cluster"
  //   (su propio proceso o hilo). Es como pedirle al navegador que ponga tu
  //   sitio en una "burbuja" separada de otros sitios.
  //
  // ¿Por qué importa?
  //   Mejora el aislamiento entre orígenes, limitando lo que otros sitios
  //   que comparten el mismo proceso del navegador pueden hacer.
  //   Reduce la superficie de ataques side-channel (como Spectre).
  //   Es una sugerencia, no una garantía — el navegador decide si lo aplica.
  originAgentCluster: true,


  // ══════════════════════════════════════════════════════════════════
  // 12. Permitted Cross-Domain Policies
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: X-Permitted-Cross-Domain-Policies: none
  //
  // ¿Qué hace?
  //   Controla si productos de Adobe (Flash Player, Acrobat Reader) pueden
  //   acceder a datos de tu dominio. Buscan un archivo crossdomain.xml en tu
  //   servidor para saber qué permisos tienen.
  //
  // ¿Por qué importa?
  //   Aunque Flash está muerto, algunos clientes corporativos antiguos aún
  //   usan Acrobat con conexiones cross-domain. Bloquearlo con 'none'
  //   previene cualquier acceso cross-domain desde productos Adobe.
  //
  // Valores posibles:
  //   - 'none' → No permite ninguna política cross-domain
  //   - 'master-only' → Solo la política del archivo raíz (/crossdomain.xml)
  //   - 'by-content-type' → Solo si Content-Type es text/x-cross-domain-policy
  //   - 'all' → Cualquier archivo crossdomain.xml (⚠️ inseguro)
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },


  // ══════════════════════════════════════════════════════════════════
  // 13. Referrer-Policy
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: Referrer-Policy: no-referrer
  //
  // ¿Qué hace?
  //   Controla cuánta información de la URL anterior (referrer) se envía en la
  //   cabecera Referer cuando el usuario navega desde tu página a otra.
  //
  //   Ejemplo: Si el usuario está en tu-app.com/admin/panel y hace clic en un
  //   enlace a external-site.com:
  //     - 'no-referrer' → No envía nada (external-site no sabe de dónde vino)
  //     - 'origin' → Envía solo "tu-app.com" (sin la ruta /admin/panel)
  //     - 'full-url' → Envía "tu-app.com/admin/panel" (la URL completa)
  //
  // ¿Por qué importa?
  //   La URL puede contener información sensible (rutas internas, tokens,
  //   IDs de sesión, parámetros de búsqueda). Filtrar esta información a
  //   sitios externos es un riesgo de privacidad.
  //
  // Valores posibles (de más restrictivo a menos):
  //   - 'no-referrer' → Nunca envía referrer (más privado)
  //   - 'same-origin' → Solo envía referrer a tu mismo dominio
  //   - 'strict-origin' → Solo envía el origen (sin path) y solo si es HTTPS→HTTPS
  //   - 'origin' → Solo envía el origen (sin path)
  //   - 'no-referrer-when-downgrade' → Envía URL completa excepto si es HTTPS→HTTP
  //   - 'unsafe-url' → Siempre envía la URL completa (⚠️ menos privado)
  referrerPolicy: { policy: 'no-referrer' },


  // ══════════════════════════════════════════════════════════════════
  // 14. XSS Filter (X-XSS-Protection)
  // ══════════════════════════════════════════════════════════════════
  // Cabecera: X-XSS-Protection: 0
  //
  // ¿Qué hace?
  //   Desactiva el filtro XSS integrado del navegador.
  //
  // ¿Espera, desactivar protección XSS es más seguro?
  //   SÍ. El filtro XSS del navegador (X-XSS-Protection: 1) fue diseñado con buena intención,
  //   pero tiene fallos de implementación que paradójicamente CREAN vulnerabilidades:
  //
  //   - Puede ser engañado para bloquear scripts legítimos de tu app (ataque de denegación selectiva).
  //   - En modo "block", puede filtrar contenido de forma que expone datos sensibles.
  //   - Solo detecta XSS reflejado (no persistente ni DOM-based), dando falsa sensación de seguridad.
  //
  //   Los navegadores modernos ya no soportan este filtro (Chrome lo eliminó en v78, Firefox nunca lo tuvo).
  //   La protección real contra XSS viene de Content-Security-Policy (cabecera #1 de esta config).
  //
  // Valor: false → Helmet envía X-XSS-Protection: 0 (desactivar el filtro)
  xssFilter: true,
};


export default helmetOptions;
