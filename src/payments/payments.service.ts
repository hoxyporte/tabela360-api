import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditsService } from '../credits/credits.service';

const CREDIT_PACKAGES = {
  1: { credits: 10, price: 100.00 },
  2: { credits: 50, price: 400.00 },
  3: { credits: 200, price: 1400.00 },
};

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private creditsService: CreditsService) {}

  async createPayment(businessId: string, packageId: number) {
    const pkg = CREDIT_PACKAGES[packageId];
    if (!pkg) throw new BadRequestException('Geçersiz paket');

    const payment = await this.prisma.payment.create({
      data: { businessId, amount: pkg.price, creditsAdded: pkg.credits },
    });

    // Simüle ödeme
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED', completedAt: new Date(), providerRef: 'sim_' + Date.now() },
    });
    await this.creditsService.addCredits(businessId, pkg.credits);

    return { success: true, creditsAdded: pkg.credits };
  }

  async getPaymentHistory(businessId: string) {
    return this.prisma.payment.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }
}