# Architecture & Implementation Plan: 001-github-trending-cli

## Enfoque Técnico
Construir una CLI modular en Node.js respetando estrictamente el patrón donde `app.js` orquesta todas las llamadas a las librerías secundarias dentro de un bloque `try/catch` central.

## Desglose de Funciones por Módulo

### 1. `src/consts/options.js`
- Exporta constantes del sistema: `VALID_DURATIONS`, `DEFAULT_DURATION`, `DEFAULT_LIMIT`, `GITHUB_API_URL`.

### 2. `src/lib/argsParser.js`
- `parseArguments(rawArgs)`: Parsea el array de argumentos pasados por la consola.
- `validateOptions(parsedOptions)`: Valida que `duration` pertenezca a los valores permitidos y que `limit` sea un número entero > 0. Lanza `Error` si la entrada es inválida.

### 3. `src/lib/githubApi.js`
- `calculateStartDate(duration)`: Convierte el argumento (`day`, `week`, `month`, `year`) a una fecha ISO `YYYY-MM-DD`.
- `fetchTrendingRepositories(duration, limit)`: Construye la URL de búsqueda de GitHub con el query `created:>YYYY-MM-DD`, realiza el `fetch` y valida la respuesta HTTP. Convierte la respuesta a JSON o lanza un error descriptivo si el status HTTP no es 200.
- `sortRepositoriesByStars(repositories)`: Ordena de forma descendente el array por `stargazers_count`.

### 4. `src/lib/formatter.js`
- `formatRepositoriesOutput(repositories)`: Recibe la lista limpia de repositorios y construye la representación visual en texto formateado para la terminal.

### 5. `app.js` (Padre / Punto de entrada)
- Contiene la función principal `main()`.
- Llama secuencialmente a:
  1. `parseArguments()`
  2. `validateOptions()`
  3. `fetchTrendingRepositories()`
  4. `sortRepositoriesByStars()`
  5. `formatRepositoriesOutput()`
- Encapsula todo dentro de un `try/catch`. En el bloque `catch`, procesa el error y realiza `console.error()` con un diseño amigable de error y `process.exit(1)`.
