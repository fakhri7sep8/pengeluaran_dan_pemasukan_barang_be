import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Barang } from './barang.entity';
import { CreateBarangDto, UpdateBarangDto } from './barang.dto';

@Injectable()
export class BarangService {
  constructor(
    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
  ) {}

  findAll() {
    return this.barangRepo.find({ order: { nama: 'ASC' } });
  }

  findById(id: number) {
    return this.barangRepo.findOne({ where: { id } });
  }

 async create(dto: CreateBarangDto) {
  try {
    const barang = this.barangRepo.create({
      kode: dto.kode,
      nama: dto.nama,
      satuan: dto.satuan,
      items: dto.items,
      saldo: dto.saldo,
    });

    return await this.barangRepo.save(barang);
  } catch (error) {
    // MySQL / Postgres duplicate key
    if (error instanceof QueryFailedError) {
      const msg = (error as any).message;

      if (msg.includes('Duplicate') || msg.includes('duplicate')) {
        throw new BadRequestException('Kode barang sudah dipakai');
      }
    }

    throw error;
  }
}

  async update(id: number, dto: UpdateBarangDto) {
    const barang = await this.findById(id);

    if (!barang) {
      throw new NotFoundException('Barang tidak ditemukan');
    }

    this.barangRepo.merge(barang, dto);
    return this.barangRepo.save(barang);
  }
}
