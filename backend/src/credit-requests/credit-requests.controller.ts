import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreditRequestsService } from './credit-requests.service.js';
import { CreateCreditRequestDto } from './dto/create-credit-request.dto.js';
import { ListCreditRequestsDto } from './dto/list-credit-requests.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Controller('credit-requests')
@UseGuards(JwtAuthGuard)
export class CreditRequestsController {
  constructor(@Inject(CreditRequestsService) private readonly service: CreditRequestsService) {}

  @Post()
  create(@Body() dto: CreateCreditRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  list(@Query() query: ListCreditRequestsDto) {
    return this.service.list(query.status);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/status')
  changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStatusDto) {
    return this.service.changeStatus(id, dto);
  }
}
