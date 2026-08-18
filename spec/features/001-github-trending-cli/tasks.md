# Lista de Tareas: 001-github-trending-cli

- [ ] **Fase 1: Configuración Estructural**
  - [ ] Crear estructura de carpetas (`src/consts`, `src/lib`).
  - [ ] Definir `package.json` con soporte para ES Modules y script ejecutable CLI.

- [ ] **Fase 2: Módulos Secundarios**
  - [ ] Implementar `src/consts/options.js` con las constantes.
  - [ ] Crear `src/lib/argsParser.js` para parsear y validar `--duration` y `--limit`.
  - [ ] Crear `src/lib/githubApi.js` para la fecha, llamada a la REST API de GitHub y ordenación por estrellas.
  - [ ] Crear `src/lib/formatter.js` para dar formato de salida en consola.

- [ ] **Fase 3: Orquestación y Manejo de Errores**
  - [ ] Implementar `app.js` invocando las funciones hijas.
  - [ ] Envolver todo el flujo de `app.js` en `try/catch` para capturar y mostrar errores con claridad.

- [ ] **Fase 4: Validación y Empaquetado**
  - [ ] Probar casos de éxito (`--duration day`, `--limit 5`).
  - [ ] Probar casos de error (argumentos no válidos, corte de conexión).
