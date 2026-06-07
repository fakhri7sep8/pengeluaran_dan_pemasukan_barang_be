import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Barang } from '../barang/barang.entity';

@Entity()
export class Penjualan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Barang, (b) => b.penjualan, { eager: true })
  barang: Barang;

  @Column()
  qty: number;

  @Column({ unique: true })
  No_Inv: string;

  @CreateDateColumn()
  tanggal: Date;
}
