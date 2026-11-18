import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { CreditRequestStatus } from './credit-request-status.js';

@Entity('credit_requests')
export class CreditRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  cedula: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  amount: number;

  @Column({ type: 'int' })
  termMonths: number;

  @Column({ type: 'varchar', length: 10, default: 'PENDING' })
  status: CreditRequestStatus;

  @Column({ type: 'text', nullable: true })
  statusComment: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
