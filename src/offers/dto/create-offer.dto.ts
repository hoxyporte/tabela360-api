import { IsString, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
  @IsString() leadId: string;
  @IsNumber() @Min(0) price: number;
  @IsString() message?: string;
}