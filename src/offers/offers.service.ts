import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async create(businessUserId: string, dto: CreateOfferDto) {
    const business = await this.prisma.business.findUnique({ where: { userId: businessUserId } });
    if (!business) throw new ForbiddenException('Yalnızca işletme hesapları teklif verebilir');

    const lead = await this.prisma.lead.findUnique({ where: { id: dto.leadId } });
    if (!lead) throw new NotFoundException('Talep bulunamadı');
    if (lead.status === 'COMPLETED' || lead.status === 'CANCELLED') {
      throw new BadRequestException('Bu talep artık teklife kapalı');
    }

    const offer = await this.prisma.offer.create({
      data: {
        leadId: dto.leadId,
        businessId: business.id,
        price: dto.price,
        message: dto.message,
      },
    });

    await this.prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'OFFER_RECEIVED' },
    });

    return offer;
  }

  async findByBusiness(businessUserId: string) {
    const business = await this.prisma.business.findUnique({ where: { userId: businessUserId } });
    if (!business) throw new ForbiddenException('İşletme hesabı değil');
    return this.prisma.offer.findMany({
      where: { businessId: business.id },
      include: { lead: { include: { district: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}