import { fetchTrendingRepositories, sortRepositoriesByStars } from './githubApi.js';
import { formatRepositoriesOutput } from './formatter.js';

export async function getTrendingRepositoriesOutput(duration, limit) {
  const repositories = await fetchTrendingRepositories(duration, limit);
  const sorted = sortRepositoriesByStars(repositories);
  return formatRepositoriesOutput(sorted);
}