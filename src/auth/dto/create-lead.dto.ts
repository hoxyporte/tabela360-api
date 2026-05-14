import { IsInt, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateLeadDto {
  @IsInt()
  categoryId: number;

  @IsInt()
  cityId: number;

  @IsInt()
  districtId: number;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  description?: string;
}