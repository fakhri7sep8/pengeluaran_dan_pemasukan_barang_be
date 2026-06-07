import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/auth.entity';
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
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'backend_pkl',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
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
