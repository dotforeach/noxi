import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { CREDIT_REQUEST_STATUSES, type CreditRequestStatus } from '../credit-request-status.js';

export class UpdateStatusDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'], description: 'Solo se puede resolver desde PENDING' })
  @IsIn(CREDIT_REQUEST_STATUSES)
  status: CreditRequestStatus;

  @ApiProperty({ example: 'Documentos verificados' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
