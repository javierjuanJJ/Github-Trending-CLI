# Referencia Técnica y Convenciones (Tech Stack)

## Tecnologías
- **Lenguaje:** JavaScript (Node.js ES Modules / Node 18+)
- **Runtime:** Node.js
- **Base de datos:** No aplica.
- **API Externa:** GitHub REST API (`[https://api.github.com/search/repositories](https://api.github.com/search/repositories)`)
- **Tests:** Vitest (o ejecutor nativo de tests de Node.js)
- **Despliegue:** Paquete ejecutable vía `npm link` o publicación en registro npm.

## Archivos / Módulos Clave
- `app.js` — Punto de entrada ejecutable. Orquestador central, ejecución de CLI y único gestor de `try/catch`.
- `src/consts/options.js` — Mapeo de duraciones, valores por defecto e URLs base de la API.
- `src/lib/argsParser.js` — Parsea y valida los argumentos recibidos (`--duration`, `--limit`).
- `src/lib/githubApi.js` — Construye las peticiones HTTP a la API de GitHub y procesa la respuesta.
- `src/lib/formatter.js` — Recibe los datos limpios y les da formato visual amigable para la terminal.

## Comandos
- `npm run dev` — Ejecuta el entorno de desarrollo local (`node app.js`).
- `npm test` — Ejecuta la suite de pruebas.
- `npm run lint` — Revisa el estilo e invariantes del código.

## Modelo de Datos / Dominio
- **Duración (`duration`):** `day` | `week` | `month` | `year`. Filtra repositorios creados/populares desde la fecha calculada.
- **Límite (`limit`):** Número entero positivo (predeterminado: 10). Controla la cantidad de repositorios mostrados.
- **Repositorio:**
  - `name`: Nombre del repositorio (`full_name`).
  - `description`: Descripción breve.
  - `stargazers_count`: Número de estrellas (utilizado para ordenar descendentemente).
  - `language`: Lenguaje principal.

## Convenciones de Código
- Nombres en `camelCase` para variables y funciones.
- Funciones modulares, pequeñas y con responsabilidad única.
- Tests colocados junto a las librerías: `src/lib/argsParser.test.js`.
- Ninguna librería interna captura errores en `try/catch`; lanzan errores descriptivos hacia `app.js`.

## Estilo Visual en CLI
- Salida limpia estructurada por listas o tablas mediante caracteres ASCII/ANSI básicos.

## Límites Duros (Reglas Inviolables)
- **NUNCA** usar `try/catch` dentro de `src/lib/*`. Toda excepción debe subir a `app.js`.
- **NUNCA** realizar peticiones a otros endpoints fuera de la API pública de GitHub.
- **NUNCA** requerir claves de autenticación obligatorias para repositorios públicos.
