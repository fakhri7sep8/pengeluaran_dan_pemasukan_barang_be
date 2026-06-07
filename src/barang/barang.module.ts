import { Module } from '@nestjs/common';
import { BarangService } from './barang.service';
import { BarangController } from './barang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barang } from './barang.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Barang])],
  providers: [BarangService],
  controllers: [BarangController]
})
export class BarangModule {}
