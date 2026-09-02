import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('sensor_data')
export class SensorData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  device_id!: number;

  @Column()
  shipment_id!: number;

  @Column('decimal', { precision: 5, scale: 2 })
  temperature!: number;

  @Column('decimal', { precision: 5, scale: 2 })
  humidity!: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude!: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude!: number;

  @Column()
  recorded_at!: Date;
}