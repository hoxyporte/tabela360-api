import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateLeadDto) {
    const district = await this.prisma.district.findFirst({
      where: { id: dto.districtId, cityId: dto.cityId },
    });
    if (!district) throw new NotFoundException('Geçersiz şehir/ilçe');

    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    const lead = await this.prisma.lead.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        cityId: dto.cityId,
        districtId: dto.districtId,
        budget: dto.budget,
        description: dto.description,
      },
    });

    return { message: 'Talebiniz başarıyla oluşturuldu.', leadId: lead.id };
  }

  async findByUser(userId: string) {
    return this.prisma.lead.findMany({
      where: { userId },
      include: { district: true, category: true, offers: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}