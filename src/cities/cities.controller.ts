import { Controller, Get, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  findAll() {
    return this.citiesService.findAllWithDistricts();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.citiesService.findOne(slug);
  }
}