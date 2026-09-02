import {
  Controller,
  Get,
  Query,
  ParseFloatPipe,
} from '@nestjs/common';

import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {

  constructor(
    private readonly alertsService: AlertsService,
  ) {}

  @Get('check-temperature')
  checkTemperature(
    @Query(
      'temperature',
      ParseFloatPipe,
    )
    temperature: number,
  ) {
    return this.alertsService.checkTemperature(
      temperature,
    );
  }
}