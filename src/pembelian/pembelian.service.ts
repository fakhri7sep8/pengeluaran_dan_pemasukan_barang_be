import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Pembelian } from './pembelian.entity';
import { Barang } from '../barang/barang.entity';
import { CreatePembelianDto, UpdatePembelianDto } from './pembelian.dto';

@Injectable()
export class PembelianService {
  constructor(
    @InjectRepository(Pembelian)
    private pembelianRepo: Repository<Pembelian>,

    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
  ) {}

async create(dto: CreatePembelianDto) {
  try {
    const barang = await this.barangRepo.findOne({
      where: { id: dto.barangId },
    });

    if (!barang) {
      throw new NotFoundException('Barang tidak ditemukan');
    }

    // tambah saldo
    barang.saldo += dto.qty;
    await this.barangRepo.save(barang);

    const pembelian = this.pembelianRepo.create({
      barang,
      qty: dto.qty,
      No_Po: dto.No_Po,
    });

    return await this.pembelianRepo.save(pembelian);
  } catch (error) {
    if (error instanceof QueryFailedError) {
      const msg = (error as any).message;

      if (
        msg.includes('Duplicate') ||
        msg.includes('duplicate') ||
        msg.includes('No_Po')
      ) {
        throw new BadRequestException('No PO sudah digunakan');
      }
    }

    throw error;
  }
}

  findAll() {
    return this.pembelianRepo.find({ order: { tanggal: 'DESC' } });
  }

  async findOne(id: number) {
    const data = await this.pembelianRepo.findOne({
      where: { id },
      relations: ['barang'],
    });

    if (!data) throw new NotFoundException('Pembelian tidak ditemukan');
    return data;
  }

  async update(id: number, dto: UpdatePembelianDto) {
    const pembelian = await this.pembelianRepo.findOne({
      where: { id },
      relations: ['barang'],
    });

    if (!pembelian) {
      throw new NotFoundException('Pembelian tidak ditemukan');
    }

    let barang = pembelian.barang;

    // 🔄 ganti barang (opsional)
    if (dto.barangId && dto.barangId !== barang.id) {
      const newBarang = await this.barangRepo.findOne({
        where: { id: dto.barangId },
      });

      if (!newBarang) {
        throw new BadRequestException('Barang baru tidak ditemukan');
      }

      // rollback saldo lama
      barang.saldo -= pembelian.qty;
      if (barang.saldo < 0) {
        throw new BadRequestException('Saldo barang lama tidak valid');
      }

      // apply ke barang baru
      newBarang.saldo += pembelian.qty;

      await this.barangRepo.save(barang);
      await this.barangRepo.save(newBarang);

      pembelian.barang = newBarang;
      barang = newBarang;
    }

    // 🔢 update qty
    if (dto.qty !== undefined && dto.qty !== pembelian.qty) {
      const selisih = dto.qty - pembelian.qty;
      barang.saldo += selisih;

      if (barang.saldo < 0) {
        throw new BadRequestException('Saldo barang tidak mencukupi');
      }

      pembelian.qty = dto.qty;
      await this.barangRepo.save(barang);
    }

    // 🧾 update No PO
    if (dto.No_Po !== undefined) {
      pembelian.No_Po = dto.No_Po;
    }

    return this.pembelianRepo.save(pembelian);
  }

  async remove(id: number) {
    const pembelian = await this.pembelianRepo.findOne({
      where: { id },
      relations: ['barang'],
    });

    if (!pembelian) {
      throw new NotFoundException('Pembelian tidak ditemukan');
    }

    pembelian.barang.saldo -= pembelian.qty;

    if (pembelian.barang.saldo < 0) {
      throw new BadRequestException('Saldo barang tidak valid');
    }

    await this.barangRepo.save(pembelian.barang);
    await this.pembelianRepo.remove(pembelian);

    return { message: 'Pembelian berhasil dihapus' };
  }
}
