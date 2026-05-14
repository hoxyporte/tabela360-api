import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Req() req) {
    return this.leadsService.findByUser(req.user.id);
  }
}