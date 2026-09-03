import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'bigint', nullable: true })
  sensor_data_id!: number | null;

  @Column({ type: 'int' })
  device_id!: number;

  @Column({ type: 'int', nullable: true })
  shipment_id!: number | null;

  @Column({ type: 'varchar', length: 50 })
  alert_type!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  temperature!: number | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'WARNING',
  })
  severity!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'UNRESOLVED',
  })
  status!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  resolved_at!: Date | null;
}