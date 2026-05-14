import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(businessId: string) {
    const credit = await this.prisma.credit.findUnique({ where: { businessId } });
    return { balance: credit ? credit.balance : 0 };
  }

  async addCredits(businessId: string, amount: number) {
    const credit = await this.prisma.credit.upsert({
      where: { businessId },
      update: { balance: { increment: amount } },
      create: { businessId, balance: amount },
    });
    return { balance: credit.balance };
  }

  async deductCredit(businessId: string) {
    const credit = await this.prisma.credit.findUnique({ where: { businessId } });
    if (!credit || credit.balance < 1) throw new NotFoundException('Yetersiz kredi');
    const updated = await this.prisma.credit.update({
      where: { businessId },
      data: { balance: { decrement: 1 } },
    });
    return { balance: updated.balance };
  }
}