import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SensorData } from './sensor-data.entity';
import { SensorDataController } from './sensor-data.controller';
import { SensorDataService } from './sensor-data.service';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SensorData]),
    AlertsModule,
  ],
  controllers: [SensorDataController],
  providers: [SensorDataService],
})
export class SensorDataModule {}