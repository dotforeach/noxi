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
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @MaxLength(CEDULA_MAX_LENGTH)
  @Matches(CEDULA_PATTERN, { message: 'cedula debe tener formato panameño, por ejemplo 8-123-456 o PE-1-234' })
  cedula: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(AMOUNT_MIN)
  @Max(AMOUNT_MAX)
  amount: number;

  @IsInt()
  @Min(TERM_MIN_MONTHS)
  @Max(TERM_MAX_MONTHS)
  termMonths: number;
}
