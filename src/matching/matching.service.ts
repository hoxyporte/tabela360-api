import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) {}

  async matchLead(leadId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: { category: true, district: true },
    });
    if (!lead) throw new Error('Lead bulunamadı');

    const businesses = await this.prisma.business.findMany({
      where: {
        districtId: lead.districtId,
        categoryLinks: { some: { categoryId: lead.categoryId } },
      },
      include: { offers: { where: { leadId: lead.id } } },
    });

    const scored = businesses.map((b) => ({
      businessId: b.id,
      score: this.calculateScore(b),
    }));
    scored.sort((a, b) => b.score - a.score);
    const top5 = scored.slice(0, 5);

    for (const match of top5) {
      await this.prisma.leadMatch.upsert({
        where: { leadId_businessId: { leadId: lead.id, businessId: match.businessId } },
        update: { score: match.score },
        create: { leadId: lead.id, businessId: match.businessId, score: match.score },
      });
    }

    await this.prisma.lead.update({
      where: { id: leadId },
      data: { status: 'MATCHED' },
    });

    return this.prisma.leadMatch.findMany({
      where: { leadId },
      include: { business: true },
      orderBy: { score: 'desc' },
    });
  }

  private calculateScore(business: any): number {
    let score = 0;
    if (business.verified) score += 30;
    if (business.premium) score += 40;
    score += business.ratingAvg * 10;
    score += business.responseRate * 0.3;
    if (business.offers?.length > 0) score += 20;
    return score;
  }
}