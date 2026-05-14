import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateOfferDto) {
    return this.offersService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findByBusiness(@Req() req) {
    return this.offersService.findByBusiness(req.user.id);
  }
}