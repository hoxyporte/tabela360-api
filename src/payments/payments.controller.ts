import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { PurchaseCreditsDto } from './dto/purchase-credits.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  purchaseCredits(@Req() req, @Body() dto: PurchaseCreditsDto) {
    return this.paymentsService.createPayment(req.user.id, dto.packageId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@Req() req) {
    return this.paymentsService.getPaymentHistory(req.user.id);
  }
}