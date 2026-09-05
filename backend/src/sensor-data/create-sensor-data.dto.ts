export class CreateSensorDataDto {
  device_id!: number;

  shipment_id!: number;

  temperature!: number;

  humidity!: number;

  latitude?: number;

  longitude?: number;

  recorded_at?: Date;
}