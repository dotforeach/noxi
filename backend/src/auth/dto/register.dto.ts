import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @ApiProperty({ example: 'ana@example.com' })
  @IsEmail()
  email: string;

  // Se admiten letras, números y cualquier carácter especial; el hash (scrypt) no limita la longitud.
  @ApiProperty({ minLength: 8, maxLength: 128, description: 'Letras, números y símbolos' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
