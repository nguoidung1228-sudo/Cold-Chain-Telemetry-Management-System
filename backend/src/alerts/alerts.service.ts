import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertsService {

  // Kiểm tra một giá trị nhiệt độ
  checkTemperature(
    temperature: number,
  ) {
    const MIN_TEMPERATURE = 2;
    const MAX_TEMPERATURE = 8;

    // Nhiệt độ thấp hơn mức cho phép
    if (temperature < MIN_TEMPERATURE) {
      return {
        alert: true,
        type: 'TEMPERATURE_LOW',
        severity: 'WARNING',
        message: `Nhiệt độ quá thấp: ${temperature}°C`,
        temperature,
      };
    }

    // Nhiệt độ cao hơn mức cho phép
    if (temperature > MAX_TEMPERATURE) {
      return {
        alert: true,
        type: 'TEMPERATURE_HIGH',
        severity: 'CRITICAL',
        message: `Nhiệt độ quá cao: ${temperature}°C`,
        temperature,
      };
    }

    // Nhiệt độ bình thường
    return {
      alert: false,
      type: null,
      severity: null,
      message: 'Nhiệt độ bình thường',
      temperature,
    };
  }
}