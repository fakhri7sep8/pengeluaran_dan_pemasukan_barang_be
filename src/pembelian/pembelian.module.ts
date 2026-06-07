import { Module } from '@nestjs/common';
import { PembelianService } from './pembelian.service';
import { PembelianController } from './pembelian.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pembelian } from './pembelian.entity';
import { Barang } from 'src/barang/barang.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Pembelian , Barang])],
  providers: [PembelianService],
  controllers: [PembelianController]
})
export class PembelianModule {}
