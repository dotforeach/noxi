import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreditRequestsService } from './credit-requests.service.js';
import { CreateCreditRequestDto } from './dto/create-credit-request.dto.js';
import { ListCreditRequestsDto } from './dto/list-credit-requests.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@ApiTags('credit-requests')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Token ausente, inválido o expirado' })
@Controller('credit-requests')
@UseGuards(JwtAuthGuard)
export class CreditRequestsController {
  constructor(@Inject(CreditRequestsService) private readonly service: CreditRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una solicitud (queda en PENDING)' })
  @ApiResponse({ status: 201, description: 'Solicitud creada' })
  @ApiResponse({ status: 400, description: 'Monto, plazo o cédula inválidos' })
  create(@Body() dto: CreateCreditRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar solicitudes, opcionalmente filtradas por estado' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  list(@Query() query: ListCreditRequestsDto) {
    return this.service.list(query.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud' })
  @ApiResponse({ status: 404, description: 'No existe' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Aprobar o rechazar una solicitud pendiente, con comentario' })
  @ApiResponse({ status: 400, description: 'Estado o comentario inválidos' })
  @ApiResponse({ status: 404, description: 'No existe' })
  @ApiResponse({ status: 409, description: 'La solicitud ya fue resuelta' })
  changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStatusDto) {
    return this.service.changeStatus(id, dto);
  }
}
