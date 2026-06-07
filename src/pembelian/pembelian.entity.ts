import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Barang } from '../barang/barang.entity';

@Entity()
export class Pembelian {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Barang, (b) => b.pembelian, { eager: true })
  barang: Barang;

  @Column()
  qty: number;

  @Column({ unique: true })
  No_Po: string;

  @CreateDateColumn()
  tanggal: Date;
}
