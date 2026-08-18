import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStartDate,
  fetchTrendingRepositories,
  sortRepositoriesByStars,
} from './githubApi.js';

function createMockResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe('calculateStartDate', () => {
  it('devuelve una fecha en formato ISO YYYY-MM-DD', () => {
    assert.match(calculateStartDate('week'), /^\d{4}-\d{2}-\d{2}$/);
  });

  it('devuelve la fecha de hace 7 dias para "week"', () => {
    const expected = new Date();
    expected.setDate(expected.getDate() - 7);
    assert.equal(calculateStartDate('week'), expected.toISOString().slice(0, 10));
  });
});

describe('fetchTrendingRepositories', () => {
  it('construye la URL de busqueda correcta y devuelve los items', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    let capturedUrl = '';

    const fetcher = async (url) => {
      capturedUrl = url;
      return createMockResponse({ items });
    };

    const result = await fetchTrendingRepositories('week', 5, fetcher);

    assert.equal(result, items);
    assert.ok(capturedUrl.includes('q=created%3A%3E'));
    assert.ok(capturedUrl.includes('per_page=5'));
    assert.ok(capturedUrl.includes('sort=stars'));
  });

  it('lanza un error descriptivo cuando el estado HTTP no es 200', async () => {
    const fetcher = async () => createMockResponse({ message: 'rate limit' }, 403);

    await assert.rejects(
      () => fetchTrendingRepositories('week', 10, fetcher),
      (error) => error.statusCode === 403 && /límite de peticiones/i.test(error.message),
    );
  });
});

describe('sortRepositoriesByStars', () => {
  it('ordena de forma descendente por stargazers_count', () => {
    const sorted = sortRepositoriesByStars([
      { stargazers_count: 10 },
      { stargazers_count: 500 },
      { stargazers_count: 3 },
    ]);

    assert.deepEqual(
      sorted.map((repo) => repo.stargazers_count),
      [500, 10, 3],
    );
  });

  it('no muta el array original', () => {
    const original = [{ stargazers_count: 1 }, { stargazers_count: 2 }];
    sortRepositoriesByStars(original);
    assert.deepEqual(
      original.map((repo) => repo.stargazers_count),
      [1, 2],
    );
  });
});