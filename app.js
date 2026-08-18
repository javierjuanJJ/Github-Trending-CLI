#!/usr/bin/env node
import { parseArguments, validateOptions } from './src/lib/argsParser.js';
import { fetchTrendingRepositories, sortRepositoriesByStars } from './src/lib/githubApi.js';
import { formatRepositoriesOutput } from './src/lib/formatter.js';

function formatErrorMessage(error) {
  if (error.name === 'TypeError' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return 'Fallo de red: no se pudo conectar con la API de GitHub. Comprueba tu conexión e inténtalo de nuevo.';
  }

  if (error.statusCode) {
    return `La API de GitHub falló: ${error.message}`;
  }

  return error.message;
}

function handleFatalError(error) {
  console.error('\nError:');
  console.error(formatErrorMessage(error));
  process.exit(1);
}

function main() {
  let options;
  try {
    const rawArgs = process.argv.slice(2);
    const parsed = parseArguments(rawArgs);
    options = validateOptions(parsed);
  } catch (error) {
    handleFatalError(error);
  }

  fetchTrendingRepositories(options.duration, options.limit)
    .then((repositories) => {
      const sorted = sortRepositoriesByStars(repositories);
      const output = formatRepositoriesOutput(sorted);
      console.log(output);
    })
    .catch(handleFatalError);
}

main();