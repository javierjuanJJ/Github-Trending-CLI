export function formatRepositoriesOutput(repositories) {
  if (repositories.length === 0) {
    return 'No se encontraron repositorios en tendencia para los criterios indicados.';
  }

  const lines = repositories.map((repository, index) => {
    const position = index + 1;
    const name = repository.full_name ?? 'Desconocido';
    const description = repository.description ?? 'Sin descripción';
    const stars = repository.stargazers_count ?? 0;
    const language = repository.language ?? 'Desconocido';

    return `#${position} ${name}\n   Estrellas: ${stars} | Lenguaje: ${language}\n   ${description}`;
  });

  return `Tendencias de GitHub (${repositories.length} repositorios):\n\n${lines.join('\n\n')}`;
}