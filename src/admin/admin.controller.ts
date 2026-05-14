import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  getOverview() { return this.adminService.getOverview(); }

  @Get('users')
  getUsers() { return this.adminService.getUsers(); }

  @Get('businesses')
  getBusinesses() { return this.adminService.getBusinesses(); }

  @Get('leads')
  getLeads() { return this.adminService.getLeads(); }

  @Patch('leads/:id/status')
  updateLeadStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateLeadStatus(id, status);
  }
}