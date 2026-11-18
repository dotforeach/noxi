import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { CreditRequest } from './credit-request.entity.js';
import { CreditRequestsService } from './credit-requests.service.js';

function setup(existing?: Partial<CreditRequest>) {
  const repo = {
    findOneBy: vi.fn().mockResolvedValue(existing ?? null),
    save: vi.fn(async (x) => x),
    create: vi.fn((x) => x),
    find: vi.fn().mockResolvedValue([]),
  };
  return { repo, service: new CreditRequestsService(repo as never) };
}

describe('CreditRequestsService', () => {
  it('crea la solicitud en estado PENDING', async () => {
    const { service } = setup();
    const result = await service.create({ cedula: '8-123-456', amount: 1000, termMonths: 12 });
    expect(result.status).toBe('PENDING');
  });

  it('aprueba una solicitud pendiente guardando el comentario', async () => {
    const { service } = setup({ id: 'a', status: 'PENDING' });
    const result = await service.changeStatus('a', { status: 'APPROVED', comment: 'ok' });
    expect(result).toMatchObject({ status: 'APPROVED', statusComment: 'ok' });
  });

  it('rechaza (409) cambiar el estado de una solicitud ya resuelta', async () => {
    const { service, repo } = setup({ id: 'a', status: 'APPROVED' });
    await expect(service.changeStatus('a', { status: 'REJECTED', comment: 'x' })).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('lanza 404 si la solicitud no existe', async () => {
    const { service } = setup();
    await expect(service.findOne('nope')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('filtra por estado al listar', async () => {
    const { service, repo } = setup();
    await service.list('REJECTED');
    expect(repo.find).toHaveBeenCalledWith(expect.objectContaining({ where: { status: 'REJECTED' } }));
  });
});
