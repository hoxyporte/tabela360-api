import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { BusinessesModule } from './businesses/businesses.module';
import { CategoriesModule } from './categories/categories.module';
import { CitiesModule } from './cities/cities.module';
import { OffersModule } from './offers/offers.module';
import { MatchingModule } from './matching/matching.module';
import { CreditsModule } from './credits/credits.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LeadsModule,
    BusinessesModule,
    CategoriesModule,
    CitiesModule,
    OffersModule,
    MatchingModule,
    CreditsModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class AppModule {}