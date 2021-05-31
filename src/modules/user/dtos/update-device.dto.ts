import { IsNotEmpty } from 'class-validator'

export class UpdateDeviceDto {
  @IsNotEmpty()
  deviceId: string
}