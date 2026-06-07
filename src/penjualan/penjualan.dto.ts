import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePenjualanDto {
  @IsNumber()
   @Type(() => Number)
  @IsNotEmpty()
  barangId: number;

  @IsNumber()
   @Type(() => Number)
  @Min(1)
  qty: number;

  @IsString()
  @IsNotEmpty()
  No_Inv: string;
}

export class UpdatePenjualanDto {
  @IsOptional()
  @IsNumber()
   @Type(() => Number)
  @Min(1)
  qty?: number;

  @IsOptional()
  @IsString()
  No_Inv?: string;
}
