import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async findAllWithDistricts() {
    return this.prisma.city.findMany({ include: { districts: true } });
  }

  async findOne(slug: string) {
    return this.prisma.city.findUnique({ where: { slug }, include: { districts: true } });
  }
}