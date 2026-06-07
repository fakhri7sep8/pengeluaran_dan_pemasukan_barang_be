import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { Penjualan } from "./penjualan.entity";
import { Barang } from "../barang/barang.entity";
import { CreatePenjualanDto, UpdatePenjualanDto } from "./penjualan.dto";

@Injectable()
export class PenjualanService {
  constructor(
    @InjectRepository(Penjualan)
    private penjualanRepo: Repository<Penjualan>,

    @InjectRepository(Barang)
    private barangRepo: Repository<Barang>,
  ) {}

 async create(dto: CreatePenjualanDto) {
  try {
    const barang = await this.barangRepo.findOne({
      where: { id: dto.barangId },
    });

    if (!barang) throw new BadRequestException("Barang tidak ditemukan");

    if (dto.qty > barang.saldo) {
      throw new BadRequestException("Stok tidak cukup");
    }

    barang.saldo -= dto.qty;
    await this.barangRepo.save(barang);

    const penjualan = this.penjualanRepo.create({
      barang,
      qty: dto.qty,
      No_Inv: dto.No_Inv,
    });

    return await this.penjualanRepo.save(penjualan);
  } catch (error) {
    if (error instanceof QueryFailedError) {
      const msg = (error as any).message;

      if (
        msg.includes("Duplicate") ||
        msg.includes("duplicate") ||
        msg.includes("No_Inv")
      ) {
        throw new BadRequestException("No Invoice sudah digunakan");
      }
    }

    throw error;
  }
}


  findAll() {
    return this.penjualanRepo.find({ order: { tanggal: "DESC" } });
  }

   async findOne(id: number) {
    const penjualan = await this.penjualanRepo.findOne({
      where: { id },
      relations: ["barang"],
    });

    if (!penjualan) {
      throw new NotFoundException("Penjualan tidak ditemukan");
    }

    return penjualan;
  }

  async update(id: number, dto: UpdatePenjualanDto) {
    const penjualan = await this.penjualanRepo.findOne({
      where: { id },
      relations: ["barang"],
    });

    if (!penjualan) {
      throw new NotFoundException("Penjualan tidak ditemukan");
    }

    const barang = penjualan.barang;

    if (dto.qty !== undefined && dto.qty !== penjualan.qty) {
      const selisih = dto.qty - penjualan.qty;
      barang.saldo -= selisih;

      if (barang.saldo < 0) {
        throw new BadRequestException("Stok tidak mencukupi");
      }

      penjualan.qty = dto.qty;
    }

    if (dto.No_Inv !== undefined) {
      penjualan.No_Inv = dto.No_Inv;
    }

    await this.barangRepo.save(barang);
    return this.penjualanRepo.save(penjualan);
  }
}
