import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

// Más estricto que el límite global: frena fuerza bruta y registros masivos.
@Throttle({ default: { limit: 10, ttl: 60_000 } })
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Crear una cuenta y obtener un JWT' })
  @ApiResponse({ status: 201, description: 'Cuenta creada; devuelve { accessToken }' })
  @ApiResponse({ status: 400, description: 'Correo o contraseña inválidos' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  @ApiResponse({ status: 429, description: 'Demasiadas solicitudes' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Iniciar sesión y obtener un JWT' })
  @ApiResponse({ status: 200, description: 'Devuelve { accessToken }' })
  @ApiResponse({ status: 400, description: 'Cuerpo inválido' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 429, description: 'Demasiadas solicitudes' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
