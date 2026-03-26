# Guía de Commits Convencionales y Versionado Automático


Este proyecto utiliza **[Conventional Commits](https://www.conventionalcommits.org/)** para mantener un historial de cambios legible y, lo más importante, para **automatizar el versionado semántico (SemVer)** de la API.

El workflow de GitHub Actions (`Upgrade Version`) decide el incremento de versión leyendo únicamente el **Título de la Pull Request** (no los mensajes de los commits individuales).

Por defecto, si la PR tiene un solo commit, GitHub usará ese mensaje como título. Si hay varios commits, deberás escribir un título manualmente: **ese título es el que el bot usará para decidir el tipo de cambio**.

> ---
> ### ¡Precaución!
> El bot **solo lee el Título de la PR, no los commits**. Si tus commits incluyen `BREAKING CHANGE` pero el título de la PR no lo indica, el bot no lo detectará y subirá solo un Patch.
>
> **Asegúrate** siempre de que el Título de la PR incluya el `!` o la palabra `BREAKING CHANGE` si corresponde.
>
>---

## Estructura del Mensaje

Todo título de PR (y preferiblemente cada commit) debe tener la siguiente estructura:

`tipo(alcance opcional): descripción corta y en imperativo`

Ejemplos:
* `feat: añadir endpoint para registro de usuarios`
* `fix(auth): corregir expiración del token JWT`
* `docs: actualizar guía de instalación en el README`

---

## Tipos de Commits y su Impacto en la Versión

El `tipo` define la intención del cambio y le dice a nuestro robot qué número de versión debe incrementar.

| Tipo | Significado | Descripción | Impacto en Versión (SemVer) | Ejemplo de Salto |
| :--- | :--- | :--- | :--- | :--- |
| **`feat`** | Feature/Funcionalidad/Característica | Añade una nueva funcionalidad a la API. | **MINOR** (Menor) | `1.1.0` → `1.2.0` |
| **`fix`** | Fix/Reparación | Soluciona un error o bug existente. | **PATCH** (Parche) | `1.1.0` → `1.1.1` |
| **`perf`** | Performance/Rendimiento | Mejora el rendimiento del código existente. | **PATCH** (Parche) | `1.1.0` → `1.1.1` |

### Cambios Mayores (Ruptura de compatibilidad)
Si un cambio rompe la compatibilidad con versiones anteriores (ej. cambiar la estructura de la base de datos o eliminar un endpoint), se debe añadir un `!` después del tipo o incluir la frase `BREAKING CHANGE`.
* **Impacto:** **MAJOR** (Mayor) `1.1.0` → `2.0.0`
* **Ejemplos:** - `feat!: cambiar motor de base de datos a PostgreSQL` o `refactor!: rediseñar arquitectura de controladores`
    - `fix!: eliminar soporte para versiones antiguas de Node.js` o `perf!: optimizar consultas eliminando campos obsoletos`
    - `refactor!: migrar a TypeScript` o `docs!: reescribir documentación para nueva estructura de API`

### Tareas de Mantenimiento (Sin salto de versión)
Los siguientes tipos se usan para tareas que **NO** afectan al código de producción de la API. **El bot detectará estos tipos y detendrá la subida de versión automáticamente.**

| Tipo | Significado | Descripción | Impacto |
| :--- | :--- | :--- | :--- |
| **`docs`** | Documents/Documentation/Documentación | Cambios en la documentación (`README.md`, comentarios). | Ninguno (`none`) |
| **`chore`** | Chore/Tarea | Actualización de dependencias, configuración de herramientas, cambios en flujos CI/CD (`.yml`). | Ninguno (`none`) |
| **`style`** | Style/Estilo | Formateo de código, puntos y comas, comillas (sin cambio lógico). | Ninguno (`none`) |
| **`refactor`**| Refactor/Refactorización | Reescritura de código que no añade features ni arregla bugs. | Ninguno (`none`) |
| **`test`** | Test/Pruebas | Añadir o modificar pruebas unitarias/integración. | Ninguno (`none`) |
| **`ci`** | Continuous Integration/Integración Continua | Cambios en archivos de configuración de integración continua. | Ninguno (`none`) |

---

## Reglas de Oro

1. **Usa minúsculas para el tipo:** `feat:`, no `Feat:`.
2. **Usa el imperativo en la descripción:** Como si estuvieras dando una orden. Di `añadir ruta de login` en lugar de `añadida ruta de login` o `añadiendo ruta de login`.
3. **Sin punto final:** No pongas un punto `.` al final de la descripción corta.
4. **El Título de la PR manda:** Aunque tengas 10 commits desordenados en tu rama, el flujo automático leerá el **Título de la Pull Request** al momento de hacer Merge a `main`. ¡Asegúrate de que el título de la PR cumpla esta convención!
5. **Usa paréntesis para especificar el alcance:** Usa el formato `tipo(alcance)` para indicar qué parte de la API afecta tu cambio, p. ej.:
    - `feat(auth): ...` (login y JWT)
    - `feat(db): ...` (conexiones a base de datos)
    - `fix(router): ...` (rutas de Express)
    - `perf(queries): ...` (optimización de consultas SQL)
    - `refactor(controllers): ...` (código de controladores)
    - `docs(readme): ...` (documentación del README)
    - `chore(deps): ...` (actualización de dependencias)

---

## Ejemplos Prácticos

### Correctos:
* ✅ `feat(users): implementar subida de avatares` -> *Sube Minor*
* ✅ `fix(db): resolver conexión caída tras timeout` -> *Sube Patch*
* ✅ `fix: corregir error de validación en endpoint de login` -> *Sube Patch*
* ✅ `chore: actualizar eslint a versión 10` -> *Ignora versión*
* ✅ `feat!: migrar sistema de contraseñas a argon2` -> *Sube Major*
* ✅ `refactor: limpiar código duplicado en controladores` -> *Ignora versión*
* ✅ `docs: añadir sección de contribución al README` -> *Ignora versión*
* ✅ `test: agregar pruebas para endpoint de usuarios` -> *Ignora versión*
* ✅ `ci: configurar workflow de tests en GitHub Actions` -> *Ignora versión*
* ✅ `perf: optimizar consulta de usuarios con índices` -> *Sube Patch*

### Incorrectos (El bot aplicará Patch por defecto para evitar fallos):
* ❌ `Actualizando dependencias` (Falta el tipo `chore:`)
* ❌ `fix: Se arregló el error del login.` (Uso de pasado, mayúscula en la descripción y punto final)
* ❌ `FEAT: nueva ruta` (El tipo está en mayúsculas)