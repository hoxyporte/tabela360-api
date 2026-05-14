import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const users = await this.prisma.user.count();
    const businesses = await this.prisma.business.count();
    const leads = await this.prisma.lead.count();
    const offers = await this.prisma.offer.count();
    return { users, businesses, leads, offers };
  }

  async getUsers() { return this.prisma.user.findMany(); }
  async getBusinesses() { return this.prisma.business.findMany(); }
  async getLeads() { return this.prisma.lead.findMany(); }

  async updateLeadStatus(leadId: string, status: string) {
    return this.prisma.lead.update({ where: { id: leadId }, data: { status: status as any } });
  }
}