import { GITHUB_API_URL, SORT_BY_STARS, SORT_ORDER } from '../consts/options.js';

const DAYS_PER_DURATION = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
};

export function calculateStartDate(duration) {
  const daysAgo = DAYS_PER_DURATION[duration];
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export async function fetchTrendingRepositories(duration, limit, fetcher = fetch) {
  const startDate = calculateStartDate(duration);
  const url = new URL(GITHUB_API_URL);
  url.searchParams.set('q', `created:>${startDate}`);
  url.searchParams.set('sort', SORT_BY_STARS);
  url.searchParams.set('order', SORT_ORDER);
  url.searchParams.set('per_page', String(limit));

  const response = await fetcher(url.toString(), {
    headers: { Accept: 'application/vnd.github+json' },
  });

  if (!response.ok) {
    throw buildHttpError(response.status);
  }

  const body = await response.json();
  return body.items;
}

export function sortRepositoriesByStars(repositories) {
  return [...repositories].sort((a, b) => b.stargazers_count - a.stargazers_count);
}

function buildHttpError(status) {
  const error = new Error(`La API de GitHub respondió con el estado HTTP ${status}.`);
  error.statusCode = status;

  if (status === 403) {
    error.message =
      'La API de GitHub ha alcanzado el límite de peticiones (rate limit). Inténtalo de nuevo más tarde.';
  } else if (status === 404) {
    error.message = 'La API de GitHub no encontró el endpoint de búsqueda solicitado.';
  }

  return error;
}