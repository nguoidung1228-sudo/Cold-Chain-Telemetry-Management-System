import {
  Controller,
  Get,
  Query,
  ParseFloatPipe,
  ParseIntPipe,
  Param,
  Patch,
} from '@nestjs/common';

import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly alertsService: AlertsService,
  ) {}

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Get('device/:deviceId')
  findByDeviceId(
    @Param('deviceId', ParseIntPipe)
    deviceId: number,
  ) {
    return this.alertsService.findByDeviceId(deviceId);
  }

  @Patch(':id/resolve')
  resolveAlert(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.alertsService.resolveAlert(id);
  }

  @Get('check-temperature')
  checkTemperature(
    @Query('temperature', ParseFloatPipe)
    temperature: number,

    @Query('deviceId', ParseIntPipe)
    deviceId: number,

    @Query('shipmentId', ParseIntPipe)
    shipmentId: number,

    @Query('sensorDataId', ParseIntPipe)
    sensorDataId: number,
  ) {
    return this.alertsService.checkTemperature(
      temperature,
      deviceId,
      shipmentId,
      sensorDataId,
    );
  }
}