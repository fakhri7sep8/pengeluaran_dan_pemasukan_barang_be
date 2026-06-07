import { Type } from "class-transformer";
import { IsString, IsNumber, Min, IsNotEmpty } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';


export class CreateBarangDto {
  @IsString()
  @IsNotEmpty()
  kode: string;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  satuan: string;

  @IsString()
  @IsNotEmpty()
  items: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  saldo: number;

}

export class UpdateBarangDto extends PartialType(CreateBarangDto) {}