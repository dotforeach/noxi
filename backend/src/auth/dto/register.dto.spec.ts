import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { RegisterDto } from './register.dto.js';

const check = (password: string) => validate(plainToInstance(RegisterDto, { email: 'a@b.com', password }));

describe('RegisterDto', () => {
  it('acepta contraseñas de 8 a 128 caracteres con letras, números y símbolos', async () => {
    expect(await check('abcdefgh')).toHaveLength(0);
    expect(await check('P@ssw0rd!#ñ$%&/()=?¿*-_.,;:')).toHaveLength(0);
    expect(await check('a1!'.repeat(42) + 'ab')).toHaveLength(0); // 128
  });

  it.each([
    ['menos de 8 caracteres', 'abc123!'],
    ['más de 128 caracteres', 'a'.repeat(129)],
  ])('rechaza contraseñas con %s', async (_n, pwd) => {
    expect((await check(pwd)).length).toBeGreaterThan(0);
  });

  it('normaliza el correo a minúsculas y sin espacios', () => {
    const dto = plainToInstance(RegisterDto, { email: '  Ana@Example.COM ', password: 'x'.repeat(8) });
    expect(dto.email).toBe('ana@example.com');
  });
});
