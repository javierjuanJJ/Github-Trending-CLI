import { DEFAULT_DURATION, DEFAULT_LIMIT, VALID_DURATIONS } from '../consts/options.js';

export function parseArguments(rawArgs) {
  const parsed = {
    duration: DEFAULT_DURATION,
    limit: DEFAULT_LIMIT,
  };

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];

    if (arg === '--duration') {
      parsed.duration = rawArgs[i + 1];
      i += 1;
    } else if (arg === '--limit') {
      parsed.limit = rawArgs[i + 1];
      i += 1;
    } else {
      throw new Error(`Argumento desconocido: "${arg}". Utiliza --duration y --limit.`);
    }
  }

  return parsed;
}

export function validateOptions(parsedOptions) {
  const { duration, limit } = parsedOptions;

  if (!VALID_DURATIONS.includes(duration)) {
    throw new Error(
      `Duración no válida: "${duration}". Valores permitidos: ${VALID_DURATIONS.join(', ')}.`,
    );
  }

  const numericLimit = Number(limit);
  if (!Number.isInteger(numericLimit) || numericLimit <= 0) {
    throw new Error(`Límite no válido: "${limit}". Debe ser un número entero mayor que 0.`);
  }

  return { duration, limit: numericLimit };
}