import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseArguments, validateOptions } from './argsParser.js';

describe('parseArguments', () => {
  it('aplica los valores por defecto cuando no recibe argumentos', () => {
    assert.deepEqual(parseArguments([]), { duration: 'week', limit: 10 });
  });

  it('parsea --duration y --limit', () => {
    assert.deepEqual(parseArguments(['--duration', 'month', '--limit', '20']), {
      duration: 'month',
      limit: '20',
    });
  });

  it('permite solo --limit manteniendo duration por defecto', () => {
    assert.deepEqual(parseArguments(['--limit', '5']), { duration: 'week', limit: '5' });
  });

  it('lanza un error para argumentos desconocidos', () => {
    assert.throws(() => parseArguments(['--foo']), /Argumento desconocido/);
  });
});

describe('validateOptions', () => {
  it('acepta duraciones válidas y limite entero positivo', () => {
    assert.deepEqual(validateOptions({ duration: 'day', limit: '5' }), { duration: 'day', limit: 5 });
  });

  it('lanza un error para una duración inválida', () => {
    assert.throws(() => validateOptions({ duration: 'hour', limit: 10 }), /Duración no válida/);
  });

  it('lanza un error para un límite no numérico', () => {
    assert.throws(() => validateOptions({ duration: 'week', limit: 'abc' }), /Límite no válido/);
  });

  it('lanza un error para un límite igual a cero', () => {
    assert.throws(() => validateOptions({ duration: 'week', limit: 0 }), /Límite no válido/);
  });

  it('lanza un error para un límite negativo', () => {
    assert.throws(() => validateOptions({ duration: 'week', limit: -3 }), /Límite no válido/);
  });
});