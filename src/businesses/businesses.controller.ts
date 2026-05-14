import { Controller, Get, Query, Param, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessesService } from './businesses.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get()
  findAll(
    @Query('cityId') cityId?: number,
    @Query('districtId') districtId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('premium') premium?: string,
    @Query('search') search?: string,
  ) {
    return this.businessesService.findAll({
      cityId: cityId ? Number(cityId) : undefined,
      districtId: districtId ? Number(districtId) : undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      premium: premium === 'true' ? true : undefined,
      search,
    });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.businessesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() dto: UpdateBusinessDto) {
    return this.businessesService.update(req.user.id, dto);
  }
}