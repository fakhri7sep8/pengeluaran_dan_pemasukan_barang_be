import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pembelian } from '../pembelian/pembelian.entity';
import { Penjualan } from '../penjualan/penjualan.entity';

@Entity()
export class Barang {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kode: string;

  @Column()
  nama: string; 

  @Column()
  satuan: string;

  @Column()
  items: string; 

  @Column({ default: 0 })
  saldo: number;


  @OneToMany(() => Pembelian, (p) => p.barang)
  pembelian: Pembelian[];

  @OneToMany(() => Penjualan, (p) => p.barang)
  penjualan: Penjualan[];

}
