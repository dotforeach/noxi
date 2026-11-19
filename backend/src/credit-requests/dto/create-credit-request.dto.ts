import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNumber, IsString, Matches, MaxLength, Max, Min } from 'class-validator';
import {
  AMOUNT_MAX,
  AMOUNT_MIN,
  CEDULA_MAX_LENGTH,
  CEDULA_PATTERN,
  TERM_MAX_MONTHS,
  TERM_MIN_MONTHS,
} from '../credit-request-status.js';

export class CreateCreditRequestDto {
  @ApiProperty({ example: '8-123-456', description: 'Cédula panameña (8-123-456, PE-1-234, E-8-12345…)' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @MaxLength(CEDULA_MAX_LENGTH)
  @Matches(CEDULA_PATTERN, { message: 'cedula debe tener formato panameño, por ejemplo 8-123-456 o PE-1-234' })
  cedula: string;

  @ApiProperty({ example: 1500, minimum: AMOUNT_MIN, maximum: AMOUNT_MAX, description: 'USD, hasta 2 decimales' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(AMOUNT_MIN)
  @Max(AMOUNT_MAX)
  amount: number;

  @ApiProperty({ example: 12, minimum: TERM_MIN_MONTHS, maximum: TERM_MAX_MONTHS, description: 'Plazo en meses' })
  @IsInt()
  @Min(TERM_MIN_MONTHS)
  @Max(TERM_MAX_MONTHS)
  termMonths: number;
}
