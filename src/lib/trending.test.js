import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getTrendingRepositoriesOutput } from './trending.js';
import { fetchTrendingRepositories, sortRepositoriesByStars } from './githubApi.js';
import { formatRepositoriesOutput } from './formatter.js';

describe('getTrendingRepositoriesOutput', () => {
  it('encadena fetch, sort y format para producir la salida final', async () => {
    const repositories = [{ stargazers_count: 10 }, { stargazers_count: 500 }];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ items: repositories }),
    });

    try {
      const output = await getTrendingRepositoriesOutput('week', 2);

      const sorted = sortRepositoriesByStars(repositories);
      assert.equal(output, formatRepositoriesOutput(sorted));
      assert.match(output, /Tendencias de GitHub/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('delega el error del fetch sin capturarlo', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: false, status: 403 });

    try {
      await assert.rejects(
        () => getTrendingRepositoriesOutput('week', 10),
        (error) => error.statusCode === 403,
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});