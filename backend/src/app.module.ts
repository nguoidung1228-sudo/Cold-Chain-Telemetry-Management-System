import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '20102006',
      database: 'cold_chain_db',

      autoLoadEntities: true,
      synchronize: false,
    }),
    DevicesModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}