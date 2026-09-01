import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 50 })
  device_code!: string;

  @Column({ length: 100 })
  device_name!: string;

  @Column({ length: 50, default: 'SENSOR' })
  device_type!: string;

  @Column({ length: 20, default: 'ACTIVE' })
  status!: string;

  @CreateDateColumn()
  created_at!: Date;
}