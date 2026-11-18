import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditRequest } from './credit-request.entity.js';
import { ALLOWED_TRANSITIONS, type CreditRequestStatus } from './credit-request-status.js';
import type { CreateCreditRequestDto } from './dto/create-credit-request.dto.js';
import type { UpdateStatusDto } from './dto/update-status.dto.js';

@Injectable()
export class CreditRequestsService {
  constructor(@InjectRepository(CreditRequest) private readonly repo: Repository<CreditRequest>) {}

  create(dto: CreateCreditRequestDto) {
    return this.repo.save(this.repo.create({ ...dto, status: 'PENDING' }));
  }

  list(status?: CreditRequestStatus) {
    return this.repo.find({ where: status ? { status } : {}, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const found = await this.repo.findOneBy({ id });
    if (!found) throw new NotFoundException(`Solicitud ${id} no encontrada`);
    return found;
  }

  async changeStatus(id: string, dto: UpdateStatusDto) {
    const request = await this.findOne(id);
    if (!ALLOWED_TRANSITIONS[request.status].includes(dto.status)) {
      throw new ConflictException(
        `No se puede cambiar una solicitud de ${request.status} a ${dto.status}`,
      );
    }
    request.status = dto.status;
    request.statusComment = dto.comment;
    return this.repo.save(request);
  }
}
