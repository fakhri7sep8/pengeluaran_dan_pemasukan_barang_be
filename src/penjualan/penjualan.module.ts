import { Module } from '@nestjs/common';
import { PenjualanController } from './penjualan.controller';
import { PenjualanService } from './penjualan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Penjualan } from './penjualan.entity';
import { Barang } from 'src/barang/barang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Penjualan ,Barang])],
  controllers: [PenjualanController],
  providers: [PenjualanService]
})
export class PenjualanModule {}
