import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

export interface BusinessListFilters {
  cityId?: number;
  districtId?: number;
  categoryId?: number;
  search?: string;
  premium?: boolean;
}

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: BusinessListFilters) {
    const where: any = {};
    if (filters.districtId) where.districtId = filters.districtId;
    if (filters.cityId && !filters.districtId) {
      where.district = { cityId: filters.cityId };
    }
    if (filters.categoryId) {
      where.categoryLinks = { some: { categoryId: filters.categoryId } };
    }
    if (filters.premium) where.premium = true;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.business.findMany({
      where,
      include: {
        district: { include: { city: true } },
        categoryLinks: { include: { category: true } },
      },
      orderBy: { ratingAvg: 'desc' },
      take: 50,
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.business.findUnique({
      where: { slug },
      include: {
        district: { include: { city: true } },
        categoryLinks: { include: { category: true } },
      },
    });
  }

  async update(userId: string, dto: UpdateBusinessDto) {
    const business = await this.prisma.business.findUnique({ where: { userId } });
    if (!business) throw new NotFoundException('İşletme bulunamadı');

    if (dto.categoryIds) {
      await this.prisma.businessCategory.deleteMany({ where: { businessId: business.id } });
      await this.prisma.businessCategory.createMany({
        data: dto.categoryIds.map((catId) => ({
          businessId: business.id,
          categoryId: catId,
        })),
      });
    }

    return this.prisma.business.update({
      where: { id: business.id },
      data: {
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        logo: dto.logo,
        districtId: dto.districtId,
      },
    });
  }
}