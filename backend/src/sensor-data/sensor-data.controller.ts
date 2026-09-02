import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { SensorDataService } from './sensor-data.service';

@Controller('sensor-data')
export class SensorDataController {
  constructor(
    private readonly sensorDataService: SensorDataService,
  ) {}

  // GET /sensor-data
  @Get()
  findAll() {
    return this.sensorDataService.findAll();
  }

  // GET /sensor-data/device/:deviceId
  @Get('device/:deviceId')
  findByDeviceId(
    @Param('deviceId', ParseIntPipe)
    deviceId: number,
  ) {
    return this.sensorDataService.findByDeviceId(
      deviceId,
    );
  }

  // GET /sensor-data/device/:deviceId/time-range
  @Get('device/:deviceId/time-range')
  findByDeviceIdAndTime(
    @Param('deviceId', ParseIntPipe)
    deviceId: number,

    @Query('from')
    from: string,

    @Query('to')
    to: string,
  ) {
    return this.sensorDataService.findByDeviceIdAndTime(
      deviceId,
      new Date(from),
      new Date(to),
    );
  }

  // GET /sensor-data/device/:deviceId/violations
  @Get('device/:deviceId/violations')
  findViolations(
    @Param('deviceId', ParseIntPipe)
    deviceId: number,
  ) {
    return this.sensorDataService.findViolations(
      deviceId,
    );
  }
}