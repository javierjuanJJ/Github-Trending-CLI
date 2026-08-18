# Documentación del Proyecto: GitHub Trending CLI

Documentación técnica de cada feature implementada bajo el flujo **Loop Engineering / Spec Driven Development**.

## Índice de Features

| Feature | Documentación |
| ------- | ------------- |
| `001-github-trending-cli` | [Ver documentación](001-github-trending-cli.md) |

## Cómo volver atrás en general

Cada feature tiene su propio commit y una sección de *rollback* en su documento.
Como regla general, la referencia de retroceso es siempre el último commit de la feature anterior:

```bash
# Ver el historial de commits
git log --oneline --decorate

# Volver al estado exacto de la feature anterior
git reset --hard <hash-del-commit-anterior>

# O revertir solo los cambios de un commit (sin borrar el historial)
git revert <hash-del-commit>
```

> **Precaución:** `git reset --hard` descarta el trabajo sin confirmar. Úsalo solo si estás seguro.
