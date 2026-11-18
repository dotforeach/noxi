import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { CreditRequestsController } from './credit-requests.controller.js';
import { CreditRequest } from './credit-request.entity.js';
import { CreditRequestsService } from './credit-requests.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([CreditRequest]), AuthModule],
  controllers: [CreditRequestsController],
  providers: [CreditRequestsService],
})
export class CreditRequestsModule {}
