import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Alert } from './alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  // ==============================
  // KIỂM TRA NHIỆT ĐỘ
  // ==============================
  async checkTemperature(
    temperature: number,
    deviceId: number,
    shipmentId?: number,
    sensorDataId?: number,
  ) {
    const MIN_TEMPERATURE = 2;
    const MAX_TEMPERATURE = 8;

    // Nhiệt độ bình thường
    if (
      temperature >= MIN_TEMPERATURE &&
      temperature <= MAX_TEMPERATURE
    ) {
      return {
        alert: false,
        message: 'Nhiệt độ bình thường',
        temperature,
      };
    }

    let alertType: string;
    let severity: string;
    let message: string;

    // Nhiệt độ quá thấp
    if (temperature < MIN_TEMPERATURE) {
      alertType = 'LOW_TEMPERATURE';

      severity =
        temperature < 1
          ? 'CRITICAL'
          : 'WARNING';

      message =
        'Nhiệt độ thấp hơn ngưỡng cho phép';
    }

    // Nhiệt độ quá cao
    else {
      alertType = 'HIGH_TEMPERATURE';

      severity =
        temperature > 10
          ? 'CRITICAL'
          : 'WARNING';

      message =
        'Nhiệt độ cao hơn ngưỡng cho phép';
    }

    // Kiểm tra xem đã có cảnh báo chưa được xử lý chưa
    const recentAlert =
      await this.alertRepository.findOne({
        where: {
          device_id: deviceId,
          alert_type: alertType,
          status: 'UNRESOLVED',
        },
        order: {
          created_at: 'DESC',
        },
      });

    // Nếu đã có cảnh báo thì không tạo thêm
    if (recentAlert) {
      return {
        alert: true,
        duplicated: true,
        message: 'Đã có cảnh báo chưa được xử lý',
        alertId: recentAlert.id,
        temperature,
      };
    }

    // Tạo cảnh báo mới
    const newAlert =
      this.alertRepository.create({
        sensor_data_id:
          sensorDataId ?? null,

        device_id: deviceId,

        shipment_id:
          shipmentId ?? null,

        alert_type: alertType,

        message,

        temperature,

        severity,

        status: 'UNRESOLVED',
      });

    const savedAlert =
      await this.alertRepository.save(newAlert);

    return {
      alert: true,
      duplicated: false,
      alertId: savedAlert.id,
      type: alertType,
      severity,
      message,
      temperature,
    };
  }

  // ==============================
  // LẤY TẤT CẢ CẢNH BÁO
  // ==============================
  async findAll() {
    return this.alertRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  // ==============================
  // LẤY CẢNH BÁO THEO DEVICE
  // ==============================
  async findByDeviceId(deviceId: number) {
    return this.alertRepository.find({
      where: {
        device_id: deviceId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  // ==============================
  // XỬ LÝ CẢNH BÁO
  // ==============================
  async resolveAlert(id: number) {
    const alert =
      await this.alertRepository.findOne({
        where: {
          id,
        },
      });

    // Không tìm thấy cảnh báo
    if (!alert) {
      return {
        success: false,
        message: 'Không tìm thấy cảnh báo',
      };
    }

    // Cảnh báo đã được xử lý
    if (alert.status === 'RESOLVED') {
      return {
        success: false,
        message: 'Cảnh báo này đã được xử lý',
        alertId: alert.id,
      };
    }

    // Cập nhật trạng thái
    alert.status = 'RESOLVED';
    alert.resolved_at = new Date();

    const updatedAlert =
      await this.alertRepository.save(alert);

    return {
      success: true,
      message: 'Đã xử lý cảnh báo',
      alert: updatedAlert,
    };
  }
}