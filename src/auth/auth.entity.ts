import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

 @Column({ type: 'varchar', length: 6, nullable: true })
  resetCode: string | null;

  // expired time → simpan sebagai datetime
  @Column({ type: 'datetime', nullable: true })
  resetCodeExpires: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
