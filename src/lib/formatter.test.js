import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatRepositoriesOutput } from './formatter.js';

const repository = (overrides = {}) => ({
  full_name: 'octocat/hello-world',
  description: 'Un repositorio de ejemplo.',
  stargazers_count: 1234,
  language: 'JavaScript',
  ...overrides,
});

describe('formatRepositoriesOutput', () => {
  it('devuelve un mensaje informativo cuando no hay repositorios', () => {
    assert.equal(formatRepositoriesOutput([]), 'No se encontraron repositorios en tendencia para los criterios indicados.');
  });

  it('incluye nombre, descripcion, estrellas y lenguaje de cada repositorio', () => {
    const output = formatRepositoriesOutput([repository()]);
    assert.match(output, /octocat\/hello-world/);
    assert.match(output, /Un repositorio de ejemplo\./);
    assert.match(output, /Estrellas: 1234/);
    assert.match(output, /Lenguaje: JavaScript/);
  });

  it('muestra los repositorios numerados en orden', () => {
    const output = formatRepositoriesOutput([
      repository({ stargazers_count: 1 }),
      repository({ stargazers_count: 2 }),
    ]);
    assert.ok(output.indexOf('#1') < output.indexOf('#2'));
  });

  it('protege frente a campos ausentes', () => {
    const output = formatRepositoriesOutput([
      repository({
        full_name: undefined,
        description: undefined,
        stargazers_count: undefined,
        language: undefined,
      }),
    ]);
    assert.match(output, /Desconocido/);
    assert.match(output, /Sin descripción/);
    assert.match(output, /Estrellas: 0/);
  });
});