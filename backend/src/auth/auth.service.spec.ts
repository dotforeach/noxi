import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { hashPassword } from './password.js';

function setup(existing?: { id: string; email: string; passwordHash: string }) {
  const repo = {
    existsBy: vi.fn().mockResolvedValue(!!existing),
    findOneBy: vi.fn().mockResolvedValue(existing ?? null),
    create: vi.fn((x) => ({ id: 'u1', ...x })),
    save: vi.fn(async (x) => x),
  };
  const jwt = { signAsync: vi.fn().mockResolvedValue('token') };
  return { repo, service: new AuthService(repo as never, jwt as never) };
}

describe('AuthService', () => {
  it('registra un usuario guardando solo el hash de la contraseña y devuelve un token', async () => {
    const { service, repo } = setup();
    await expect(service.register('a@b.com', 'secreto-123')).resolves.toEqual({ accessToken: 'token' });
    const saved = repo.save.mock.calls[0][0];
    expect(saved.passwordHash).not.toContain('secreto-123');
  });

  it('rechaza (409) registrar un correo ya existente', async () => {
    const { service, repo } = setup({ id: 'u1', email: 'a@b.com', passwordHash: 'x' });
    await expect(service.register('a@b.com', 'secreto-123')).rejects.toBeInstanceOf(ConflictException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('inicia sesión con credenciales correctas', async () => {
    const passwordHash = await hashPassword('secreto-123');
    const { service } = setup({ id: 'u1', email: 'a@b.com', passwordHash });
    await expect(service.login('a@b.com', 'secreto-123')).resolves.toEqual({ accessToken: 'token' });
  });

  it('rechaza (401) contraseña incorrecta o usuario inexistente con el mismo mensaje', async () => {
    const passwordHash = await hashPassword('secreto-123');
    const wrong = setup({ id: 'u1', email: 'a@b.com', passwordHash });
    const missing = setup();
    const e1 = await wrong.service.login('a@b.com', 'otra').catch((e) => e);
    const e2 = await missing.service.login('x@b.com', 'otra').catch((e) => e);
    expect(e1).toBeInstanceOf(UnauthorizedException);
    expect(e1.message).toBe(e2.message);
  });
});
