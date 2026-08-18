# Feature Spec: 001-github-trending-cli

## Descripción
Permitir a los usuarios consultar los repositorios en tendencia de GitHub directamente desde la terminal especificando un rango de tiempo y un límite de resultados.

## Argumentos de Entrada
- `--duration`: Filtro de tiempo (`day`, `week`, `month`, `year`). Valor por defecto: `week`.
- `--limit`: Número máximo de repositorios a mostrar. Valor por defecto: `10`.

## Criterios de Aceptación Medibles
1. Al ejecutar `trending-repos`, el sistema utiliza por defecto `--duration week` y `--limit 10`.
2. Al ejecutar `trending-repos --duration month --limit 20`, se realiza la consulta a GitHub filtrando los repositorios creados/activos del último mes y muestra máximo 20 resultados.
3. Los repositorios devueltos se muestran ordenados de forma descendente por número de estrellas.
4. Para cada repositorio se imprime: Nombre completo, Descripción, Número de estrellas y Lenguaje.
5. Si se proporciona una opción no válida en `--duration` (ej: `--duration hour`), la CLI debe detenerse y mostrar un mensaje de error claro en `app.js`.
6. Si ocurre un error de red o de límite de peticiones de la API de GitHub, se debe mostrar un error formateado y comprensible en la terminal.
