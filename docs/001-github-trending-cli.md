# Feature 001: `github-trending-cli` — Documentación Técnica

Esta documentación explica **cómo** se implementó la feature, **qué decisiones** de diseño se tomaron y **cómo volver atrás** si necesitas deshacerla.

---

## 1. Resumen

La feature convierte el proyecto en una CLI de Node.js que consulta la API REST de búsqueda de GitHub
(`GET https://api.github.com/search/repositories`) para mostrar repositorios en tendencia filtrados por
`--duration` (`day` | `week` | `month` | `year`) y limitados por `--limit` (entero > 0).
El comando ejecutable es `trending-repos` (definido en `package.json` → `bin`).

Referencias de spec:
- `spec/features/001-github-trending-cli/spec.md` (criterios de aceptación).
- `spec/features/001-github-trending-cli/plan.md` (arquitectura).
- `spec/features/001-github-trending-cli/tasks.md` (tareas).

---

## 2. Estructura de archivos creada

```
Github-Trending-CLI/
├── app.js                        # Orquestador principal (único try/catch del proyecto)
├── package.json                  # ES Modules, bin, scripts (dev/test/lint)
├── .gitignore
├── src/
│   ├── consts/
│   │   └── options.js            # Constantes: duraciones, límites, URL base de la API
│   └── lib/
│       ├── argsParser.js         # parseArguments + validateOptions
│       ├── argsParser.test.js
│       ├── githubApi.js          # calculateStartDate + fetchTrendingRepositories + sortRepositoriesByStars
│       ├── githubApi.test.js
│       ├── formatter.js          # formatRepositoriesOutput
│       └── formatter.test.js
├── spec/
│   ├── constitution/             # mission.md, tech-stack.md, roadmap.md
│   └── features/001-github-trending-cli/   # spec.md, plan.md, tasks.md
└── docs/
    ├── README.md                 # Índice de documentación
    └── 001-github-trending-cli.md # Este documento
```

---

## 3. Decisiones de diseño (cómo se hizo)

### 3.1 Orquestación y flujo de `app.js`

`app.js` es el punto de entrada ejecutable (`#!/usr/bin/env node`). Orquesta el flujo en 5 pasos:

1. `parseArguments(process.argv.slice(2))` — convierte los argumentos crudos en opciones.
2. `validateOptions(opciones)` — valida `duration` y `limit`; lanza `Error` descriptivo si son inválidos.
3. `fetchTrendingRepositories(duration, limit)` — petición HTTP a la API de GitHub (async, en `src/lib`).
4. `sortRepositoriesByStars(repos)` — ordena descendentemente por `stargazers_count`.
5. `formatRepositoriesOutput(repos)` — genera la salida de texto final para la terminal.

### 3.2 Restricción: sin funciones `async` en `app.js`

`app.js` **no declara ninguna función `async`** ni usa `await`. La orquestación síncrona
(steps 1 y 2) vive dentro de un `try/catch`; la parte asíncrona (step 3 y siguientes) se encadena
con promesas:

```js
fetchTrendingRepositories(options.duration, options.limit)
  .then((repositories) => { /* sort + format + print */ })
  .catch(handleFatalError);
```

Esto mantiene el requisito de que `app.js` sea el **único gestor de errores** (ver 3.3):
los errores asíncronos caen en `.catch(handleFatalError)` y los síncronos en el `catch` del `try/catch`.
**No** se usa ningún método `run()` para arrancar la aplicación: el flujo comienza llamando directamente a `main()`.

### 3.3 Restricción: solo `app.js` captura errores

- `src/lib/*` **no usa `try/catch`** en ningún punto. Cuando algo falla, lanza un `Error` con mensaje descriptivo que **propaga hacia `app.js`**:
  - `argsParser.js` → errores de argumentos (`Duración no válida...`, `Límite no válido...`, `Argumento desconocido...`).
  - `githubApi.js` → errores HTTP con propiedad extra `error.statusCode` (403 = rate limit, 404 = no encontrado, otros = estado HTTP genérico).
  - `formatter.js` → no lanza errores en el caso normal (protege frente a campos ausentes).
- Los fallos de red de `fetch` (tipo `TypeError`, códigos `ENOTFOUND`/`ECONNREFUSED`) también suben crudos hasta `app.js`.
- `app.js` formatea todos los tipos de error en `handleFatalError()` y termina con `process.exit(1)`.

### 3.4 `src/lib/githubApi.js`

- `calculateStartDate(duration)` usa un mapa `DAYS_PER_DURATION` (`day:1, week:7, month:30, year:365`)
  y devuelve `YYYY-MM-DD` vía `toISOString().slice(0, 10)`.
- `fetchTrendingRepositories(duration, limit, fetcher = fetch)`:
  - Construye la URL con `URL` + `searchParams` (`q=created:>FECHA`, `sort=stars`, `order=desc`, `per_page=limit`).
  - Acepta un `fetcher` inyectable (por defecto el `fetch` global) para poder testear sin red.
  - Si `!response.ok` lanza un error con `statusCode`; si `ok`, devuelve `body.items`.
- `sortRepositoriesByStars(repositories)` devuelve una **copia ordenada** (no muta el array original).

### 3.5 Tests

Se usa el runner nativo de Node (`node --test`) y `node:assert/strict`, evitando dependencias externas
(alineado con "sin dependencias pesadas"). Los tests se colocan junto a las librerías:
`src/lib/*.test.js`. Total: **19 tests** en 6 suites.

---

## 4. Cómo ejecutar y probar

```bash
npm run dev            # node app.js  (usa --duration week --limit 10 por defecto)
npm test               # ejecuta node --test "src/lib/*.test.js"
npm run lint           # node --check de app.js y de todos los módulos de src

# Uso directo:
node app.js --duration day --limit 5
node app.js --duration month --limit 20
```

> En un entorno sin red, `node app.js` mostrará `Fallo de red: no se pudo conectar con la API de GitHub...`
> y terminará con `exit=1`. Ese comportamiento es el esperado y comprobable.

Instalación global como comando (opcional):

```bash
npm link               # expone el comando `trending-repos` a nivel de sistema
trending-repos --duration week --limit 10
```

---

## 5. Cómo volver atrás (rollback)

Todos los commits de esta feature están en la rama `main`. El historial es lineal y reversible.

### 5.1 Ver los commits de esta feature

```bash
git log --oneline --decorate
```

### 5.2 Volver al estado anterior a la feature (descartando cambios)

```bash
# 1) Anota el hash del último commit de la feature anterior (o el commit previo al primero de esta feature)
git log --oneline

# 2) Reinicia el working tree a ese commit
git reset --hard <hash-previo-a-la-feature>
```

### 5.3 Revertir sin borrar historial (recomendado si quieres conservar el historial)

```bash
# Revierte los cambios de un commit concreto en un commit nuevo
git revert <hash-del-commit-de-la-feature>

# Si la feature abarca varios commits, reviértelos en orden inverso
git revert <hash-último> <hash-anterior> ...
```

### 5.4 Deshacer un commit aún no publicado (manteniendo los cambios en disco)

```bash
git reset --soft HEAD~1    # quita el commit y deja los cambios preparados (staged)
git reset HEAD~1           # quita el commit y deja los cambios sin preparar (uncommitted)
```

> **Nota:** `.gitignore` excluye `node_modules/` y `*.zip`, por lo que el paquete ZIP de la entrega
> no se versiona y no interfiere con el historial.
