import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SensorData } from './sensor-data.entity';

@Injectable()
export class SensorDataService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
  ) {}

  // Lấy toàn bộ dữ liệu cảm biến
  async findAll() {
    return this.sensorDataRepository.find({
      order: {
        recorded_at: 'DESC',
      },
    });
  }

  // Lấy dữ liệu của một thiết bị
  async findByDeviceId(deviceId: number) {
    return this.sensorDataRepository.find({
      where: {
        device_id: deviceId,
      },
      order: {
        recorded_at: 'DESC',
      },
    });
  }

  // Lấy dữ liệu của thiết bị trong một khoảng thời gian
  async findByDeviceIdAndTime(
    deviceId: number,
    from: Date,
    to: Date,
  ) {
    return this.sensorDataRepository
      .createQueryBuilder('sensor')
      .where('sensor.device_id = :deviceId', {
        deviceId,
      })
      .andWhere(
        'sensor.recorded_at BETWEEN :from AND :to',
        {
          from,
          to,
        },
      )
      .orderBy(
        'sensor.recorded_at',
        'ASC',
      )
      .getMany();
  }

  // Lấy các dữ liệu có nhiệt độ vi phạm ngưỡng
  async findViolations(deviceId: number) {
    return this.sensorDataRepository
      .createQueryBuilder('sensor')
      .where(
        'sensor.device_id = :deviceId',
        {
          deviceId,
        },
      )
      .andWhere(
        '(sensor.temperature < :minTemp OR sensor.temperature > :maxTemp)',
        {
          minTemp: 2,
          maxTemp: 8,
        },
      )
      .orderBy(
        'sensor.recorded_at',
        'DESC',
      )
      .getMany();
  }
}