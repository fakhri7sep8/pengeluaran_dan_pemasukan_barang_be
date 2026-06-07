import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class UpdatePembelianDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  qty?: number;

  @IsOptional()
  @IsString()
  No_Po?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  barangId?: number;
}


export class CreatePembelianDto {
  @Type(() => Number)
  @IsNumber()
  barangId: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  qty: number;

  @IsString()
  No_Po: string;
}