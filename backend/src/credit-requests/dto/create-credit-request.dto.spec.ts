import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateCreditRequestDto } from './create-credit-request.dto.js';

const check = (o: object) => validate(plainToInstance(CreateCreditRequestDto, o));
const valid = { cedula: '8-123-456', amount: 1000, termMonths: 12 };

describe('CreateCreditRequestDto', () => {
  it('acepta datos válidos y los límites exactos', async () => {
    expect(await check(valid)).toHaveLength(0);
    expect(await check({ ...valid, amount: 500, termMonths: 6 })).toHaveLength(0);
    expect(await check({ ...valid, amount: 50000, termMonths: 60 })).toHaveLength(0);
  });

  it.each([
    ['monto menor a 500', { amount: 499.99 }],
    ['monto mayor a 50000', { amount: 50000.01 }],
    ['plazo menor a 6', { termMonths: 5 }],
    ['plazo mayor a 60', { termMonths: 61 }],
    ['plazo no entero', { termMonths: 12.5 }],
    ['cédula vacía', { cedula: '' }],
  ])('rechaza %s', async (_name, override) => {
    expect((await check({ ...valid, ...override })).length).toBeGreaterThan(0);
  });
});
