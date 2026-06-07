import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BarangModule } from './barang/barang.module';
import { PembelianModule } from './pembelian/pembelian.module';
import { PenjualanModule } from './penjualan/penjualan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      // Langsung tembak host gateway TiDB Cloud lo
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000, // Port bawaan TiDB Cloud
      username: '3pcvfGbj9AQaYDU.root',
      password: 'Pr7plpVlQiT5cJLn',
      database: 'backend_pkl',
      
      // Menggunakan auto load biar gak pusing urusan typo path __dirname
      autoLoadEntities: true,
      
      // Biar tabel baru lo (barang, pembelian, dll) otomatis dibuat di cloud
      synchronize: true, 

      // WAJIB ADA: Pengaman SSL agar koneksi ke cloud tidak ECONNREFUSED
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    BarangModule,
    PembelianModule,
    PenjualanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}