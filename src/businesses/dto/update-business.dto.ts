import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export class UpdateBusinessDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() @IsInt() districtId?: number;
  @IsOptional() @IsArray() @IsInt({ each: true }) categoryIds?: number[];
}